-- Promoções (CRUD administrativo + seção pública) e histórico de alterações.
-- Aditivo — não altera nem remove tabelas existentes.
--
-- `status` guarda só a intenção editorial definida pelo admin: draft | active | archived.
-- Os estados "scheduled" e "expired" (citados no briefing) são CALCULADOS a partir de
-- status + starts_at/ends_at + data atual em America/Sao_Paulo — nunca gravados direto,
-- pra nunca ficarem desatualizados. Ver src/lib/promotions.ts (computeEffectiveStatus).

CREATE TABLE IF NOT EXISTS promotions (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  slug TEXT NOT NULL,
  operator_name TEXT NOT NULL,
  title TEXT NOT NULL,
  short_description TEXT NOT NULL,
  benefit_type TEXT,
  benefit_value TEXT,
  full_conditions TEXT,
  eligible_products TEXT,
  eligible_audience TEXT,
  minimum_lives INTEGER,
  maximum_lives INTEGER,
  eligible_locations TEXT,
  starts_at TEXT NOT NULL,
  ends_at TEXT,
  status TEXT NOT NULL DEFAULT 'draft' CHECK (status IN ('draft', 'active', 'archived')),
  is_featured INTEGER NOT NULL DEFAULT 0,
  display_order INTEGER NOT NULL DEFAULT 0,
  public_cta_label TEXT,
  public_cta_target TEXT,
  source_name TEXT,
  source_reference TEXT,
  source_verified_at TEXT,
  internal_notes TEXT,
  created_by INTEGER,
  updated_by INTEGER,
  created_at TEXT NOT NULL DEFAULT (datetime('now')),
  updated_at TEXT NOT NULL DEFAULT (datetime('now')),
  archived_at TEXT
);
CREATE UNIQUE INDEX IF NOT EXISTS idx_promotions_slug ON promotions(slug);
CREATE INDEX IF NOT EXISTS idx_promotions_status ON promotions(status);
CREATE INDEX IF NOT EXISTS idx_promotions_display_order ON promotions(display_order);

CREATE TABLE IF NOT EXISTS promotion_audit_log (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  promotion_id INTEGER NOT NULL REFERENCES promotions(id),
  action TEXT NOT NULL,
  actor_user_id INTEGER,
  actor_name TEXT NOT NULL,
  created_at TEXT NOT NULL DEFAULT (datetime('now')),
  details TEXT
);
CREATE INDEX IF NOT EXISTS idx_promotion_audit_promotion ON promotion_audit_log(promotion_id);

-- Coluna aditiva e opcional em `leads`, pra registrar qual promoção originou o lead
-- (quando o CTA vier de uma promoção) sem quebrar nenhum lead existente ou já enviado.
ALTER TABLE leads ADD COLUMN promotion_slug TEXT;
