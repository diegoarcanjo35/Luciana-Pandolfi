# Site — L&J Consultoria | Planos de Saúde

Site de conversão e captura de leads. Next.js (App Router) + Tailwind, banco de leads em Cloudflare D1,
deploy em Cloudflare Workers via OpenNext.

Páginas: `/` (Home), `/quem-somos`, `/plano-empresarial` (campanha Alice/PME), `/plano-familiar`
(campanha MedSênior/família), `/obrigado`, `/admin` (painel de leads), `/politica-de-privacidade`.

## Branch `launch-promotions-admin` (27/08/2026)

Parte do commit `07cf10c` (branch `hospital-network-section`) — não da `main` diretamente, porque a
`main` na hora deste pedido ainda não tinha a seção hospitalar incorporada. Escopo: contas
administrativas individuais (Luciana/Jhonatan/Diego), CRUD completo de promoções, seção pública de
promoções vigentes, e a promoção inicial da Hapvida pronta pro lançamento de 01/09. Nenhum merge, nenhum
deploy — tudo só nesta branch, com D1 aplicado apenas local/prévia.

### Correções da auditoria (27/08/2026, mesmo dia, mesma branch)

Uma segunda auditoria sobre o commit `3afe20d` encontrou 9 bloqueadores funcionais e de segurança antes
do merge. Todos foram corrigidos neste novo commit, na mesma branch. Resumo item por item:

1. **Bug real: criar promoção já como ativa falhava.** O objeto usado pra validar o `POST` não incluía
   `full_conditions`, então `validatePromotionInput(..., {forPublish:true})` rejeitava mesmo quando o
   formulário enviava as condições completas. Corrigido em `src/app/api/admin/promotions/route.ts` —
   `full_conditions` agora entra no objeto de validação. Testado ao vivo: criar uma promoção com
   `status: "active"` e `full_conditions` preenchido agora retorna `200`, antes retornava `400` sempre.
2. **Exclusão definitiva removida.** `deletePromotionPermanently` e o parâmetro `?hard=true` foram
   removidos do código — o `DELETE` do painel **sempre arquiva**, nunca apaga. Isso também elimina o
   risco de erro de chave estrangeira que existia (o audit log referenciava `promotion_id NOT NULL
   REFERENCES promotions(id)` sem `ON DELETE CASCADE`; ao invés de corrigir a FK pra permitir apagar,
   optamos por nunca apagar — mais simples e mais seguro).
3. **Token de sessão passou a ser hasheado no D1.** A coluna (renomeada de `id` pra `token_hash` em
   `migrations/0001_admin_accounts.sql`, que ainda não tinha sido aplicada em nenhum ambiente além do
   D1 local) agora guarda `SHA-256(token)`. O cookie continua com o token bruto; quem só tem leitura do
   banco não consegue reconstruir um cookie válido a partir do hash gravado. Testado ao vivo: após um
   login real, conferi via `wrangler d1 execute` que `admin_sessions.token_hash` é um hash de 64
   caracteres, não o valor do cookie.
4. **Encerramento seguro do acesso legado.** Nova variável `LEGACY_ADMIN_ENABLED` (não é segredo — vai
   em `[vars]` no `wrangler.toml`, default `"true"`). Só a string exata `"false"` desabilita — qualquer
   outro valor, incluindo a variável não definida, mantém habilitado, pra nunca travar o Diego sem
   querer. A comparação de senha do caminho legado agora usa `timingSafeEqualString` (tempo constante).
   Testado ao vivo: com `LEGACY_ADMIN_ENABLED=false`, login com `ADMIN_PASSWORD` passou a retornar `401`
   imediatamente; com a variável de volta ao padrão, voltou a funcionar. Sequência completa documentada
   mais abaixo, seção "Ordem seguro para produção".
5. **Proteção do último superadmin.** Nova função pura `canDeactivateUser` (`src/lib/admin-users.ts`) —
   ninguém desativa a própria conta, e o último superadmin ativo nunca pode ser desativado (testado com
   3 combinações diferentes ao vivo: outro ator com 2 superadmins ativos → permite; sessão legada
   tentando desativar o único superadmin restante → bloqueia com 400 e mensagem clara).
6. **Validação de campos administrativos reforçada.** `public_cta_target` agora só aceita âncoras
   (`#simulacao`) ou caminhos internos (`/plano-familiar#simulacao`) — rejeita `javascript:`, `data:`,
   domínio externo e URL protocol-relative (`//dominio`). `minimum_lives`/`maximum_lives` precisam ser
   inteiros não negativos, `display_order` inteiro entre 0 e 10000, `is_featured` só booleano real,
   status inválido retorna `400`. Campo obrigatório (`operator_name`, `title`, `short_description`,
   `starts_at`) enviado como `null` ou vazio no `PATCH` agora retorna `400` **antes** de tocar o D1 — não
   chega mais a virar um erro 500 por violar `NOT NULL`. IDs de rota são validados como inteiros
   positivos (`/api/admin/promotions/abc` e `/api/admin/promotions/-1` retornam `400`, não `500`).
7. **Alteração + auditoria atômicas.** `updatePromotionWithAudit` e `archivePromotionWithAudit`
   (`src/lib/db.ts`) usam `db.batch([...])` do D1, que roda as statements numa única transação — ou as
   duas são aplicadas, ou nenhuma é. Pra criação, `createPromotionWithAudit` resolve o `promotion_id` do
   audit log por sub-select no `slug` (único), então não depende do `last_row_id` entre statements
   separadas pra ser atômico.
8. **Seed da Hapvida corrigido.** Removida a menção a "adesão" do público elegível — a fonte só confirma
   Super Simples (1 e 2 a 29 vidas) e PME (30 a 99 vidas). Texto agora: "Super Simples de 1 a 29 vidas e
   PME de 30 a 99 vidas, conforme elegibilidade e produto participante." `seed_initial_promotions.sql`
   agora usa `INSERT OR IGNORE` sobre o `slug` (único) — rodar o arquivo mais de uma vez não duplica nem
   quebra. Testado ao vivo: rodei o seed duas vezes seguidas, confirmei via SQL que continuam exatamente
   2 linhas.
9. **Home defensiva contra tabela ausente.** `src/app/page.tsx` e `src/app/api/promotions/route.ts`
   agora envolvem a busca de promoções em `try/catch` — se a tabela não existir (migration não aplicada)
   ou o D1 falhar por qualquer motivo, a seção de promoções simplesmente não aparece, o erro vai só pro
   log do servidor (`console.error`), e o resto da Home renderiza normalmente. **Testado ao vivo**:
   renomeei a tabela `promotions` temporariamente (`ALTER TABLE ... RENAME TO promotions_backup_temp`),
   recarreguei a Home — carregou completa, sem a seção de promoções, erro apareceu só no overlay de
   dev do Next.js (recurso só de desenvolvimento, não aparece em produção) — depois renomeei de volta.

### Auditoria do admin anterior (antes de mexer em qualquer coisa)

O `/admin` já existia com uma senha única (`ADMIN_PASSWORD`, secret do Worker/`​.dev.vars` local) — sem
contas individuais. Fluxo: `POST /api/admin/login` comparava a senha recebida com `ADMIN_PASSWORD` e,
se batesse, gravava um cookie `HttpOnly`/`Secure`/`SameSite=lax` contendo `sha256("lp-admin:" +
ADMIN_PASSWORD)` — um token **determinístico** (sempre o mesmo valor para a mesma senha), com validade
de 12h. `isAuthenticated()` recomputava esse hash e comparava com o cookie a cada request. Não havia
sessão gravada em banco, não havia rate limiting, não havia log de último acesso, e a comparação de
senha usava `===` simples (não é comparação em tempo constante — risco baixo dado que era uma senha
única de baixo valor, mas não ideal). `logout` só apagava o cookie. Nenhuma credencial estava hardcoded
no código — só em `ADMIN_PASSWORD`/`.dev.vars` (gitignorado) ou secret do Worker.

### Nova autenticação — sem quebrar o acesso do Diego

O `ADMIN_PASSWORD` **continua funcionando exatamente como antes** — mesmo formulário de senha única,
mesmo cookie determinístico. Isso é a "ponte legada" (`src/lib/auth.ts`): uma sessão autenticada por ele
tem privilégio de superadmin "virtual" (sem linha em `admin_users`), o suficiente pra Diego acessar a
nova área **Usuários** e criar as contas reais de Luciana, Jhonatan e dele mesmo — sem precisar de
nenhum secret novo nem de mudança de comportamento imediata. Quando uma conta real existir para o
Diego, ele pode passar a usar e-mail + senha própria; a ponte legada pode continuar existindo como
plano B enquanto fizer sentido.

Contas reais (tabela `admin_users`) usam:
- **Hash de senha**: PBKDF2-SHA256, 100.000 iterações, salt aleatório de 16 bytes por conta
  (`src/lib/crypto.ts`) — Web Crypto nativo do runtime de Workers, sem depender de bcrypt/argon2
  (que exigem binding nativo incompatível com Workers).
- **Sessão**: token opaco aleatório (32 bytes) gravado em `admin_sessions`, cookie
  `HttpOnly`/`Secure`/`SameSite=lax`, expira em 12h, revogado de verdade no logout (`DELETE`/`UPDATE
  revoked_at`, não só limpeza de cookie).
