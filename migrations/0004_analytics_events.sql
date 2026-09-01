-- Analytics de sessão pseudônima, sem GA4/cookie de terceiro. Aditivo — não altera
-- nem remove nenhuma tabela existente. Ver README para o guia completo (extraído da
-- implementação em produção no site da Vallery Alves).

CREATE TABLE IF NOT EXISTS analytics_events (
  id            INTEGER PRIMARY KEY AUTOINCREMENT,
  criado_em     TEXT    NOT NULL,   -- ISO 8601 UTC
  sessao_id     TEXT    NOT NULL,   -- pseudônimo, gerado no navegador (sessionStorage)
  tipo_evento   TEXT    NOT NULL,   -- lista fechada, validada na aplicação
  pagina        TEXT    NOT NULL DEFAULT '/',
  elemento      TEXT,               -- rótulo do CTA/seção envolvido, quando houver
  oferta        TEXT,               -- campanha/página de origem, quando houver
  etapa         INTEGER,

  utm_source    TEXT,
  utm_medium    TEXT,
  utm_campaign  TEXT,
  utm_content   TEXT,
  utm_term      TEXT,
  referrer      TEXT,
  landing_page  TEXT
);

CREATE INDEX IF NOT EXISTS idx_analytics_criado   ON analytics_events (criado_em);
CREATE INDEX IF NOT EXISTS idx_analytics_sessao   ON analytics_events (sessao_id);
CREATE INDEX IF NOT EXISTS idx_analytics_tipo     ON analytics_events (tipo_evento, criado_em);
CREATE INDEX IF NOT EXISTS idx_analytics_pagina   ON analytics_events (pagina);
CREATE INDEX IF NOT EXISTS idx_analytics_campanha ON analytics_events (utm_campaign);
