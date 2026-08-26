# Site — Luciana Pandolfi | Planos de Saúde

Site de conversão e captura de leads. Next.js (App Router) + Tailwind, banco de leads em Cloudflare D1,
deploy em Cloudflare Workers via OpenNext.

Páginas: `/` (Home), `/plano-empresarial` (campanha Alice/PME), `/plano-familiar` (campanha
MedSênior/família), `/obrigado`, `/admin` (painel de leads), `/politica-de-privacidade`.

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

A senha do painel `/admin` em desenvolvimento vem de `.dev.vars` (não commitado).

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

- **Números de credibilidade** (`src/components/CredibilityBar.tsx`): "+X anos de mercado" e "+X
  famílias e empresas atendidas" ficaram de fora da barra de credibilidade da Home. Assim que a
  cliente confirmar os números reais, adicionar ao array `ITEMS`.
- **Prova social** (`src/components/SocialProofPending.tsx`, bloco 6 da Home): a cliente foi acionada
  para mandar depoimentos. Por instrução explícita, o bloco não fica ausente enquanto isso não chega —
  está montado com 3 cards em estado "em breve" (empresa/família/sênior). Assim que os depoimentos
  reais chegarem (respeitando a regra de nunca expor condição de saúde), substituir o conteúdo dos
  cards — não trocar a posição do bloco.
- **Foto de Luciana e Jhonatan juntos** (bloco "Quem somos" na Home, `src/app/page.tsx`): o site é da
  L&J (os dois sócios), não só da Luciana — correção explícita da cliente. Hoje ainda é o selo "L&J"
  como placeholder. Assim que tiver o arquivo da foto real (a do grid do Instagram, escritório dos
  dois), salvar em `public/team/` e trocar pelo `<Image>` — instruções no comentário acima da seção.
- **Promoção "20% na 1ª mensalidade" da MedSênior** (`/plano-familiar`): só reaparecer na página se a
  cliente confirmar que a condição ainda está ativa na operadora, com data de validade real.
- **Registro profissional (SUSEP)**: hoje o rodapé diz "a confirmar com a cliente". Substituir pelo
  número real assim que informado — é citado como requisito de conformidade no diagnóstico de
  Instagram.
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

## Captura de UTM

UTMs (`utm_source`, `utm_medium`, `utm_campaign`, `utm_content`, `utm_term`) são capturados da URL no
carregamento da página (`src/lib/utm.ts`) e guardados em `localStorage`, depois enviados junto com
qualquer formulário — inclusive se o visitante navegar entre páginas antes de converter.
