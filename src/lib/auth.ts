import { cookies, headers } from "next/headers";
import { getCloudflareContext } from "@opennextjs/cloudflare";
import { hashPassword, verifyPassword as verifyPasswordHash, generateOpaqueToken } from "@/lib/crypto";
import {
  getAdminUserByEmail,
  getAdminUserById,
  createAdminSession,
  getAdminSession,
  touchAdminSession,
  revokeAdminSession,
  touchAdminUserLogin,
  isLoginLocked,
  registerFailedLoginAttempt,
  resetLoginAttempts,
  type AdminRole,
} from "@/lib/db";

const COOKIE_NAME = "lp_admin_session";
const SESSION_TTL_HOURS = 12;

// -----------------------------------------------------------------------------
// Ponte legada — o ADMIN_PASSWORD único continua funcionando exatamente como
// antes (mesmo cookie determinístico, mesmo comportamento), pra nunca bloquear
// o acesso do Diego enquanto as contas reais (Luciana/Jhonatan) não existem.
// Uma sessão autenticada por essa ponte tem privilégio de superadmin "virtual"
// (sem linha em admin_users) — é assim que o Diego cria as contas reais na área
// de Usuários, sem precisar de nenhum secret novo.
// -----------------------------------------------------------------------------

async function sha256(text: string) {
  const data = new TextEncoder().encode(text);
  const hashBuffer = await crypto.subtle.digest("SHA-256", data);
  return Array.from(new Uint8Array(hashBuffer))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
}

async function getLegacyAdminPassword() {
  const { env } = await getCloudflareContext({ async: true });
  return env.ADMIN_PASSWORD;
}

async function legacyExpectedToken() {
  const password = await getLegacyAdminPassword();
  if (!password) return null;
  return sha256(`lp-admin:${password}`);
}

export interface AdminSessionInfo {
  authenticated: boolean;
  role: AdminRole | null;
  userId: number | null;
  name: string | null;
  isLegacy: boolean;
}

const UNAUTHENTICATED: AdminSessionInfo = {
  authenticated: false,
  role: null,
  userId: null,
  name: null,
  isLegacy: false,
};

export async function getSession(): Promise<AdminSessionInfo> {
  const store = await cookies();
  const value = store.get(COOKIE_NAME)?.value;
  if (!value) return UNAUTHENTICATED;

  // 1. Sessão real (D1-backed).
  try {
    const session = await getAdminSession(value);
    if (session && !session.revoked_at && session.expires_at > new Date().toISOString()) {
      const user = await getAdminUserById(session.user_id);
      if (user && user.status === "active") {
        await touchAdminSession(value);
        return { authenticated: true, role: user.role, userId: user.id, name: user.name, isLegacy: false };
      }
    }
  } catch {
    // segue pra checagem legada
  }

  // 2. Ponte legada (ADMIN_PASSWORD).
  try {
    const legacyToken = await legacyExpectedToken();
    if (legacyToken && value === legacyToken) {
      return {
        authenticated: true,
        role: "superadmin",
        userId: null,
        name: "Diego (acesso legado)",
        isLegacy: true,
      };
    }
  } catch {
    // ADMIN_PASSWORD não configurado
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
  const token = generateOpaqueToken();
  const expiresAt = new Date(Date.now() + SESSION_TTL_HOURS * 60 * 60 * 1000).toISOString();
  const h = await headers();
  await createAdminSession({
    id: token,
    userId,
    expiresAt,
    userAgent: h.get("user-agent"),
  });
  await touchAdminUserLogin(userId);

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
// Login legado (só senha — comportamento preservado)
// -----------------------------------------------------------------------------

export async function verifyLegacyPassword(password: string) {
  const configured = await getLegacyAdminPassword();
  if (!configured) return false;
  return password === configured;
}

export async function createLegacySessionCookie() {
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
// Logout — revoga sessão real no banco (se houver) e sempre limpa o cookie.
// -----------------------------------------------------------------------------

export async function destroySessionCookie() {
  const store = await cookies();
  const value = store.get(COOKIE_NAME)?.value;
  if (value) {
    try {
      await revokeAdminSession(value);
    } catch {
      // token legado não existe na tabela de sessões — tudo bem, só limpa o cookie
    }
  }
  store.delete(COOKIE_NAME);
}

export { hashPassword };
