-- Coluna aditiva e opcional em `leads`, pra registrar se o CNPJ/MEI está ativo — pergunta
-- exclusiva do formulário de qualificação empresarial (/plano-empresarial). Não altera nem
-- remove nenhum lead existente.

ALTER TABLE leads ADD COLUMN cnpj_ativo TEXT;
