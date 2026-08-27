import { getCloudflareContext } from "@opennextjs/cloudflare";

export interface LeadInput {
  form_type: "isca" | "qualificacao";
  source_page: string;
  campaign?: string | null;
  nome: string;
  whatsapp: string;
  email?: string | null;
  para_quem?: string | null;
  quantidade_pessoas?: string | null;
  ja_tem_plano?: string | null;
  quando_resolver?: string | null;
  hospital_especifico?: string | null;
  numero_vidas?: string | null;
  utm_source?: string | null;
  utm_medium?: string | null;
  utm_campaign?: string | null;
  utm_content?: string | null;
  utm_term?: string | null;
  promotion_slug?: string | null;
}

export async function getDB() {
  const { env } = await getCloudflareContext({ async: true });
  return env.DB as D1Database;
}

export async function insertLead(lead: LeadInput) {
  const db = await getDB();
  await db
    .prepare(
      `INSERT INTO leads (
        form_type, source_page, campaign, nome, whatsapp, email,
        para_quem, quantidade_pessoas, ja_tem_plano, quando_resolver,
        hospital_especifico, numero_vidas,
        utm_source, utm_medium, utm_campaign, utm_content, utm_term, promotion_slug
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`
    )
    .bind(
      lead.form_type,
      lead.source_page,
      lead.campaign ?? null,
      lead.nome,
      lead.whatsapp,
      lead.email ?? null,
      lead.para_quem ?? null,
      lead.quantidade_pessoas ?? null,
      lead.ja_tem_plano ?? null,
      lead.quando_resolver ?? null,
      lead.hospital_especifico ?? null,
      lead.numero_vidas ?? null,
      lead.utm_source ?? null,
      lead.utm_medium ?? null,
      lead.utm_campaign ?? null,
      lead.utm_content ?? null,
      lead.utm_term ?? null,
      lead.promotion_slug ?? null
    )
    .run();
}

export interface LeadRow extends LeadInput {
  id: number;
  created_at: string;
  status: string;
}

export async function listLeads(): Promise<LeadRow[]> {
  const db = await getDB();
  const { results } = await db
    .prepare(`SELECT * FROM leads ORDER BY created_at DESC LIMIT 500`)
    .all<LeadRow>();
  return results;
}

// ---------------------------------------------------------------------------
// Contas administrativas
// ---------------------------------------------------------------------------

export type AdminRole = "superadmin" | "admin";
export type AdminStatus = "active" | "inactive";

export interface AdminUserRow {
  id: number;
  name: string;
  email: string;
  password_hash: string;
  role: AdminRole;
  status: AdminStatus;
  created_at: string;
  updated_at: string;
  last_login_at: string | null;
}

export async function getAdminUserByEmail(email: string): Promise<AdminUserRow | null> {
  const db = await getDB();
  const row = await db
    .prepare(`SELECT * FROM admin_users WHERE email = ?`)
    .bind(email.trim().toLowerCase())
    .first<AdminUserRow>();
  return row ?? null;
}

export async function getAdminUserById(id: number): Promise<AdminUserRow | null> {
  const db = await getDB();
  const row = await db.prepare(`SELECT * FROM admin_users WHERE id = ?`).bind(id).first<AdminUserRow>();
  return row ?? null;
}

export async function listAdminUsers(): Promise<Omit<AdminUserRow, "password_hash">[]> {
  const db = await getDB();
  const { results } = await db
    .prepare(
      `SELECT id, name, email, role, status, created_at, updated_at, last_login_at FROM admin_users ORDER BY created_at ASC`
    )
    .all<Omit<AdminUserRow, "password_hash">>();
  return results;
}

export async function countSuperadmins(): Promise<number> {
  const db = await getDB();
  const row = await db
    .prepare(`SELECT COUNT(*) as n FROM admin_users WHERE role = 'superadmin' AND status = 'active'`)
    .first<{ n: number }>();
  return row?.n ?? 0;
}

export async function createAdminUser(input: {
  name: string;
  email: string;
  passwordHash: string;
  role: AdminRole;
}): Promise<number> {
  const db = await getDB();
  const result = await db
    .prepare(
      `INSERT INTO admin_users (name, email, password_hash, role) VALUES (?, ?, ?, ?)`
    )
    .bind(input.name, input.email.trim().toLowerCase(), input.passwordHash, input.role)
    .run();
  return Number(result.meta.last_row_id);
}

export async function updateAdminUserStatus(id: number, status: AdminStatus): Promise<void> {
  const db = await getDB();
  await db
    .prepare(`UPDATE admin_users SET status = ?, updated_at = datetime('now') WHERE id = ?`)
    .bind(status, id)
    .run();
}

export async function touchAdminUserLogin(id: number): Promise<void> {
  const db = await getDB();
  await db
    .prepare(`UPDATE admin_users SET last_login_at = datetime('now') WHERE id = ?`)
    .bind(id)
    .run();
}