- **Rate limiting**: tabela `admin_login_attempts` (compatível com o runtime de Workers, sem precisar
  de KV/Durable Objects) — 5 tentativas erradas por identificador (IP + e-mail) travam por 15 minutos.
  A tentativa só é registrada **depois** de a senha ser conferida e falhar (não antes) — isso é
  testado.
- **Mensagem genérica**: login errado sempre retorna "E-mail ou senha inválidos.", nunca diferencia
  "e-mail não existe" de "senha errada".
- **Papéis**: `superadmin` (acessa leads, administra promoções, cadastra/ativa/desativa admins) e
  `admin` (acessa leads, cadastra/edita/publica/arquiva promoções, **não** cadastra administradores).
  Checado tanto na UI (esconde a aba "Usuários") quanto na API (`requireRole`, testado manualmente
  retornando 403 pra quem não é superadmin).

### Bootstrap das contas de Luciana e Jhonatan

Nenhuma conta foi inventada. O fluxo pra criar as contas reais:
1. Diego entra em `/admin` com a senha atual (`ADMIN_PASSWORD`) — igual já faz hoje.
2. Vai na aba **Usuários** (só aparece pra superadmin).
3. Cria a conta de Luciana e a de Jhonatan (nome, e-mail, senha, papel) diretamente no formulário.
4. A senha definida ali fica hasheada no banco — **combine com cada um por um canal seguro (ligação,
   WhatsApp por chamada de voz, etc.), nunca por e-mail em texto simples**. Não há fluxo de "esqueci
   minha senha" nesta primeira versão — se quiserem trocar a própria senha depois, é um follow-up.

**Nenhum secret novo é necessário pra esse fluxo funcionar** — o `ADMIN_PASSWORD` que já existe é
suficiente. Se no futuro vocês decidirem desativar de vez o acesso legado (depois que Diego já tiver
uma conta real), isso é uma decisão consciente separada, não algo que essa branch faz sozinha.

### CRUD de promoções

Tabela `promotions` (migration `migrations/0002_promotions.sql`) com os campos pedidos no briefing
(operadora, título, descrição, tipo/valor de benefício, condições completas, produtos/público/vidas/
região elegíveis, datas, status, destaque, ordem, CTA público, fonte administrativa, notas internas,
quem criou/editou, timestamps).

**Como o status funciona**: o campo `status` gravado no banco só tem 3 valores — `draft`, `active`,
`archived` — que é a intenção que o admin define ao salvar. Os estados citados no briefing
(`scheduled`, `expired`) **nunca são gravados**: são sempre calculados, a partir de `status` +
`starts_at`/`ends_at` + data atual em `America/Sao_Paulo`, por `computeEffectiveStatus()` em
`src/lib/promotions.ts`. Isso é o que garante que uma promoção marcada como `active` no banco, mas já
vencida, apareça como "Expirada" no Admin e nunca apareça na seção pública — testado em
`src/lib/__tests__/promotions.test.ts`.

**Fuso horário**: `America/Sao_Paulo` é fixo em UTC-3 o ano todo (Brasil aboliu o horário de verão em
2019), então a conversão usa só `Intl.DateTimeFormat` com esse timezone, sem precisar tratar DST. Os
testes cobrem o caso de virada de dia (`todaySaoPaulo`) pra confirmar que um horário UTC que já é dia
seguinte, mas ainda é o dia anterior em São Paulo, não expira uma promoção antes da hora.

**Validação**: `validatePromotionInput()` roda no servidor (`/api/admin/promotions`, nunca só no
navegador) — operadora/título/descrição/data inicial obrigatórios, data final (quando existe) não pode
ser anterior à inicial, condições completas só obrigatórias quando o status vai pra `active`
(publicação), sanitização de HTML nos textos (`stripHtml`), queries sempre parametrizadas (`.bind()`
do D1, nunca concatenação de string).

**Exclusão**: o botão "Arquivar" (ação padrão) nunca apaga — só marca `status='archived'` e
`archived_at`. Existe exclusão definitiva via `DELETE /api/admin/promotions/:id?hard=true`, mas **só
funciona pra superadmin** e não está exposta na UI desta versão (por decisão de manter a ação principal
sempre reversível) — reservada pra uso administrativo direto se um dia for necessário.

**Auditoria**: toda criação/edição/publicação/desativação/arquivamento grava uma linha em
`promotion_audit_log` (ação, quem, quando, um resumo curto em `details` — nunca senha, cookie, token ou
dado sensível).

### Promoções do lançamento de 01/09/2026

Analisei as campanhas mencionadas no briefing e classifiquei cada uma:

| Operadora | Condição | Vigência informada | Decisão | Por quê |
|---|---|---|---|---|
| **Hapvida** | 50% na 1ª mensalidade | 27/07 a 30/09/2026 | **Cadastrada como ativa** (rascunho inicial já com status `active`) | Dentro da vigência em 01/09 |
| **Omint** | 15–20% conforme linha, 4–99 vidas | Cotações desde 01/07, sem data final pública | **Cadastrada como rascunho** | Sem confirmação de que segue vigente em 01/09 — não inventei data final |
| Prevent Senior | 30% na 1ª parcela | até 31/08/2026 | **Não cadastrada** | Estaria expirada no lançamento |
| Porto Bairro | Isenção da 2ª fatura | até 10/08/2026 | **Não cadastrada** | Já expirada antes do lançamento |
| SulAmérica Porte II | Isenção da 2ª fatura | até 31/08/2026 | **Não cadastrada** | Estaria expirada no lançamento |
| SulAmérica Porte I/DF | Isenção da 2ª fatura | até 31/08/2026 | **Não cadastrada** | Estaria expirada no lançamento |
| Amil | Pagamento de 100% na 4ª parcela | — | **Não cadastrada** | É remuneração/premiação do corretor, condicionada a adimplência — não é benefício público do consumidor. Nunca deve virar "promoção" pública. |

Fonte pública usada como referência administrativa para Hapvida e Omint: CoBroker
(`cobroker.com.br/campanha-hapvida-50-de-desconto-na-1a-mensalidade/` e
`cobroker.com.br/campanha-desconto-omint/`), guardada em `source_reference` de cada registro — **nunca
citada como parceira da L&J na comunicação pública**, só como nota administrativa interna.

As 5 campanhas excluídas (Prevent Senior, Porto Bairro, 2x SulAmérica, Amil) **não foram inseridas no
banco** — ficam só documentadas aqui. Se quiserem manter um registro histórico/arquivado delas por
auditoria, é um follow-up simples (inserir com `status='archived'`).

Seed em `migrations/seed_initial_promotions.sql` — **não é aplicado automaticamente**, só documentado
(rodar manualmente, nunca direto em produção nesta etapa):
```bash
npx wrangler d1 execute luciana-pandolfi-leads --local --file=migrations/seed_initial_promotions.sql
```

### Seção pública (Home)

Nova seção "Condições comerciais vigentes" (`src/components/PromotionsSection.tsx`), inserida entre a
seção de rede hospitalar e o guia gratuito — composição editorial (lista, não grade de cards
idênticos), operadora em microtipografia, benefício em destaque, vigência formatada em DD/MM/AAAA,
aviso obrigatório de que a confirmação é feita na análise. **Só renderiza se houver ao menos uma
promoção publicamente visível** (`isPubliclyVisible`) — a seção inteira some da página quando não há
nenhuma promoção ativa, sem placeholder vazio.

Como consequência direta, a Home **deixou de ser estática** (`○`) e passou a ser renderizada sob
demanda (`ƒ`) — ela agora consulta o D1 a cada request pra saber quais promoções mostrar. Isso é
esperado e correto: uma página estática não refletiria uma promoção expirando à meia-noite.

**CTA e rastreamento opcional**: o botão de cada promoção leva para `#simulacao` (o formulário principal
já existente da Home) com `?promo=<slug>` — testado e corrigido um bug real nesta rodada (a query
string estava sendo montada depois do `#`, o que é inválido em URL: o navegador trata tudo depois de
`#` como fragmento, então o parâmetro nunca chegava ao servidor). `LeadFormQualificacao` aceita a nova
prop opcional `promotionSlug`, que vai no payload como `promotion_slug` — **coluna nova e opcional em
`leads`** (`ALTER TABLE leads ADD COLUMN promotion_slug TEXT`, aditiva, todo lead existente continua
com o valor `NULL`). `source_page`, `campaign`, UTMs e `event_id` **não foram alterados**. Testado ao
vivo: formulário preenchido a partir do CTA da Hapvida gravou `promotion_slug=hapvida-50-primeira-mensalidade`
no lead, visível na coluna nova da tabela de Leads do Admin.

O endpoint público `GET /api/promotions` existe para eventual uso futuro (ex.: se as landings quiserem
consumir a mesma lista) e devolve só os campos seguros — nunca `internal_notes`, `source_name`,
`source_reference`, `created_by`/`updated_by` ou qualquer coisa que exponha remuneração de corretor ou
fonte administrativa interna. A Home hoje busca os dados direto do banco no servidor (mais simples e
sem round-trip extra), não consome esse endpoint — ele fica disponível caso seja útil depois.

### MedSênior e Alice — revisadas, sem mudança

Conferi as duas landings: `/plano-familiar` já tinha o card "Rede credenciada" com texto condicional
("verificamos se os hospitais que importam pra sua família estão realmente cobertos"), sem nomear
hospital nem prometer cobertura; `/plano-empresarial` já listava "Rede hospitalar prioritária" como um
dos fatores analisados, também sem nomear instituições. Nenhuma das duas foi alterada — nem para
adicionar promoções, nem para repetir a seção da Home. Isso preserva o message match com os anúncios e
mantém o formulário na primeira dobra, como pedido.

