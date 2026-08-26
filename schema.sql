CREATE TABLE IF NOT EXISTS leads (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  created_at TEXT NOT NULL DEFAULT (datetime('now')),
  form_type TEXT NOT NULL,
  source_page TEXT NOT NULL,
  campaign TEXT,
  nome TEXT NOT NULL,
  whatsapp TEXT NOT NULL,
  email TEXT,
  para_quem TEXT,
  quantidade_pessoas TEXT,
  ja_tem_plano TEXT,
  quando_resolver TEXT,
  hospital_especifico TEXT,
  numero_vidas TEXT,
  utm_source TEXT,
  utm_medium TEXT,
  utm_campaign TEXT,
  utm_content TEXT,
  utm_term TEXT,
  status TEXT NOT NULL DEFAULT 'novo'
);
CREATE INDEX IF NOT EXISTS idx_leads_created_at ON leads(created_at);
CREATE INDEX IF NOT EXISTS idx_leads_status ON leads(status);
