-- Promoções iniciais para o lançamento de 01/09/2026 — ver README para a análise completa
-- de cada campanha (o que foi incluído, o que foi excluído e por quê).
--
-- ATENÇÃO: este arquivo NÃO é aplicado automaticamente. Rodar manualmente, só depois de
-- decidir o ambiente (local, prévia ou produção — nunca produção nesta etapa):
--   npx wrangler d1 execute luciana-pandolfi-leads --local --file=migrations/seed_initial_promotions.sql

-- Hapvida — ativa (dentro da vigência em 01/09/2026: 27/07/2026 a 30/09/2026).
-- Fonte pública de apoio: https://cobroker.com.br/campanha-hapvida-50-de-desconto-na-1a-mensalidade/
-- (guardada como referência administrativa em source_reference — não citar a CoBroker
-- como parceira da L&J em nenhuma comunicação pública).
INSERT INTO promotions (
  slug, operator_name, title, short_description, benefit_type, benefit_value,
  full_conditions, eligible_products, eligible_audience, minimum_lives, maximum_lives,
  eligible_locations, starts_at, ends_at, status, is_featured, display_order,
  public_cta_label, public_cta_target, source_name, source_reference, source_verified_at,
  internal_notes
) VALUES (
  'hapvida-50-primeira-mensalidade',
  'Hapvida',
  'Hapvida: 50% de desconto na primeira mensalidade',
  'Condição promocional para produtos e praças participantes, disponível para perfis elegíveis durante a vigência da campanha.',
  'desconto_percentual',
  '50% na primeira mensalidade',
  'Desconto de 50% na primeira mensalidade para os produtos e praças participantes. A elegibilidade, o produto disponível e a aplicação do desconto são confirmados durante a análise.',
  'Super Simples (1 vida); Super Simples (2 a 29 vidas); PME (30 a 99 vidas)',
  'Individual, adesão e PME (conforme produto)',
  1,
  99,
  'São Paulo/SP; Mogi das Cruzes/SP; São Bernardo do Campo/SP',
  '2026-07-27',
  '2026-09-30',
  'active',
  1,
  1,
  'Quero saber se me qualifico',
  '#simulacao',
  'CoBroker (fonte pública de apoio, referência administrativa)',
  'https://cobroker.com.br/campanha-hapvida-50-de-desconto-na-1a-mensalidade/',
  '2026-08-27',
  'Fonte pública encontrada via CoBroker. Confirmar internamente com a operadora antes de reforçar a campanha em mídia paga.'
);

-- Omint — rascunho (não aparece publicamente). Sem data de encerramento pública
-- identificada — permanece rascunho até Luciana ou Jhonatan confirmarem vigência em 01/09.
-- Fonte pública de apoio: https://cobroker.com.br/campanha-desconto-omint/
INSERT INTO promotions (
  slug, operator_name, title, short_description, benefit_type, benefit_value,
  full_conditions, eligible_products, eligible_audience, minimum_lives, maximum_lives,
  eligible_locations, starts_at, ends_at, status, is_featured, display_order,
  public_cta_label, public_cta_target, source_name, source_reference, source_verified_at,
  internal_notes
) VALUES (
  'omint-desconto-empresas-4-99-vidas',
  'Omint',
  'Omint: condições diferenciadas para empresas',
  'Desconto para empresas de 4 a 99 vidas nas linhas Skill, Kipp, Corporate e Premium, conforme condições vigentes da operadora.',
  'desconto_percentual',
  '15% (Skill/Kipp) ou 20% (Corporate/Premium)',
  'Desconto de 15% nas linhas Skill e Kipp, e de 20% nas linhas Corporate e Premium, para empresas de 4 a 99 vidas. Cotações a partir de 01/07/2026. A elegibilidade e a condição final são confirmadas durante a análise.',
  'Linhas Skill, Kipp, Corporate e Premium',
  'PME (empresas)',
  4,
  99,
  NULL,
  '2026-07-01',
  NULL,
  'draft',
  0,
  2,
  'Quero saber se me qualifico',
  '#simulacao',
  'CoBroker (fonte pública de apoio, referência administrativa)',
  'https://cobroker.com.br/campanha-desconto-omint/',
  '2026-08-27',
  'RASCUNHO — sem data pública de encerramento identificada. Só publicar depois que Luciana ou Jhonatan confirmarem que a campanha segue vigente em 01/09/2026. Não inventar data final.'
);