### Correção — "Atendimento em todo o Brasil" (revisão mais rigorosa)

A rodada anterior já tinha suavizado essa alegação, mas ainda mantinha "todo o Brasil" em alguns pontos
sem confirmação explícita da cliente. Como pedido nesta rodada, apliquei a versão sem alcance geográfico
absoluto nos 5 pontos restantes onde a frase aparecia:
- **Home** (microcopy do hero): "Atendimento em todo o Brasil" → "Atendimento por telefone e WhatsApp".
- **`/plano-familiar`** e **`/plano-empresarial`** (microcopy do hero): "Consultoria em São Paulo e em
  todo o Brasil" → "Consultoria por telefone e WhatsApp".
- **`FAQAccordion.tsx`**: resposta reescrita para "Consultoria realizada por telefone e WhatsApp... A
  disponibilidade das opções, a abrangência e a rede credenciada variam conforme produto, operadora e
  região."
- **`Footer.tsx`**: removido "e todo o Brasil" do rodapé.
- **`/quem-somos`**: conferido — **não tem** essa frase (a auditoria do briefing citava essa página,
  mas não encontrei a ocorrência no código atual; correção de premissa, não de código).
- **Metadados** (`title`/`description` de cada página): conferidos — nenhum menciona "Brasil" ou
  cobertura geográfica, nada a corrigir.

Continua pendente a confirmação explícita da cliente sobre se existe, de fato, atendimento comercial
nacional (ligação/WhatsApp de qualquer estado) — se vier confirmação clara, dá pra reintroduzir essa
informação separada de qualquer alegação de cobertura de rede/plano.

### Segurança — nada exposto, nada hardcoded

- `.dev.vars` continua fora do Git (gitignorado, confirmado nesta rodada).
- Nenhuma senha, hash, token ou dado de lead apareceu em commit, log ou neste README.
- Contas de teste criadas durante a verificação local (`teste.admin@example.com`) foram apagadas do
  banco local antes da entrega — não sobem pra lugar nenhum além do `.wrangler/state` local, que já é
  gitignorado.

### O que foi testado de verdade (commit atual, já incluindo as correções da auditoria)

Diferenciando explicitamente o tipo de teste, como pedido:

| Item | Tipo | Como foi feito |
|---|---|---|
| `npm run lint` | Automatizado | Executado. Nenhum erro novo de classe diferente da já existente — as páginas de Admin caem na mesma regra `react-hooks/set-state-in-effect` que **já existia** em `admin/page.tsx` antes desta branch (mesmo padrão de fetch-on-mount usado em todo o site). |
| `npm run test` (Vitest) | Automatizado | **74 testes**, todos passando: status efetivo por data (ativa/agendada/expirada/rascunho/arquivada), fuso horário América/São_Paulo com virada de dia, validação server-side (incluindo os novos validadores de CTA/inteiros/booleano), hash de senha (PBKDF2) e hash de sessão (SHA-256, determinístico, não reversível), comparação em tempo constante, sessão de banco válida/expirada/revogada/usuário inativo, `LEGACY_ADMIN_ENABLED`, e proteção do último superadmin (6 cenários). |
| `npm run build` | Automatizado | Sucesso, 22 rotas, `/` dinâmica (esperado — consulta promoções a cada request). |
| `opennextjs-cloudflare build` | Automatizado | Executado com sucesso, `.open-next/worker.js` gerado. |
| Migrations 0001 e 0002 (com `token_hash` renomeado) | D1 local | Tabelas recriadas do zero localmente pra validar o schema novo — `DROP TABLE` das tabelas de admin/promoções (nunca `leads`) e reaplicação das migrations. Confirmei via `wrangler d1 execute --command` que `admin_sessions.token_hash` existe e `admin_sessions.id` não. |
| Seed idempotente | D1 local | Rodei `seed_initial_promotions.sql` duas vezes seguidas — confirmei via SQL que continuam exatamente 2 linhas (Hapvida + Omint), sem duplicar. Confirmei que o texto de público da Hapvida não menciona mais "adesão". |
| **Bug do item 1 corrigido**: criar promoção já ativa | D1 local, ao vivo | `POST /api/admin/promotions` com `status:"active"` e `full_conditions` preenchido → antes retornava `400` sempre, agora retorna `200`. Histórico de auditoria confirmado gravado atomicamente junto (`action:"created"`). |
| Exclusão sempre arquiva | D1 local, ao vivo | `DELETE /api/admin/promotions/:id` (com e sem `?hard=true` — o parâmetro agora é ignorado) sempre resulta em `status:"archived"`, nunca remove a linha. Confirmei que a promoção continua existindo via `GET`, some do `/api/promotions` público, e o histórico (`created` + `archived`) permanece. |
| Token de sessão hasheado | D1 local, ao vivo | Login real → consultei `admin_sessions` via `wrangler d1 execute` → `token_hash` é uma string de 64 caracteres hex, não o valor do cookie (que é `HttpOnly`, o JS do navegador não consegue nem ler pra comparar, o que já é uma camada de proteção adicional). |
| `LEGACY_ADMIN_ENABLED=false` | D1 local, ao vivo | Adicionei a variável no `.dev.vars` local, reiniciei o servidor, login com `ADMIN_PASSWORD` passou a retornar `401` imediatamente. Removida a variável, reiniciado de novo, voltou a funcionar — confirmando que o padrão (variável ausente) é habilitado, como pedido. |
| `LEGACY_ADMIN_ENABLED=true` (padrão) | D1 local, ao vivo | Testado ao vivo antes e depois do teste acima — login legado funciona normalmente. |
| Login individual (conta real) | D1 local, ao vivo | Criei uma conta de teste via UI, fiz login com e-mail+senha, `/api/admin/me` confirmou a sessão real (`isLegacy:false`). |
| RBAC | D1 local, ao vivo | Conta `admin` recebe `403` em `GET /api/admin/users` (servidor recusa, não é só a aba escondida na UI). |
| **Proteção do último superadmin** | D1 local, ao vivo | Sequência completa: (1) superadmin A tenta desativar a si mesmo → `400` "própria conta"; (2) criei um segundo superadmin B, logado como B desativei A (2 superadmins ativos) → `200`, sucesso; (3) com sessão legada (ator diferente de B), tentei desativar B, agora o único superadmin ativo → `400` "último superadmin ativo". |
| ID inválido / conta inexistente | D1 local, ao vivo | `PATCH /api/admin/users/abc` → `400`; `PATCH /api/admin/users/-1` → `400`; `PATCH /api/admin/users/9999` → `404`. Mesma validação nas rotas de promoção. |
| Validação de campos administrativos | D1 local, ao vivo | `public_cta_target:"javascript:alert(1)"` → `400`; `title:null` ou `title:""` num `PATCH` → `400` (nunca chega a tentar gravar `NULL` numa coluna `NOT NULL`). |
| Rate limiting de login | D1 local (rodada anterior) | 5 tentativas erradas travam por 15 min, `429` com mensagem clara. |
| Acesso sem sessão às APIs administrativas | D1 local, ao vivo | `/api/admin/leads`, `/api/admin/promotions`, `/api/admin/promotions/:id` retornam `401` sem cookie. |
| CRUD de promoções (rascunho/agendada/expirada/arquivada) | D1 local, ao vivo | Criei uma promoção com `starts_at` no futuro (dezembro/2026) → badge "Agendada" no Admin, ausente do público. Criei uma com `ends_at` em janeiro/2026 (já passado) → badge "Expirada", ausente do público. Confirmado visualmente na tela de Promoções. |
| Alteração + auditoria atômica | Inspeção de código + D1 local | `db.batch([...])` do D1 é transacional (documentação oficial: todas as statements do batch são commitadas juntas ou nenhuma é); testei indiretamente confirmando que toda alteração/arquivamento gerou exatamente uma linha de histórico correspondente, sem nenhum caso de alteração sem histórico ou vice-versa. |
| **Home com Hapvida ativa** | D1 local, ao vivo | Carreguei `/` — seção "Condições comerciais vigentes" aparece com a Hapvida, texto de público sem "adesão". |
| **Home sem promoções** | D1 local, ao vivo | Arquivei todas as promoções de teste — a seção simplesmente não renderiza (sem placeholder vazio). |
| **Home funcionando sem a tabela de promoções** | D1 local, ao vivo | Renomeei `promotions` temporariamente (`ALTER TABLE ... RENAME`) — a Home carregou completa, sem a seção, erro só no log/overlay de dev (nunca em produção); depois renomeei de volta. |
| **CTA → `/?promo=slug#simulacao`** | Ao vivo | Confirmado o formato correto da URL (query antes do fragmento) e o scroll automático até o formulário. |
| **Lead gravado com `promotion_slug`** | D1 local, ao vivo | Preenchi o formulário a partir do CTA da Hapvida — `SELECT promotion_slug FROM leads` confirmou o slug correto gravado. |
| Pixel / API de Conversões / deduplicação | Inspeção de código | **Não testado no Gerenciador de Eventos da Meta.** `event_id`, `sourcePage`, `campaign` e o disparo em `/api/lead` continuam exatamente iguais — nenhum desses campos foi tocado nesta branch. |
| Viewport mobile real | Não testado | Mesma limitação já registrada nas rodadas anteriores — a ferramenta de emulação de viewport não altera `window.innerWidth` neste ambiente de sessão. |
| Segredos / `.dev.vars` | Inspeção | Confirmado que `.dev.vars` segue fora do Git; a alteração temporária feita pra testar `LEGACY_ADMIN_ENABLED=false` foi revertida antes do commit. Nenhuma credencial nova foi commitada. |

