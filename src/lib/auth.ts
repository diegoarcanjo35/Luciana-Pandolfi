import { cookies, headers } from "next/headers";
import { getCloudflareContext } from "@opennextjs/cloudflare";
import {
  hashPassword,
  verifyPassword as verifyPasswordHash,
  generateOpaqueToken,
  sha256Hex,
  timingSafeEqualString,
} from "@/lib/crypto";
import { isPasswordStrongEnough } from "@/lib/password-policy";
import { isDbSessionValid, isLegacyAdminEnabled } from "@/lib/session-logic";
import {
  getAdminUserByEmail,
  getAdminUserById,
  createAdminSession,
  getAdminSessionByTokenHash,
  touchAdminSessionByTokenHash,
  revokeAdminSessionByTokenHash,
  touchAdminUserLogin,
  updateAdminUserPassword,
  isLoginLocked,
  registerFailedLoginAttempt,
  resetLoginAttempts,
  type AdminRole,
} from "@/lib/db";

const COOKIE_NAME = "lp_admin_session";
const SESSION_TTL_HOURS = 12;

// -----------------------------------------------------------------------------
// Ponte legada — o ADMIN_PASSWORD único continua funcionando, controlada por
// LEGACY_ADMIN_ENABLED (default: habilitada — nunca desativa sozinha, pra nunca
// travar o acesso do Diego antes de existir conta real). Uma sessão autenticada
// por essa ponte tem privilégio de superadmin "virtual" (sem linha em
// admin_users) — é assim que o Diego cria as contas reais na área de Usuários,
// sem precisar de nenhum secret novo. Depois de LEGACY_ADMIN_ENABLED=false,
// nenhum cookie legado antigo é mais aceito (ver getSession abaixo).
// -----------------------------------------------------------------------------

async function getEnv() {
  const { env } = await getCloudflareContext({ async: true });
  return env;
}

async function legacyEnabled() {
  const env = await getEnv();
  return isLegacyAdminEnabled(env.LEGACY_ADMIN_ENABLED);
}

async function legacyExpectedToken() {
  const env = await getEnv();
  const password = env.ADMIN_PASSWORD;
  if (!password) return null;
  return sha256Hex(`lp-admin:${password}`);
}

export interface AdminSessionInfo {
  authenticated: boolean;
  role: AdminRole | null;
  userId: number | null;
  name: string | null;
  isLegacy: boolean;
  mustChangePassword: boolean;
}

const UNAUTHENTICATED: AdminSessionInfo = {
  authenticated: false,
  role: null,
  userId: null,
  name: null,
  isLegacy: false,
  mustChangePassword: false,
};

export async function getSession(): Promise<AdminSessionInfo> {
  const store = await cookies();
  const value = store.get(COOKIE_NAME)?.value;
  if (!value) return UNAUTHENTICATED;

  // 1. Sessão real (D1-backed) — o cookie guarda o token bruto, o banco só guarda
  // o hash SHA-256 dele. Quem só tem leitura do banco não consegue reconstruir
  // um cookie válido a partir do hash.
  try {
    const tokenHash = await sha256Hex(value);
    const session = await getAdminSessionByTokenHash(tokenHash);
    const user = session ? await getAdminUserById(session.user_id) : null;
    if (isDbSessionValid(session, user, new Date().toISOString())) {
      await touchAdminSessionByTokenHash(tokenHash);
      return {
        authenticated: true,
        role: user!.role,
        userId: user!.id,
        name: user!.name,
        isLegacy: false,
        mustChangePassword: Boolean(user!.must_change_password),
      };
    }
  } catch {
    // segue pra checagem legada
  }

  // 2. Ponte legada (ADMIN_PASSWORD), só quando explicitamente habilitada.
  if (await legacyEnabled()) {
    try {
      const legacyToken = await legacyExpectedToken();
      if (legacyToken && timingSafeEqualString(value, legacyToken)) {
        return {
          authenticated: true,
          role: "superadmin",
          userId: null,
          name: "Diego (acesso legado)",
          isLegacy: true,
          mustChangePassword: false,
        };
      }
    } catch {
      // ADMIN_PASSWORD não configurado
    }
  }

  return UNAUTHENTICATED;
}

export async function isAuthenticated(): Promise<boolean> {
  return (await getSession()).authenticated;
}

export async function requireRole(roles: AdminRole[]): Promise<AdminSessionInfo | null> {
  const session = await getSession();
  if (!session.authenticated || !session.role || !roles.includes(session.role)) return null;
  return session;
}

// -----------------------------------------------------------------------------
// Rate limiting — identificador combina IP (cabeçalho da Cloudflare) + e-mail
// tentado, pra não travar todos os admins por causa de uma tentativa de um
// colega. Também protege o caminho legado.
// -----------------------------------------------------------------------------

