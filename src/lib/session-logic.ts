// Regras puras de validade de sessão — sem I/O, testáveis sem D1. `getSession()` em auth.ts
// busca as linhas no banco e delega a decisão pra cá.

export interface SessionRowLike {
  expires_at: string; // ISO/"datetime('now')" — comparável como string
  revoked_at: string | null;
}

export interface UserRowLike {
  status: "active" | "inactive";
}

export function isDbSessionValid(
  session: SessionRowLike | null,
  user: UserRowLike | null,
  nowIso: string
): boolean {
  if (!session) return false;
  if (session.revoked_at) return false;
  if (session.expires_at <= nowIso) return false;
  if (!user) return false;
  if (user.status !== "active") return false;
  return true;
}

/**
 * O caminho legado só é aceito quando LEGACY_ADMIN_ENABLED não é explicitamente "false".
 * Não desativar automaticamente é intencional — evita travar o acesso do Diego antes de
 * existir pelo menos uma conta real criada.
 */
export function isLegacyAdminEnabled(envValue: string | undefined): boolean {
  return envValue !== "false";
}