**Nota sobre o ambiente de teste**: durante a auditoria, o processo do `next dev` travou duas vezes por
motivos de infraestrutura do Next.js/Turbopack no Windows (não relacionados ao código desta branch) — um
"Jest worker encountered... exceeding retry limit" e, depois, todas as rotas `/api/admin/*` retornando
`404` após um restart (resolvido limpando o cache `.next/`). Cada vez, reiniciei o servidor de
desenvolvimento e confirmei que os testes voltavam a passar. Documentado aqui por transparência, não é um
problema do código da aplicação.

### Ordem segura para produção

**Nada disto foi executado nesta rodada — só documentado.** Quando decidirem publicar de verdade:

```bash
# 1. Backup/Time Travel do D1 (Cloudflare mantém isso automaticamente, mas confirme o ponto de restauração)
npx wrangler d1 time-travel info luciana-pandolfi-leads

# 2. Migration de contas administrativas
npx wrangler d1 execute luciana-pandolfi-leads --remote --file=migrations/0001_admin_accounts.sql

# 3. Migration de promoções
npx wrangler d1 execute luciana-pandolfi-leads --remote --file=migrations/0002_promotions.sql

# 4. Seed inicial (Hapvida ativa, Omint rascunho)
npx wrangler d1 execute luciana-pandolfi-leads --remote --file=migrations/seed_initial_promotions.sql

# 5. Verificação das tabelas e registros antes de publicar código novo
npx wrangler d1 execute luciana-pandolfi-leads --remote --command "SELECT slug, status, starts_at, ends_at FROM promotions"
npx wrangler d1 execute luciana-pandolfi-leads --remote --command "SELECT name FROM sqlite_master WHERE type='table'"

# 6. Deploy do Worker (só depois que 1–5 confirmarem sucesso)
npm run deploy

# 7. Criação das contas — autenticado com ADMIN_PASSWORD (ainda habilitado), ir em /admin → Usuários e
#    criar a conta do Diego, da Luciana e do Jhonatan (testar login de pelo menos dois superadmins)

# 8. Só depois de confirmar que pelo menos 2 contas superadmin fazem login com sucesso:
npx wrangler secret put LEGACY_ADMIN_ENABLED --name luciana-pandolfi
#    (colar o valor "false" quando solicitado — nunca no chat, README ou log)
#    Alternativa sem secret: editar wrangler.toml, trocar [vars] LEGACY_ADMIN_ENABLED de "true" pra
#    "false", commitar (não é segredo, é só um interruptor) e rodar `npm run deploy` de novo.

# 9. Confirmar que a senha antiga deixou de funcionar
#    (tentar logar em /admin só com a senha, sem e-mail — deve retornar "E-mail ou senha inválidos.")
```

Passo 5 é intencionalmente antes do deploy do código novo — as migrations em D1 remoto são independentes
do deploy do Worker, então aplicar o schema primeiro e confirmar que as tabelas existem evita o cenário
descrito no item 9 da auditoria (Home caindo por falta de tabela). O código já tem a defesa (`try/catch`)
para esse caso mesmo assim — é defesa em profundidade, não substituição da ordem correta.

### Migrations criadas

- `migrations/0001_admin_accounts.sql` — `admin_users`, `admin_sessions`, `admin_login_attempts`.
  A coluna de sessão foi renomeada de `id` pra `token_hash` nesta correção — como a migration ainda não
  tinha sido aplicada em nenhum lugar além do D1 local, editei o arquivo original ao invés de criar uma
  migration `0003` só de rename.
- `migrations/0002_promotions.sql` — `promotions`, `promotion_audit_log`, `ALTER TABLE leads ADD COLUMN
  promotion_slug TEXT`.
- `migrations/seed_initial_promotions.sql` — Hapvida (ativa) e Omint (rascunho); **agora idempotente**
  (`INSERT OR IGNORE` pelo `slug`, único) — rodar mais de uma vez não duplica. Não aplicado
  automaticamente.

Nenhuma migration altera ou apaga `leads`, UTMs ou dado existente — só adiciona tabelas novas e uma
coluna opcional. Pra aplicar (sempre `--local` até decidirem publicar):
```bash
npx wrangler d1 execute luciana-pandolfi-leads --local --file=migrations/0001_admin_accounts.sql
npx wrangler d1 execute luciana-pandolfi-leads --local --file=migrations/0002_promotions.sql
npx wrangler d1 execute luciana-pandolfi-leads --local --file=migrations/seed_initial_promotions.sql
```
Rollback lógico (sem comando destrutivo): como as migrations só criam tabelas novas e uma coluna
opcional, reverter é simplesmente não usar as tabelas novas — nenhum dado existente de `leads` é
alterado por elas. Se precisar desfazer de fato num ambiente de teste: `DROP TABLE` das tabelas novas
(nunca `leads`) e `CREATE TABLE leads_new` sem a coluna `promotion_slug` + `INSERT INTO ... SELECT` +
`DROP`/`RENAME` (SQLite não tem `DROP COLUMN` direto em todas as versões) — não foi necessário fazer
isso, é só a documentação de como seria.

### Arquivos alterados/criados (commit inicial + correções da auditoria)

**Novos**: `migrations/0001_admin_accounts.sql`, `migrations/0002_promotions.sql`,
`migrations/seed_initial_promotions.sql`, `src/lib/crypto.ts`, `src/lib/promotions.ts`,
`src/lib/session-logic.ts`, `src/lib/admin-users.ts`,
`src/lib/__tests__/promotions.test.ts`, `src/lib/__tests__/crypto.test.ts`,
`src/lib/__tests__/session-logic.test.ts`, `src/lib/__tests__/admin-users.test.ts`, `vitest.config.ts`,
`src/components/admin/AdminSessionContext.tsx`, `src/app/admin/AdminLayoutClient.tsx`,
`src/app/admin/promocoes/page.tsx`, `src/app/admin/usuarios/page.tsx`,
`src/app/api/admin/me/route.ts`, `src/app/api/admin/users/route.ts`,
`src/app/api/admin/users/[id]/route.ts`, `src/app/api/admin/promotions/route.ts`,
`src/app/api/admin/promotions/[id]/route.ts`, `src/app/api/promotions/route.ts`,
`src/components/PromotionsSection.tsx`.

**Alterados**: `src/lib/auth.ts` (reescrito — sessão hasheada, `LEGACY_ADMIN_ENABLED`, comparação em
tempo constante), `src/lib/db.ts` (funções novas + `createPromotionWithAudit`/
`updatePromotionWithAudit`/`archivePromotionWithAudit` atômicas via `db.batch`, `deletePromotionPermanently`
removida), `src/app/admin/layout.tsx`, `src/app/admin/page.tsx`, `src/app/api/admin/login/route.ts`,
`src/app/api/admin/logout/route.ts`, `src/app/api/admin/users/[id]/route.ts` (proteção do último
superadmin), `src/app/api/admin/promotions/route.ts` (bug do `full_conditions` corrigido),
`src/app/api/admin/promotions/[id]/route.ts` (reescrito — validação reforçada, sem hard delete),
`src/app/api/lead/route.ts` (campo opcional novo), `src/app/api/promotions/route.ts` (defensivo),
`src/app/page.tsx` (busca promoções defensiva + nova seção), `src/components/LeadFormQualificacao.tsx`
(prop opcional nova), `src/components/FAQAccordion.tsx`, `src/components/Footer.tsx`,
`src/app/plano-familiar/page.tsx`, `src/app/plano-empresarial/page.tsx`, `wrangler.toml`
(`[vars] LEGACY_ADMIN_ENABLED`), `cloudflare-env.d.ts` (tipo da variável nova), `package.json` (script
`test` + `vitest` como devDependency).

### Secrets que vão precisar ser configurados no futuro

**Nenhum secret novo é obrigatório** pra esta branch funcionar — reaproveita o `ADMIN_PASSWORD` que já
existe, e `LEGACY_ADMIN_ENABLED` não é segredo (é só um interruptor, seguro pra ficar em `[vars]` no
`wrangler.toml`, já commitado com valor `"true"`). Os únicos secrets pendentes já eram conhecidos de
rodadas anteriores (`META_CAPI_TOKEN` em produção — ver seção "Pixel da Meta" mais abaixo).

Quando decidirem desativar o acesso legado (depois de testar pelo menos 2 contas superadmin reais),
duas opções, nenhuma delas exige um secret novo de verdade:
- Editar `wrangler.toml`, trocar `LEGACY_ADMIN_ENABLED` pra `"false"`, commitar e fazer redeploy; ou
- Rodar `npx wrangler secret put LEGACY_ADMIN_ENABLED --name luciana-pandolfi` e colar `false` quando
  pedido (funciona igual, só não fica versionado no Git — usar essa via se preferirem não deixar nem o
  "true"/"false" público no repositório, por precaução extra, embora não seja informação sensível).

### Pendências (dependem de Diego ou da cliente)