// ---------------------------------------------------------------------------
// Sessões administrativas
// ---------------------------------------------------------------------------

export interface AdminSessionRow {
  id: string;
  user_id: number;
  created_at: string;
  expires_at: string;
  last_used_at: string;
  user_agent: string | null;
  revoked_at: string | null;
}

export async function createAdminSession(input: {
  id: string;
  userId: number;
  expiresAt: string;
  userAgent: string | null;
}): Promise<void> {
  const db = await getDB();
  await db
    .prepare(
      `INSERT INTO admin_sessions (id, user_id, expires_at, user_agent) VALUES (?, ?, ?, ?)`
    )
    .bind(input.id, input.userId, input.expiresAt, input.userAgent)
    .run();
}

export async function getAdminSession(id: string): Promise<AdminSessionRow | null> {
  const db = await getDB();
  const row = await db.prepare(`SELECT * FROM admin_sessions WHERE id = ?`).bind(id).first<AdminSessionRow>();
  return row ?? null;
}

export async function touchAdminSession(id: string): Promise<void> {
  const db = await getDB();
  await db
    .prepare(`UPDATE admin_sessions SET last_used_at = datetime('now') WHERE id = ?`)
    .bind(id)
    .run();
}

export async function revokeAdminSession(id: string): Promise<void> {
  const db = await getDB();
  await db
    .prepare(`UPDATE admin_sessions SET revoked_at = datetime('now') WHERE id = ?`)
    .bind(id)
    .run();
}

// ---------------------------------------------------------------------------
// Rate limiting de login
// ---------------------------------------------------------------------------

const MAX_ATTEMPTS = 5;
const LOCKOUT_MINUTES = 15;

interface LoginAttemptRow {
  attempt_count: number;
  first_attempt_at: string;
  locked_until: string | null;
}

/** Só consulta — não registra nenhuma tentativa. Chamar antes de validar a senha. */
export async function isLoginLocked(
  identifier: string
): Promise<{ locked: boolean; retryAfterMinutes?: number }> {
  const db = await getDB();
  const existing = await db
    .prepare(`SELECT * FROM admin_login_attempts WHERE identifier = ?`)
    .bind(identifier)
    .first<LoginAttemptRow>();
  if (!existing?.locked_until) return { locked: false };

  const nowRow = await db.prepare(`SELECT datetime('now') as now`).first<{ now: string }>();
  const now = nowRow?.now ?? new Date().toISOString();
  if (existing.locked_until <= now) return { locked: false };

  const retryAfterMinutes = Math.ceil(
    (new Date(existing.locked_until + "Z").getTime() - new Date(now + "Z").getTime()) / 60000
  );
  return { locked: true, retryAfterMinutes: Math.max(retryAfterMinutes, 1) };
}

/** Chamar só depois que a senha foi conferida e falhou. Retorna se acabou de travar agora. */
export async function registerFailedLoginAttempt(
  identifier: string
): Promise<{ locked: boolean; retryAfterMinutes?: number }> {
  const db = await getDB();
  const existing = await db
    .prepare(`SELECT * FROM admin_login_attempts WHERE identifier = ?`)
    .bind(identifier)
    .first<LoginAttemptRow>();

  if (!existing || existing.locked_until) {
    // Janela nova (ou lockout anterior já expirado): reinicia a contagem.
    await db
      .prepare(
        `INSERT INTO admin_login_attempts (identifier, attempt_count, first_attempt_at, locked_until)
         VALUES (?, 1, datetime('now'), NULL)
         ON CONFLICT(identifier) DO UPDATE SET attempt_count = 1, first_attempt_at = datetime('now'), locked_until = NULL`
      )
      .bind(identifier)
      .run();
    return { locked: false };
  }

  const newCount = existing.attempt_count + 1;
  if (newCount >= MAX_ATTEMPTS) {
    await db
      .prepare(
        `UPDATE admin_login_attempts SET attempt_count = ?, locked_until = datetime('now', '+${LOCKOUT_MINUTES} minutes') WHERE identifier = ?`
      )
      .bind(newCount, identifier)
      .run();
    return { locked: true, retryAfterMinutes: LOCKOUT_MINUTES };
  }

  await db
    .prepare(`UPDATE admin_login_attempts SET attempt_count = ? WHERE identifier = ?`)
    .bind(newCount, identifier)
    .run();
  return { locked: false };
}

/** Chamar depois de um login bem-sucedido — limpa o contador dessa identidade. */
export async function resetLoginAttempts(identifier: string): Promise<void> {
  const db = await getDB();
  await db.prepare(`DELETE FROM admin_login_attempts WHERE identifier = ?`).bind(identifier).run();
}

// ---------------------------------------------------------------------------
// Promoções
// ---------------------------------------------------------------------------

