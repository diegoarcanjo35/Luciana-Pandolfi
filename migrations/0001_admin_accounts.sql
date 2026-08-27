-- Contas administrativas individuais (superadmin/admin), sessões e rate limit de login.
-- Aditivo — não altera nem remove a tabela `leads` existente. O ADMIN_PASSWORD legado
-- continua funcionando em paralelo (ver src/lib/auth.ts) até o superadmin criar contas reais.

CREATE TABLE IF NOT EXISTS admin_users (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  password_hash TEXT NOT NULL,
  role TEXT NOT NULL CHECK (role IN ('superadmin', 'admin')),
  status TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'inactive')),
  created_at TEXT NOT NULL DEFAULT (datetime('now')),
  updated_at TEXT NOT NULL DEFAULT (datetime('now')),
  last_login_at TEXT
);
CREATE UNIQUE INDEX IF NOT EXISTS idx_admin_users_email ON admin_users(email);

CREATE TABLE IF NOT EXISTS admin_sessions (
  id TEXT PRIMARY KEY,
  user_id INTEGER NOT NULL REFERENCES admin_users(id),
  created_at TEXT NOT NULL DEFAULT (datetime('now')),
  expires_at TEXT NOT NULL,
  last_used_at TEXT NOT NULL DEFAULT (datetime('now')),
  user_agent TEXT,
  revoked_at TEXT
);
CREATE INDEX IF NOT EXISTS idx_admin_sessions_user ON admin_sessions(user_id);
CREATE INDEX IF NOT EXISTS idx_admin_sessions_expires ON admin_sessions(expires_at);

-- Rate limiting de tentativas de login, compatível com o runtime de Workers (sem KV/DO).
CREATE TABLE IF NOT EXISTS admin_login_attempts (
  identifier TEXT PRIMARY KEY,
  attempt_count INTEGER NOT NULL DEFAULT 0,
  first_attempt_at TEXT NOT NULL,
  locked_until TEXT
);