- Confirmar se Luciana e Jhonatan têm e-mail definido — pra Diego criar as contas reais deles na aba
  Usuários (nenhum e-mail foi inventado).
- Confirmar com Luciana/Jhonatan se a campanha Omint continua vigente em 01/09 antes de publicá-la
  (hoje fica em rascunho).
- Confirmação explícita sobre atendimento comercial nacional (item "Atendimento em todo o Brasil" acima).
- Decidir quando desativar `LEGACY_ADMIN_ENABLED` — só depois de confirmar que pelo menos duas contas
  superadmin reais fazem login com sucesso em produção (ver "Ordem segura para produção" acima).
- Mesmas pendências de rodadas anteriores (número de famílias/empresas atendidas, domínio próprio,
  fonte para "rede de hospitais de referência").

## Branch `hospital-network-section` (27/08/2026)

Ajuste pós-produção, partindo direto de `main` (que já está em produção desde `b79c3cd`) — não reutiliza
a `premium-redesign`, que fica encerrada. Escopo: nova seção de rede hospitalar na Home + correções
factuais pontuais encontradas na auditoria pós-deploy. Arquitetura, D1, Pixel/CAPI, painel `/admin`,
UTMs e payload dos formulários **não foram tocados**.

### Pedido da cliente (dois áudios, resumo)

A cliente quer apresentar hospitais reconhecidos de São Paulo pra ilustrar a amplitude da análise de
rede — sem afirmar que todo plano/operadora dá acesso a eles. Áudio 1: "como a gente trabalha com todas
as operadoras, então a gente abrange todos os hospitais... Albert Einstein, Sírio, Rede D'Or São Luiz,
Samaritano... é muito amplo". Áudio 2: pediu pra listar "só pra ilustrar": Albert Einstein, Rede D'Or São
Luiz, Sírio, Beneficência Portuguesa, Samaritano e Santa Catarina — "mas nunca dizer que não atende nos
outros".

