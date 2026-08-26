# Site — L&J Consultoria | Planos de Saúde

Site de conversão e captura de leads. Next.js (App Router) + Tailwind, banco de leads em Cloudflare D1,
deploy em Cloudflare Workers via OpenNext.

Páginas: `/` (Home), `/quem-somos`, `/plano-empresarial` (campanha Alice/PME), `/plano-familiar`
(campanha MedSênior/família), `/obrigado`, `/admin` (painel de leads), `/politica-de-privacidade`.

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

### Pendências que dependem do cliente (rodada 2)

- Validação jurídica formal da Política de Privacidade revisada.
- Confirmação de fonte para as alegações de confiança mantidas ("Resposta em até 2 horas úteis", "Acesso
  direto às principais operadoras", etc.) — ver seção de pendências de conteúdo acima.
- Mesmas pendências já listadas na rodada 1 (números de credibilidade, prova social, WhatsApp
  definitivo, domínio) continuam abertas.

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

## Captura de UTM

UTMs (`utm_source`, `utm_medium`, `utm_campaign`, `utm_content`, `utm_term`) são capturados da URL no
carregamento da página (`src/lib/utm.ts`) e guardados em `localStorage`, depois enviados junto com
qualquer formulário — inclusive se o visitante navegar entre páginas antes de converter.