export interface PromotionRow {
  id: number;
  slug: string;
  operator_name: string;
  title: string;
  short_description: string;
  benefit_type: string | null;
  benefit_value: string | null;
  full_conditions: string | null;
  eligible_products: string | null;
  eligible_audience: string | null;
  minimum_lives: number | null;
  maximum_lives: number | null;
  eligible_locations: string | null;
  starts_at: string;
  ends_at: string | null;
  status: "draft" | "active" | "archived";
  is_featured: number;
  display_order: number;
  public_cta_label: string | null;
  public_cta_target: string | null;
  source_name: string | null;
  source_reference: string | null;
  source_verified_at: string | null;
  internal_notes: string | null;
  created_by: number | null;
  updated_by: number | null;
  created_at: string;
  updated_at: string;
  archived_at: string | null;
}

export type PromotionWriteInput = Omit<
  PromotionRow,
  "id" | "created_at" | "updated_at" | "archived_at"
>;

export async function listAllPromotions(): Promise<PromotionRow[]> {
  const db = await getDB();
  const { results } = await db
    .prepare(`SELECT * FROM promotions ORDER BY display_order ASC, created_at DESC`)
    .all<PromotionRow>();
  return results;
}

export async function listActivePromotionsRaw(): Promise<PromotionRow[]> {
  const db = await getDB();
  const { results } = await db
    .prepare(`SELECT * FROM promotions WHERE status = 'active' ORDER BY display_order ASC`)
    .all<PromotionRow>();
  return results;
}

export async function getPromotionById(id: number): Promise<PromotionRow | null> {
  const db = await getDB();
  const row = await db.prepare(`SELECT * FROM promotions WHERE id = ?`).bind(id).first<PromotionRow>();
  return row ?? null;
}

export async function createPromotion(input: PromotionWriteInput): Promise<number> {
  const db = await getDB();
  const result = await db
    .prepare(
      `INSERT INTO promotions (
        slug, operator_name, title, short_description, benefit_type, benefit_value,
        full_conditions, eligible_products, eligible_audience, minimum_lives, maximum_lives,
        eligible_locations, starts_at, ends_at, status, is_featured, display_order,
        public_cta_label, public_cta_target, source_name, source_reference, source_verified_at,
        internal_notes, created_by, updated_by
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`
    )
    .bind(
      input.slug,
      input.operator_name,
      input.title,
      input.short_description,
      input.benefit_type,
      input.benefit_value,
      input.full_conditions,
      input.eligible_products,
      input.eligible_audience,
      input.minimum_lives,
      input.maximum_lives,
      input.eligible_locations,
      input.starts_at,
      input.ends_at,
      input.status,
      input.is_featured,
      input.display_order,
      input.public_cta_label,
      input.public_cta_target,
      input.source_name,
      input.source_reference,
      input.source_verified_at,
      input.internal_notes,
      input.created_by,
      input.updated_by
    )
    .run();
  return Number(result.meta.last_row_id);
}

export async function updatePromotion(
  id: number,
  input: Partial<PromotionWriteInput>
): Promise<void> {
  const db = await getDB();
  const fields = Object.keys(input) as (keyof PromotionWriteInput)[];
  if (fields.length === 0) return;
  const setClause = fields.map((f) => `${f} = ?`).join(", ");
  const values = fields.map((f) => input[f] as unknown);
  await db
    .prepare(`UPDATE promotions SET ${setClause}, updated_at = datetime('now') WHERE id = ?`)
    .bind(...values, id)
    .run();
}

export async function archivePromotion(id: number): Promise<void> {
  const db = await getDB();
  await db
    .prepare(
      `UPDATE promotions SET status = 'archived', archived_at = datetime('now'), updated_at = datetime('now') WHERE id = ?`
    )
    .bind(id)
    .run();
}

export async function deletePromotionPermanently(id: number): Promise<void> {
  const db = await getDB();
  await db.prepare(`DELETE FROM promotions WHERE id = ?`).bind(id).run();
}

export async function logPromotionAudit(entry: {
  promotionId: number;
  action: string;
  actorUserId: number | null;
  actorName: string;
  details?: string | null;
}): Promise<void> {
  const db = await getDB();
  await db
    .prepare(
      `INSERT INTO promotion_audit_log (promotion_id, action, actor_user_id, actor_name, details) VALUES (?, ?, ?, ?, ?)`
    )
    .bind(entry.promotionId, entry.action, entry.actorUserId, entry.actorName, entry.details ?? null)
    .run();
}

export interface PromotionAuditRow {
  id: number;
  promotion_id: number;
  action: string;
  actor_user_id: number | null;
  actor_name: string;
  created_at: string;
  details: string | null;
}

export async function listPromotionAudit(promotionId: number): Promise<PromotionAuditRow[]> {
  const db = await getDB();
  const { results } = await db
    .prepare(`SELECT * FROM promotion_audit_log WHERE promotion_id = ? ORDER BY created_at DESC`)
    .bind(promotionId)
    .all<PromotionAuditRow>();
  return results;
}