Instituições usadas (nomenclatura pública conferida via busca antes de escrever no site):
- Hospital Israelita Albert Einstein
- Hospital Sírio-Libanês
- Rede D'Or São Luiz
- Beneficência Portuguesa de São Paulo (nome institucional oficial: "BP — A Beneficência Portuguesa de
  São Paulo"; mantive a forma como a cliente falou, mais legível numa lista)
- Hospital Samaritano — **atenção**: hoje existem duas unidades com nomes distintos, Hospital Samaritano
  Higienópolis e Hospital Samaritano Paulista (grupo Rede Américas). A cliente só disse "Samaritano", sem
  especificar qual unidade. Mantive o nome genérico "Hospital Samaritano" no site para não escolher por
  ela — **confirmar com a cliente se ela quer citar uma unidade específica ou manter genérico**.
- Hospital Santa Catarina

### Regra factual aplicada

Nenhuma associação entre um hospital específico e uma operadora ou plano foi feita. Toda menção aos
hospitais vem acompanhada do aviso: "A disponibilidade de cada hospital depende da operadora, do
produto, da categoria contratada e da rede credenciada vigente. A inclusão é confirmada individualmente
durante a análise." Nada de "rede completa", "acesso garantido" ou hospital citado como parceiro.

### Nova seção — Home (`src/components/HospitalNetwork.tsx`)

Composição editorial (não catálogo): título + texto institucional + CTA à esquerda, lista numerada
(`.numeral`, mesmo padrão tipográfico da seção "Como conduzimos a análise") com aviso de disponibilidade
à direita. Sem fotos, sem logos — nenhum asset de hospital foi fornecido pela cliente ou tem procedência
verificada, então a primeira versão é só tipografia, como o briefing pediu como alternativa preferida.
CTA "Analisar minha rede hospitalar" leva para `#simulacao` (formulário principal já existente da Home —
nenhum formulário novo foi criado).

Posicionada entre `SocialProof` e a seção de isca (`#guia`), para que o guia gratuito de hospitais leia
como continuação natural, não repetição — por isso o corpo de texto da seção `#guia` também mudou (não
duplica mais "comece pelo hospital que você quer", já dito na nova seção).

### MedSênior e Alice — revisão, sem novo conteúdo

Ambas as landing pages já tratavam rede hospitalar de forma segura antes deste ajuste: `/plano-familiar`
já tinha o card "Rede credenciada" com texto condicional ("verificamos se os hospitais que importam para
a sua família estão realmente cobertos"), sem nomear hospitais nem prometer cobertura; `/plano-empresarial`
já listava "Rede hospitalar prioritária" como um dos fatores analisados, também sem nomear instituições.
Nenhuma das duas foi alterada — replicar a seção da Home ali reintroduziria o risco que o briefing pediu
para evitar (parecer catálogo, tirar o formulário da primeira dobra, prejudicar o message match do
anúncio).

### Correção — "Atendimento em todo o Brasil"

A cliente não confirmou explicitamente nesta conversa se a frase se refere ao alcance comercial da
consultoria (atendimento remoto via WhatsApp/telefone) ou à cobertura de rede dos planos. Como a segunda
leitura seria uma alegação de cobertura que não é possível garantir, apliquei a leitura mais segura —
diferenciar consultoria de cobertura de plano — nos 4 pontos onde a frase aparecia:
- Home (hero): "Atendimento em todo o Brasil" mantido, mas removida a referência solta a "SP e" que
  soava como alegação de cobertura de rede.
- `/plano-familiar` e `/plano-empresarial` (hero): "Atendimento" → "Consultoria" (deixa explícito que é o
  serviço de consultoria, não a rede do plano).
- `FAQAccordion.tsx` (pergunta "Vocês atendem fora de São Paulo?"): resposta expandida para diferenciar
  explicitamente — "a consultoria atende todo o Brasil por telefone e WhatsApp... a rede credenciada e a
  abrangência de cada plano variam conforme produto, operadora e região."
- `Footer.tsx`: **não precisou de correção** — já estava com o sujeito correto ("Consultoria gratuita e
  independente... São Paulo/SP e todo o Brasil").

A auditoria original também citava `/quem-somos` como um dos locais com essa frase — conferi e ela não
aparece nessa página; correção de premissa, não de código.

**Ainda pendente**: confirmação explícita da cliente sobre a natureza exata dessa alegação (só reforça a
formulação já segura que ficou no ar).

### Correção — texto de privacidade nos formulários

`LeadFormIsca.tsx`: "Seus dados não são compartilhados com terceiros" (que conflitava com a Política de
Privacidade completa, que já detalha Cloudflare/Meta/CAPI) → "Seus dados não são vendidos e são tratados
conforme nossa Política de Privacidade", com link para `/politica-de-privacidade`. Único ponto do site
com essa frase — não havia duplicata em `LeadFormQualificacao.tsx`.

### Correção — promessa do guia gratuito

Título "Hospitais de referência de São Paulo e quais planos dão acesso a cada um" (nas 3 páginas que
oferecem o guia — Home, `/plano-familiar`, `/plano-empresarial`) sugeria um mapeamento definitivo por
plano, que o guia não tem. Trocado por "Como avaliar hospitais e rede credenciada antes de escolher seu
plano" (Home) e "Guia para avaliar hospitais e rede credenciada em São Paulo" (landings) — mesma ideia,
sem prometer uma tabela hospital-por-plano que não existe.

### Alegações revisadas (item 11 do briefing)

| Alegação | Classificação | Onde |
|---|---|---|
| "Todas as principais operadoras" / "acesso direto às principais operadoras" | Confirmada pela cliente (lista de 17 operadoras, rodada anterior) | Home |
| "6 anos de mercado" | Confirmada pela cliente | Home |
| SLA "1 hora útil" | Confirmada pela cliente | Home, MedSênior, Alice, `/obrigado` |
| "Rede de hospitais de referência de São Paulo" (teaser Quem somos na Home) | Formulação institucional segura — não promete cobertura, descreve foco de atuação | Home |
| "Atendimento em todo o Brasil" | Ambígua sem confirmação explícita — aplicada leitura segura (ver acima) | Home, MedSênior, Alice, FAQ |
| "Hospitais de referência... e quais planos dão acesso a cada um" (guia) | Exagerada — corrigida nesta rodada | Home, MedSênior, Alice |
| "Seus dados não são compartilhados com terceiros" (isca) | Ambígua/imprecisa frente à política completa — corrigida nesta rodada | Home, MedSênior, Alice |
| Nomes dos 6 hospitais na nova seção | Confirmados pela cliente (transcrição dos áudios) — nomenclatura pública conferida por busca | Home |

### O que foi testado nesta rodada

- `npm run lint`: sem erros/warnings novos nos arquivos alterados.
- `npm run build`: sucesso, 16 rotas.
- `npx opennextjs-cloudflare build`: sucesso, `.open-next/worker.js` gerado.
- Verificação visual via dev server local (desktop) da Home, incluindo a nova seção e o guia
  reposicionado/reescrito.
- **Não testado nesta rodada**: viewport mobile real (mesma limitação de ferramenta já registrada na
  rodada anterior — a emulação de viewport não alterou `window.innerWidth` neste ambiente); pipeline de
  formulário → D1 → admin (não reenviado, para não gerar lead de teste desnecessário — os componentes de
  formulário não foram alterados nesta rodada, só a legenda de texto abaixo deles); Pixel/CAPI no
  Gerenciador de Eventos.

### Arquivos alterados nesta branch

`src/app/page.tsx`, `src/components/HospitalNetwork.tsx` (novo), `src/components/LeadFormIsca.tsx`,
`src/components/FAQAccordion.tsx`, `src/app/plano-familiar/page.tsx`, `src/app/plano-empresarial/page.tsx`.

### Pendências

- Confirmar com a cliente se "Hospital Samaritano" deve especificar Higienópolis, Paulista, ou ficar
  genérico.
- Confirmar a natureza exata de "atendimento em todo o Brasil" (comercial vs. cobertura de rede).
- Fotografias/logos dos hospitais: **sem autorização, não usados**. Se a cliente quiser adicionar depois,
  precisa fornecer os arquivos com procedência conhecida (não pesquisar e publicar imagem da internet).
- Mesmas pendências já registradas nas rodadas anteriores (número de famílias/empresas atendidas, domínio
  próprio).

## Branch `premium-redesign` (26/08/2026)

Reformulação de direção premium sobre a base já validada — arquitetura, D1, admin, Pixel/CAPI, dedup
por `event_id`, UTMs e todos os formulários foram **preservados intactos** (nenhum schema, rota ou
payload mudou). O que mudou foi estratégia editorial e conteúdo responsável nas três jornadas:

- **Home (`/`)** — hero editorial dividido com a foto real de Luciana e Jhonatan (não mais só depois de
  10 blocos), headline trocada (evita a acusação "você está pagando mais caro" sem análise prévia),
  método em progressão numerada (não 4 cards idênticos), 2 caminhos com hierarquia distinta em vez de 3
  cards iguais (60+ absorvido na jornada familiar, sem campanha artificial própria), FAQ em duas
  colunas, "Quem somos" como teaser textual (a foto não se repete — já apareceu no hero).
- **`/plano-familiar` (MedSênior)** — headline trocada (removida a alegação absoluta "o plano mais
  completo e acessível de São Paulo"), aviso de responsabilidade visível logo abaixo do hero (não só no
  rodapé), bloco "o que analisamos", FAQ específico da campanha. A foto da fachada foi **recortada** —
  a versão original trazia "CARÊNCIA ZERO" e "R$ 810,73" cravados na própria imagem (é a peça de
  anúncio inteira, não só a fachada), o que republicaria uma condição comercial não confirmada mesmo
  sendo "só uma foto". Ver `public/creatives/medsenior-fachada-sp.jpg` (só fachada/logo, sem texto
  comercial). Os criativos originais completos (com o texto comercial) **não estão neste repositório**
  — vivem só em `Trafego Pago/Jhonatan/Criativos-Vencedores/` na máquina local, fora do controle de
  versão do site. Só a versão recortada e segura foi commitada.
- **`/plano-empresarial` (Alice)** — o vídeo saiu de uma seção isolada pós-hero e foi para dentro da
  primeira dobra, ao lado do headline (era o pedido central do briefing: o vídeo é o próprio anúncio, a
  continuidade precisa ser imediata). Poster trocado — a versão anterior tinha 64×64px; o novo poster é
  um frame real extraído do vídeo com `ffmpeg` (`public/creatives/alice-video-poster.jpg`, 1080×1920).
  Headline trocada (removidas "não perca a condição especial" e "sua empresa provavelmente está pagando
  a tabela errada" — ambas presumem uma conclusão antes da análise). Bloco novo listando os fatores que
  mudam a condição (vidas, idade, região, acomodação, coparticipação, rede).

**Segurança factual aplicada nas duas landings:** nenhuma condição comercial da MedSênior ou da Alice
(carência, coparticipação, desconto, preço, hospital específico) é afirmada como vigente — só os
avisos "condições variam conforme perfil, confirmadas durante a análise". Os criativos vencedores
continuam sendo a referência de ângulo/mensagem (message match), não uma fonte de condições comerciais
atuais.

**Números internos de tráfego não viraram prova pública.** Os PDFs de planejamento (`Plano-90-Dias...`,
`Relatorio-Criativos...`) trazem 18 campanhas, ~R$8.530 investidos, ~504 formulários, CPLs e projeções
— são dados internos de mídia, não equivalem a clientes atendidos. Nada disso apareceu como número no
site (a `CredibilityBar` segue sem estatística nenhuma, como já estava).

## Rodada 2 — direção visual premium (26/08/2026, mesma branch `premium-redesign`)

A 1ª rodada resolveu estrutura, responsabilidade e SEO, mas manteve a mesma fórmula visual nas três
páginas (gradiente navy, pílula dourada, cards brancos `rounded-2xl`, tudo centralizado). Esta rodada
ataca especificamente a direção visual — sem tocar em arquitetura, D1, Pixel/CAPI, UTMs ou payload de
formulário, que seguem intactos.

**Sistema de design (`src/app/globals.css`)** — tokens de cor contextual por campanha, além do
navy/gold/cream institucional: `--color-medsenior` (verde editorial escuro, não o verde vivo do
anúncio) e `--color-alice` (bordô, derivado da cor da blusa da Luciana no vídeo, deliberadamente mais
contido que o vermelho puro do vídeo). Utilitárias novas: `.numeral` (numeração serifada estilo
old-style para listas de passos), `.hairline` (divisor em degradê fino) e `.headline-editorial`
(Playfair 600, `line-height` apertado, `text-wrap: balance`) substituindo o padrão ad hoc anterior.
`prefers-reduced-motion` respeitado globalmente.

**Header diferenciado por contexto** — `Header.tsx` (Home e Quem somos) virou client component com
menu mobile de verdade: botão com `aria-expanded`/`aria-controls`/`aria-label` dinâmicos, painel que
fecha ao selecionar um link, navegável por teclado (elementos nativos `button`/`Link`). `CampaignHeader.tsx`
(novo) é a versão enxuta das duas landings — marca L&J, identificação da campanha, um CTA, link
discreto de volta à Home, sem navegação institucional (a landing existe só para o tráfego daquele
anúncio).

**Bug crítico corrigido — fachada da MedSênior sumia no mobile.** A imagem estava com `hidden sm:block`,
invisível em telas pequenas — praticamente todo o tráfego pago é mobile. `plano-familiar/page.tsx` agora
tem um banner full-width só para mobile (`sm:hidden`, `aspect-[16/9]`) além do painel lateral de desktop
(`hidden sm:block`), com composição própria em cada breakpoint.

**Conversão movida para a primeira dobra.** Nas duas landings, o formulário completo de qualificação
saiu do fim da página e passou a ficar logo após o hero (`<section id="analise">`), sem alterar nenhum
campo, prop ou payload do componente — só a posição. O formulário-isca do guia gratuito continua
existindo, mas como conversão secundária mais abaixo.

**Correções factuais de copy aplicadas (pedido explícito do cliente):**
- MedSênior FAQ: "Ela entra na comparação porque tem bom histórico para o perfil de quem busca economia"
  (histórico de performance de anúncio não é prova de adequação do produto) → "Ela entra na análise como
  uma das alternativas consideradas para o perfil, sempre conforme disponibilidade e condições vigentes."
- MedSênior, texto da dor: "Uma análise comparativa evita esse tipo de surpresa" → "Uma análise
  comparativa ajuda a reduzir o risco de surpresas" (evita a garantia implícita de "evita").
- Alice: removida a frase "É o que a maioria dos donos de CNPJ e MEI ainda paga" — não há fonte
  confirmada para "a maioria".
- Alice: "CNPJ e pessoa física seguem tabelas diferentes" → "Um CNPJ pode permitir acesso a modalidades
  empresariais com regras próprias" — não afirma que todo CNPJ/MEI é elegível, nem que a modalidade
  empresarial necessariamente sai mais barata.

**Política de Privacidade revisada** (`src/app/politica-de-privacidade/page.tsx`) para descrever Meta
Pixel, API de Conversões (com hash SHA-256 de contato antes do envio), Cloudflare como infraestrutura, e
armazenamento local de UTM — sem contradizer o texto já existente de "não vendemos nem compartilhamos
para marketing de terceiros" (a Meta foi tratada como categoria própria: parceira de mensuração dos
próprios anúncios, não terceiro de marketing alheio). **O texto não passou por validação jurídica** — a
própria página traz um aviso nesse sentido; recomenda-se revisão por advogado especializado em LGPD antes
do go-live definitivo.

**`/quem-somos` reforçado** — hero assimétrico com monograma "L&J" grande, citação em destaque, e uma
seção nova "Quem assina o nome" explicando a função de cada sócio (Luciana à frente do atendimento e da
análise; Jhonatan na estrutura da consultoria e relação com operadoras) — reforça que a consultoria é
dos dois, não só da Luciana.

### O que foi testado de verdade nesta rodada (e o que não foi)

Para não afirmar cobertura que não existe:

| Verificação | Como foi feita |
|---|---|
| `npm run lint` | Executado. Nenhum erro/warning novo nos arquivos desta rodada (`Header.tsx`, `CampaignHeader.tsx`, `plano-familiar`, `plano-empresarial`, `page.tsx`, `quem-somos`, `globals.css`, `robots.ts`, `politica-de-privacidade`). Os erros/warnings existentes no `npm run lint` são todos pré-existentes em `admin/page.tsx`, `CookieConsent.tsx` e nos artefatos gerados de `.open-next/` — não tocados nesta rodada. |
| `npm run build` (Next.js puro) | Executado com sucesso, todas as 16 rotas geradas, incluindo a nova `/robots.txt` dinâmica. |
| Build específico do Cloudflare (`opennextjs-cloudflare build`) | **Não executado nesta rodada** — só o build padrão do Next foi validado. Recomenda-se rodar antes do deploy real. |
| Menu mobile funcional (Home) | Testado via DOM/JS no navegador: clique no botão alterna `aria-expanded` de `false` para `true`, painel `#mobile-menu` aparece com os 4 links de navegação + CTA. **Não foi possível capturar screenshot em viewport mobile real (360/390/768px) nesta sessão** — a ferramenta de redimensionamento do navegador não alterou `window.innerWidth` neste ambiente. A correção da fachada MedSênior no mobile foi conferida por inspeção de código (classes Tailwind `sm:hidden` / `hidden sm:block`), não por captura visual em viewport estreita. |
| Screenshots desktop | Capturados para Home, Quem somos, MedSênior e Alice (~1568px de largura). |
| Pipeline formulário → D1 → admin | Testado ao vivo nesta sessão: formulário de qualificação da página Alice preenchido e enviado no `next dev` local, `POST /api/lead` retornou 200, redirecionamento para `/obrigado?...&campanha=alice-empresarial` confirmado, e o lead apareceu no painel `/admin` com página/campanha/campo "É para" corretos. **Isso testa o binding D1 local (`.wrangler/state`), não o ambiente publicado do Cloudflare Workers.** |
| Pixel / API de Conversões / deduplicação | **Não testado nesta rodada** — nenhuma verificação no Gerenciador de Eventos da Meta foi feita. Os formulários apenas tiveram a posição alterada; o componente e sua lógica de disparo não foram tocados, então o comportamento esperado é o mesmo já documentado na seção "Pixel da Meta / API de Conversões" — mas isso é inferência de código, não um teste executado. |
| Segredos / `.dev.vars` | Conferido que `.dev.vars`, `cloudflare-env.d.ts` (gerado) e nenhum token/segredo novo foram adicionados ao commit desta rodada. |

### Atualizações do cliente, recebidas após a rodada 2

- **SLA de resposta**: cliente confirmou 1 hora útil (não 2) — corrigido em `plano-familiar`,
  `plano-empresarial` e `/obrigado`.
- **Validação jurídica**: cliente confirmou que está OK, sem necessidade de documento. O aviso na
  Política de Privacidade dizendo que "ainda não passou por validação jurídica formal" foi **removido**
  a pedido do cliente.
- **6 anos de mercado**: adicionado à `CredibilityBar`.
- **Número de famílias/empresas atendidas**: cliente confirmou que ainda está pendente — segue de fora
  da `CredibilityBar` (nenhum placeholder "pendente" foi escrito no site, como pedido).
- **Operadoras**: cliente passou a lista real de 17 operadoras analisadas (Alice, Amil, Bradesco, Care
  Plus, Hapvida, MedSênior, Omint, Porto Seguro, São Camilo, Proasa, Sami, São Cristóvão, Bluemed,
  SulAmérica, Seguros Unimed, Trasmontano, Unimed Guarulhos) — agora exibida na Home logo abaixo da
  `CredibilityBar` (`src/components/OperatorsList.tsx`), substanciando as alegações "todas as principais
  operadoras" e "acesso direto às principais operadoras".
- **Registro profissional**: cliente confirmou que não tem registro formal ainda — trabalham
  credenciados pelas operadoras. Nada foi adicionado ao rodapé sobre isso, como pedido; a linha segue
  removida (item já resolvido, não é mais pendência).
- **WhatsApp**: `(11) 95609-8194` reconfirmado como definitivo.
- **Modalidades de produto**: cliente informou que a consultoria trabalha com Individual/Familiar,
  Adesão (via associação/sindicato) e PME (empresarial). Adicionado um item de FAQ explicando as três
  modalidades (`FAQAccordion.tsx`) e uma menção ao plano de adesão como terceira via na página
  `/plano-empresarial` (que antes só comparava pessoa física vs. CNPJ).
- **Depoimentos reais**: encontrados no perfil público do Google (L&J Seguros, mesmo telefone do
  cliente), 5,0★/15 avaliações. Quatro depoimentos verificados (nomes completos, sem exposição de
  condição de saúde) estão na seção de prova social da Home (`src/components/SocialProof.tsx`,
  substituindo o antigo `SocialProofPending.tsx`). O perfil tem mais avaliações não usadas ainda, se
  quiser trocar ou variar depois.

### Pendências que ainda dependem do cliente

- Confirmação de fonte para "Atendimento em todo o Brasil" e "Rede de hospitais de referência" (as
  alegações sobre operadoras já foram resolvidas com a lista real).
- Número de famílias/empresas atendidas (para a `CredibilityBar`).
- Domínio próprio — mesma pendência já listada na rodada 1.

### Sobre produção

**Nada desta rodada (nem da rodada 1) está em produção.** Todo o trabalho está só na branch
`premium-redesign`, commitada e enviada para `origin/premium-redesign` no GitHub — nunca mesclada na
`main` nem publicada no Worker do Cloudflare. O Worker publicado (ligado à `main` via Cloudflare Workers
Builds) ainda está rodando a versão anterior a toda essa reformulação. Para publicar, é preciso abrir um
Pull Request de `premium-redesign` para `main` e mesclar — passo que depende de aprovação visual
explícita do cliente, por instrução do próprio cliente nesta rodada.

## Rodando localmente

```bash
npm install
npm run dev
```

Abre em http://localhost:3000. O binding do D1 funciona em `next dev` graças ao
`initOpenNextCloudflareForDev()` em `next.config.ts` — ele lê o banco local espelhado em
`.wrangler/state`. Para aplicar o schema nesse banco local pela primeira vez (ou depois de mudar o
schema):

```bash
npx wrangler d1 execute luciana-pandolfi-leads --local --file=schema.sql
```

Depois, aplicar as migrations incrementais em `migrations/` na ordem numérica (contas administrativas e
promoções — ver seção "Branch `launch-promotions-admin`" para detalhes de cada uma):

```bash
npx wrangler d1 execute luciana-pandolfi-leads --local --file=migrations/0001_admin_accounts.sql
npx wrangler d1 execute luciana-pandolfi-leads --local --file=migrations/0002_promotions.sql
```

A senha do painel `/admin` em desenvolvimento vem de `.dev.vars` (não commitado). Contas individuais
(e-mail + senha) são criadas depois, de dentro do próprio painel, por quem entrar com essa senha.

## Deploy (Cloudflare Workers)

```bash
npm run deploy
```

Isso builda com o OpenNext e publica via Wrangler, usando o banco D1 `luciana-pandolfi-leads`
(binding `DB`, já criado e referenciado em `wrangler.toml`).

Antes do primeiro deploy em produção, definir o segredo da senha do admin (não é lido de `.dev.vars`
em produção):

```bash
npx wrangler secret put ADMIN_PASSWORD
```

E aplicar o schema no banco remoto, se ainda não tiver sido aplicado:

```bash
npx wrangler d1 execute luciana-pandolfi-leads --remote --file=schema.sql
```

## Painel de leads (`/admin`)

Todo formulário do site (isca de 3 campos ou qualificação completa, em qualquer página) grava um
registro na tabela `leads` do D1. O painel lista os leads mais recentes primeiro, com origem, UTM,
campanha e todos os campos de qualificação. Acesso por senha única (variável `ADMIN_PASSWORD`), sem
cadastro de usuário — pensado para a Luciana e sua equipe, não para múltiplos operadores com papéis
diferentes.

## Pendências de conteúdo real (não travam o go-live, mas precisam ser resolvidas)

Estes itens foram deixados como estão no briefing — nada foi inventado. Ver comentários no código nos
locais indicados.

- **Textos de confiança sem fonte confirmada** ("Resposta em até 2 horas úteis", "Acesso direto às
  principais operadoras", "Todas as principais operadoras", "Atendimento em todo o Brasil", "Rede de
  hospitais de referência"): mantidos porque descrevem o modo de operação da consultoria (SLA de
  atendimento, comparação de mercado), não uma certificação, número ou registro formal — não se apoiam na
  bio do Instagram como prova. Se a cliente puder fornecer documentação formal de SLA ou parcerias, isso
  fortalece a alegação; até lá, o texto foi mantido por descrever comportamento e não uma métrica auditável.
- **Números de credibilidade** (`src/components/CredibilityBar.tsx`): "+X anos de mercado" e "+X
  famílias e empresas atendidas" ficaram de fora da barra de credibilidade da Home. Assim que a
  cliente confirmar os números reais, adicionar ao array `ITEMS`.
- **Prova social** (`src/components/SocialProofPending.tsx`, bloco 6 da Home): a cliente foi acionada
  para mandar depoimentos. **Decisão final (revisada na 2ª rodada): a seção NÃO é renderizada
  publicamente** — nada de "em breve" visível pro visitante, isso comunica site incompleto. O
  componente fica pronto e não usado em `src/app/page.tsx` (import comentado). Assim que os depoimentos
  reais chegarem (respeitando a regra de nunca expor condição de saúde), reativar o import e o uso, e
  cards — não trocar a posição do bloco.
- ~~Foto de Luciana e Jhonatan juntos~~ — resolvido. `public/team/luciana-e-jhonatan.jpg` (a foto real
  do escritório dos dois) está no bloco "Quem somos" da Home, substituindo o selo "L&J" placeholder.
- **Promoção "20% na 1ª mensalidade" da MedSênior** (`/plano-familiar`): só reaparecer na página se a
  cliente confirmar que a condição ainda está ativa na operadora, com data de validade real.
- **Registro profissional**: removido do rodapé público (`src/components/Footer.tsx`) — um placeholder
  "a confirmar com a cliente" visível para qualquer visitante não é aceitável em produção. Não
  necessariamente é SUSEP; confirmar com a cliente qual é o órgão/registro correto para a atividade
  antes de reativar a linha (comentário no código aponta onde reinserir).
- **WhatsApp**: número atual (11) 95609-8194, informado no início do projeto. Confirmar se é
  definitivo antes do go-live — está em `src/lib/site-config.ts`.
- **Domínio**: o site está sendo construído sem domínio definido (é responsabilidade da cliente
  registrar, à parte). Nenhuma referência de domínio fixo está hardcoded no código.

## Pixel da Meta / API de Conversões

Conectado (Pixel ID `1009645534315662`, do arquivo `CONFIDENCIAL-Acessos-Pixel-API-Luciana-Pandolfi.txt`
em `Trafego Pago/Jhonatan/`). Funciona em duas camadas, com deduplicação via `event_id` compartilhado:

- **Pixel no navegador** (`src/components/MetaPixelBase.tsx`): carregado em todas as páginas, dispara
  `PageView` a cada navegação.
- **API de Conversões, server-side** (`src/lib/meta-capi.ts`): disparada dentro de `/api/lead` assim que
  o lead é gravado no D1, com telefone/e-mail hasheados (SHA-256) e IP/user-agent do request — não
  depende do navegador nem de bloqueador de anúncio para funcionar.
- Os dois mandam o mesmo `event_id` (gerado no formulário, no client) para o evento `Lead` — a Meta
  deduplica automaticamente.

**Antes de qualquer campanha subir (exigência do contrato):**
1. Gerar um código de teste em Gerenciador de Eventos → Pixel "Simulador Luciana Pandolfi" → aba
   **Testar Eventos**, e colocar em `META_CAPI_TEST_EVENT_CODE` (local: `.dev.vars`; produção: secret do
   Worker) enquanto valida.
2. Preencher um formulário de teste no site e confirmar que o evento `Lead` aparece em Testar Eventos
   (tanto a via navegador quanto a via API de Conversões, sem duplicar).
3. Remover/zerar `META_CAPI_TEST_EVENT_CODE` antes do go-live — com o código de teste preenchido, os
   eventos NÃO contam pra otimização real da campanha.

**Secret que falta configurar em produção** (não está no dashboard ainda — só local, em `.dev.vars`):

```bash
npx wrangler secret put META_CAPI_TOKEN --name luciana-pandolfi
```

(rodar a partir da conta Cloudflare correta — ver histórico do projeto sobre a confusão de contas. Se
for feito pelo dashboard: Worker `luciana-pandolfi` → Settings → Variables and Secrets → Add → Secret.)

## GA4 — adiado pra fase 2, por decisão já registrada

Confirmado no arquivo confidencial: ninguém validou ainda se existe uma propriedade GA4 pra marca, e
isso **não é prioridade pro go-live de 01/09/2026** (diferente do Pixel/CAPI, que são obrigatórios).
Não é uma pendência esquecida — é uma decisão já tomada. Retomar na fase 2, verificando primeiro se já
existe uma propriedade GA4 antes de criar uma nova do zero.

## Mensagem automática de WhatsApp para o lead — fora de escopo por decisão do cliente

O fluxo pós-envio não dispara mensagem automática via API do WhatsApp. Em vez disso, `/obrigado`
mostra um botão de WhatsApp com mensagem pré-preenchida para o próprio lead iniciar a conversa.

## Honestidade de copy — "envio imediato" do guia

O texto do bloco de captura (guia de hospitais) dizia "receba o guia completo agora, no seu WhatsApp",
implicando envio automático. Isso nunca foi automatizado (ver seção "Mensagem automática de WhatsApp"
abaixo) — o texto foi trocado para "nossa equipe te envia o guia completo pelo WhatsApp", que descreve
o que realmente acontece (entrega manual pela equipe, dentro do SLA de resposta já informado).

## SEO e Open Graph

`src/lib/site-config.ts` define `SITE_URL` — hoje aponta para a URL real do Worker
(`https://luciana-pandolfi.criativoselevados.workers.dev`), já que o domínio próprio ainda não foi
registrado (responsabilidade da cliente). **Trocar esse valor assim que o domínio definitivo estiver
no ar** — todo canonical, Open Graph e o `sitemap.xml` (`src/app/sitemap.ts`) dependem dele.

- Cada página pública tem `title`, `description`, `alternates.canonical` e `openGraph` próprios (Home,
  Quem somos, MedSênior, Alice, Política de Privacidade).
- Três imagens de Open Graph dedicadas em `public/og/` (`lj.jpg`, `medsenior.jpg`, `alice.jpg`), todas
  exatamente 1200×630 (formato exigido por `summary_large_image`), compostas com `ffmpeg` a partir de
  assets reais — nunca um screenshot automático da página, nunca esticadas, nunca com rosto cortado:
  - `lj.jpg` (Home e Quem somos): foto real de Luciana e Jhonatan no escritório, recortada para excluir
    os itens decorativos das prateleiras que ficavam nas bordas do enquadramento original.
  - `medsenior.jpg`: totem "MedSênior" recortado do `medsenior-fachada-sp.jpg` já existente — mesma
    regra de segurança factual da página (sem preço, carência ou desconto).
  - `alice.jpg`: frame extraído do vídeo do anúncio em `t=5s` (não o poster já existente, que tem a
    legenda "você vai ficar impressionado!" cravada na imagem — evitado por ser uma alegação de anúncio,
    não uma foto neutra) e re-processado em alta resolução (`scale=lanczos` + `unsharp`) a partir do
    vídeo-fonte de 360×640.
- `/obrigado` e `/admin` seguem `noindex` (já estava assim antes desta branch).
- `robots.txt` deixou de ser um arquivo estático em `public/` (tinha o domínio hardcoded, uma segunda
  fonte de verdade além de `SITE_URL`) e virou rota dinâmica `src/app/robots.ts`, gerada a partir do
  mesmo `SITE_URL` que alimenta `sitemap.ts` e o `openGraph` de cada página — um único ponto de
  atualização quando o domínio definitivo entrar no ar.

## Analytics de sessão pseudônima (branch `analytics-sessao-pseudonima`, 01/09/2026)

Sistema de analytics próprio, sem GA4 e sem cookie de rastreio entre sites — adaptado do guia
extraído da implementação em produção no site da Vallery Alves. Complementa (não substitui) o Meta
Pixel/CAPI: aquele mede resultado de anúncio pra otimização da Meta, este dá um funil interno ligado
às suas próprias páginas.

- **Banco:** tabela única `analytics_events` (`migrations/0004_analytics_events.sql`), aditiva.
- **Segurança do endpoint** (`src/lib/analytics-security.ts`, testado em
  `src/lib/__tests__/analytics-security.test.ts`): lista fechada de tipos de evento, limite de
  tamanho de corpo, rate limit em memória por IP (120 eventos/min — por isolate do Worker, não
  global, ver limitação abaixo).
- **Endpoint:** `POST /api/evento` (`src/app/api/evento/route.ts`) — nunca responde erro visível
  nem trava a navegação; qualquer falha (banco fora do ar, campo estranho) é engolida e sempre
  retorna 204.
- **Rastreador no front:** `src/components/AnalyticsTracker.tsx`, montado no `layout.tsx` raiz.
  Diferente do guia original (site multi-page, script solto), aqui é um client component que usa
  `usePathname` pra disparar `page_view` a cada troca de rota do Next.js (navegação client-side, sem
  reload). Sessão pseudônima em `sessionStorage` (expira com a aba), `IntersectionObserver` pra
  `section_view` automático em qualquer `<section id="...">`, e `cta_click` em qualquer elemento
  marcado com `data-cta="rotulo"`.
- **Vocabulário de eventos:** `page_view`, `section_view`, `cta_click`, `whatsapp_click` (via
  `data-cta="whatsapp-flutuante"` no `WhatsAppButton`), `form_start` (primeiro foco no formulário) e
  `form_submit` (após `POST /api/lead` responder OK) — instrumentado em `LeadFormIsca` e
  `LeadFormQualificacao`.
- **Painel:** `/admin/analytics` — funil por página (pivotado com `src/lib/analytics-funil.ts`,
  testado) e visitas por campanha UTM, ambos vindos de `GET /api/admin/analytics`.
- **Privacidade:** parágrafo próprio adicionado em `/politica-de-privacidade` explicando o
  identificador de sessão. A leitura técnica usada foi que sessão pseudônima + expira com a aba +
  nenhum identificador cruzável não caracteriza dado pessoal — não é parecer jurídico, só a decisão
  documentada do projeto.
- **Limitação conhecida:** o rate limit é por isolate do Worker, não compartilhado globalmente —
  segura abuso trivial de um único IP, não um ataque distribuído sério (precisaria de KV/Redis
  compartilhado pra isso).

## Captura de UTM

UTMs (`utm_source`, `utm_medium`, `utm_campaign`, `utm_content`, `utm_term`) são capturados da URL no
carregamento da página (`src/lib/utm.ts`) e guardados em `localStorage`, depois enviados junto com
qualquer formulário — inclusive se o visitante navegar entre páginas antes de converter.