export async function getClientIdentifier(emailOrLegacy: string): Promise<string> {
  const h = await headers();
  const ip = h.get("cf-connecting-ip") ?? h.get("x-forwarded-for") ?? "unknown";
  return `${ip}:${emailOrLegacy.toLowerCase()}`;
}

export async function checkLoginRateLimit(identifier: string) {
  return isLoginLocked(identifier);
}

export async function registerLoginFailure(identifier: string) {
  return registerFailedLoginAttempt(identifier);
}

export async function registerLoginSuccess(identifier: string) {
  await resetLoginAttempts(identifier);
}

// -----------------------------------------------------------------------------
// Login real (e-mail + senha, contas em admin_users)
// -----------------------------------------------------------------------------

export async function attemptRealLogin(
  email: string,
  password: string
): Promise<{ ok: true; userId: number; role: AdminRole; name: string } | { ok: false }> {
  const user = await getAdminUserByEmail(email);
  if (!user || user.status !== "active") return { ok: false };
  const valid = await verifyPasswordHash(password, user.password_hash);
  if (!valid) return { ok: false };
  return { ok: true, userId: user.id, role: user.role, name: user.name };
}

export async function createRealSessionCookie(userId: number) {
  const rawToken = generateOpaqueToken();
  const tokenHash = await sha256Hex(rawToken);
  const expiresAt = new Date(Date.now() + SESSION_TTL_HOURS * 60 * 60 * 1000).toISOString();
  const h = await headers();
  await createAdminSession({
    tokenHash,
    userId,
    expiresAt,
    userAgent: h.get("user-agent"),
  });
  await touchAdminUserLogin(userId);

  const store = await cookies();
  store.set(COOKIE_NAME, rawToken, {
    httpOnly: true,
    secure: true,
    sameSite: "lax",
    path: "/",
    maxAge: SESSION_TTL_HOURS * 60 * 60,
  });
}

// -----------------------------------------------------------------------------
// Troca de senha própria (fluxo obrigatório quando must_change_password = 1, mas
// disponível pra qualquer conta real a qualquer momento).
// -----------------------------------------------------------------------------

export type ChangePasswordResult =
  | { ok: true }
  | { ok: false; error: "current_password_invalid" | "new_password_weak" };

export async function changeOwnPassword(
  userId: number,
  currentPassword: string,
  newPassword: string
): Promise<ChangePasswordResult> {
  if (!isPasswordStrongEnough(newPassword)) {
    return { ok: false, error: "new_password_weak" };
  }
  const user = await getAdminUserById(userId);
  if (!user || user.status !== "active") {
    return { ok: false, error: "current_password_invalid" };
  }
  const valid = await verifyPasswordHash(currentPassword, user.password_hash);
  if (!valid) {
    return { ok: false, error: "current_password_invalid" };
  }
  const newHash = await hashPassword(newPassword);
  await updateAdminUserPassword(userId, newHash);
  return { ok: true };
}

// -----------------------------------------------------------------------------
// Login legado (só senha — comportamento preservado, agora com gate explícito
// e comparação em tempo constante)
// -----------------------------------------------------------------------------

export async function verifyLegacyPassword(password: string) {
  if (!(await legacyEnabled())) return false;
  const env = await getEnv();
  const configured = env.ADMIN_PASSWORD;
  if (!configured) return false;
  return timingSafeEqualString(password, configured);
}

export async function createLegacySessionCookie() {
  if (!(await legacyEnabled())) {
    throw new Error("Acesso legado desabilitado (LEGACY_ADMIN_ENABLED=false).");
  }
  const token = await legacyExpectedToken();
  if (!token) throw new Error("ADMIN_PASSWORD não configurado nas variáveis de ambiente.");
  const store = await cookies();
  store.set(COOKIE_NAME, token, {
    httpOnly: true,
    secure: true,
    sameSite: "lax",
    path: "/",
    maxAge: SESSION_TTL_HOURS * 60 * 60,
  });
}

// -----------------------------------------------------------------------------
// Logout — revoga sessão real no banco (se houver, pelo hash) e sempre limpa o
// cookie.
// -----------------------------------------------------------------------------

export async function destroySessionCookie() {
  const store = await cookies();
  const value = store.get(COOKIE_NAME)?.value;
  if (value) {
    try {
      const tokenHash = await sha256Hex(value);
      await revokeAdminSessionByTokenHash(tokenHash);
    } catch {
      // token legado não existe na tabela de sessões — tudo bem, só limpa o cookie
    }
  }
  store.delete(COOKIE_NAME);
}

export { hashPassword };
