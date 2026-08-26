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
- **Prova social** (bloco 6 do briefing da Home): não existe depoimento, print de WhatsApp ou foto de
  visita a operadora/hospital ainda. O bloco foi omitido da Home por enquanto — não tem como manter a
  posição "promessa → prova → método..." sem prova real. Assim que houver material (respeitando a
  regra de nunca expor condição de saúde), criar o componente e reencaixar entre "Para quem é" e a
  isca de captura.
- **Foto profissional da Luciana** (bloco "Quem é você" na Home): hoje é um círculo com iniciais "LP".
  Trocar por foto real assim que disponível.
- **Promoção "20% na 1ª mensalidade" da MedSênior** (`/plano-familiar`): só reaparecer na página se a
  cliente confirmar que a condição ainda está ativa na operadora, com data de validade real.
- **Registro profissional (SUSEP)**: hoje o rodapé diz "a confirmar com a cliente". Substituir pelo
  número real assim que informado — é citado como requisito de conformidade no diagnóstico de
  Instagram.
- **WhatsApp**: número atual (11) 95609-8194, informado no início do projeto. Confirmar se é
  definitivo antes do go-live — está em `src/lib/site-config.ts`.
- **Domínio**: o site está sendo construído sem domínio definido (é responsabilidade da cliente
  registrar, à parte). Nenhuma referência de domínio fixo está hardcoded no código.

## Pixel da Meta / API de Conversões / GA4 — BYPASS ATIVO

Por decisão explícita durante o desenvolvimento, o disparo de eventos de conversão está mockado (só
loga no console) em `src/components/ConversionTracking.tsx`, usado em `/obrigado`. **Isso é bloqueante
para a campanha** — o contrato exige Pixel + API de Conversões + GA4 testados e validados no "Testar
Eventos" da Meta antes de qualquer campanha subir (01/09/2026). Ver instruções passo a passo dentro do
próprio arquivo `ConversionTracking.tsx`.

## Mensagem automática de WhatsApp para o lead — fora de escopo por decisão do cliente

O fluxo pós-envio não dispara mensagem automática via API do WhatsApp. Em vez disso, `/obrigado`
mostra um botão de WhatsApp com mensagem pré-preenchida para o próprio lead iniciar a conversa.

## Captura de UTM

UTMs (`utm_source`, `utm_medium`, `utm_campaign`, `utm_content`, `utm_term`) são capturados da URL no
carregamento da página (`src/lib/utm.ts`) e guardados em `localStorage`, depois enviados junto com
qualquer formulário — inclusive se o visitante navegar entre páginas antes de converter.
