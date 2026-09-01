-- Força troca de senha no primeiro login. Aditivo — não altera nem remove nada existente.
-- Contas criadas com senha temporária (aleatória) marcam must_change_password = 1; o login
-- continua normal, mas o painel redireciona pra /admin/trocar-senha antes de liberar o resto.

ALTER TABLE admin_users ADD COLUMN must_change_password INTEGER NOT NULL DEFAULT 0;
