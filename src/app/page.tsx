import Link from "next/link";
import Image from "next/image";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import WhatsAppButton from "@/components/WhatsAppButton";
import CredibilityBar from "@/components/CredibilityBar";
import FAQAccordion from "@/components/FAQAccordion";
import LeadFormIsca from "@/components/LeadFormIsca";
import LeadFormQualificacao from "@/components/LeadFormQualificacao";
import SocialProofPending from "@/components/SocialProofPending";
import { WHATSAPP_MESSAGES } from "@/lib/site-config";

export default function HomePage() {
  return (
    <>
      <Header />
      <main className="flex-1">
        {/* Bloco 1 — Hero */}
        <section className="relative overflow-hidden bg-gradient-to-b from-navy-deep via-navy to-navy-light px-4 py-20 text-cream sm:px-6 sm:py-28">
          <div
            aria-hidden
            className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-gold/60 to-transparent"
          />
          <div
            aria-hidden
            className="pointer-events-none absolute -top-24 left-1/2 h-72 w-[36rem] -translate-x-1/2 rounded-full bg-gold/10 blur-3xl"
          />
          <div className="relative mx-auto max-w-3xl text-center">
            <p className="eyebrow eyebrow-on-dark">Consultoria independente · São Paulo</p>
            <h1 className="mt-4 font-serif-display text-3xl font-semibold leading-tight sm:text-5xl">
              Você provavelmente está pagando mais caro do que precisa no seu plano de saúde.
            </h1>
            <p className="mx-auto mt-5 max-w-2xl text-base text-cream/80 sm:text-lg">
              Consultoria gratuita e independente em planos de saúde. Eu comparo as opções do
              mercado, verifico quais delas dão acesso aos hospitais de referência de São Paulo e
              te mostro o cenário completo — para você decidir com informação, não com achismo.
            </p>
            <a
              href="#simulacao"
              className="mt-8 inline-block rounded-full bg-gold px-8 py-4 text-base font-semibold text-navy transition-colors hover:bg-gold-light"
            >
              Quero minha simulação gratuita
            </a>
            <p className="mt-4 text-sm text-cream/50">
              Resposta em até 2 horas úteis · Atendimento em São Paulo e em todo o Brasil · Sem
              custo e sem compromisso
            </p>
          </div>
        </section>

        {/* Bloco 2 — Credibilidade */}
        <CredibilityBar />

        {/* Bloco 3 — A dor */}
        <section className="px-4 py-16 sm:px-6">
          <div className="mx-auto max-w-3xl text-center">
            <div className="gold-rule-center" />
            <h2 className="mt-4 font-serif-display text-2xl font-semibold text-navy sm:text-3xl">
              O problema quase nunca é o preço. É o contrato montado errado.
            </h2>
            <p className="mt-5 text-base leading-relaxed text-navy/65">
              A maioria das pessoas contrata plano de saúde olhando só a mensalidade. Descobre o
              resto quando precisa usar: o hospital que queria não está na rede, a acomodação não
              é a que imaginava, a carência não era zero, a coparticipação transforma cada
              consulta em uma conta a mais.
            </p>
            <p className="mt-3 text-base leading-relaxed text-navy/65">
              Do outro lado, quem tem CNPJ segue pagando como pessoa física sem saber que existe
              outra tabela. E empresas continuam com contratos que não são revistos há anos.
            </p>
          </div>
        </section>

        {/* Bloco 4 — Como funciona */}
        <section className="bg-white px-4 py-16 sm:px-6">
          <div className="mx-auto max-w-4xl">
            <p className="eyebrow text-center">O método</p>
            <h2 className="mt-2 text-center font-serif-display text-2xl font-semibold text-navy sm:text-3xl">
              Como funciona
            </h2>
            <ol className="mt-10 grid gap-6 sm:grid-cols-2">
              {[
                {
                  n: "1",
                  t: "Você conta a sua situação.",
                  d: "Quantas pessoas, quais hospitais importam para você, quanto paga hoje. Leva menos de 5 minutos.",
                },
                {
                  n: "2",
                  t: "Eu comparo o mercado.",
                  d: "Analiso as opções das principais operadoras para o seu perfil, verificando rede credenciada, acomodação, carência e reajuste.",
                },
                {
                  n: "3",
                  t: "Você recebe o cenário completo.",
                  d: "Um comparativo claro, com o que cada opção entrega e o que ela não entrega. Sem letra miúda.",
                },
                {
                  n: "4",
                  t: "Você decide — e eu cuido do resto.",
                  d: "Se fizer sentido, eu conduzo toda a contratação ou a migração. Se não fizer, você fica com a análise mesmo assim.",
                },
              ].map((step) => (
                <li
                  key={step.n}
                  className="flex gap-4 rounded-2xl border border-navy/10 bg-cream/40 p-5 shadow-sm"
                >
                  <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-navy font-serif-display text-sm text-gold-light">
                    {step.n}
                  </span>
                  <div>
                    <p className="font-semibold text-navy">{step.t}</p>
                    <p className="mt-1 text-sm leading-relaxed text-navy/60">{step.d}</p>
                  </div>
                </li>
              ))}
            </ol>
          </div>
        </section>

        {/* Bloco 5 — Segmentação */}
        <section className="px-4 py-16 sm:px-6">
          <div className="mx-auto max-w-5xl">
            <p className="eyebrow text-center">Para quem é</p>
            <h2 className="mt-2 text-center font-serif-display text-2xl font-semibold text-navy sm:text-3xl">
              Encontre o seu caminho
            </h2>
            <div className="mt-10 grid gap-6 sm:grid-cols-3">
              <Link
                href="/plano-empresarial"
                className="group rounded-2xl border border-navy/10 border-t-2 border-t-gold bg-white p-6 shadow-sm transition-shadow hover:shadow-lg"
              >
                <p className="font-semibold text-navy">Para empresas (CNPJ)</p>
                <p className="mt-2 text-sm leading-relaxed text-navy/60">
                  Plano empresarial a partir de poucas vidas, com condições diferentes das da
                  pessoa física. Para quem tem CNPJ ativo, MEI ou quer oferecer o benefício ao
                  time.
                </p>
                <span className="mt-4 inline-block text-sm font-semibold text-gold-dark group-hover:underline">
                  Ver condições →
                </span>
              </Link>
              <Link
                href="/plano-familiar"
                className="group rounded-2xl border border-navy/10 border-t-2 border-t-gold bg-white p-6 shadow-sm transition-shadow hover:shadow-lg"
              >
                <p className="font-semibold text-navy">Para famílias e individual</p>
                <p className="mt-2 text-sm leading-relaxed text-navy/60">
                  Para quem quer contratar o primeiro plano, trocar de operadora ou reduzir o
                  custo mantendo o acesso aos mesmos hospitais.
                </p>
                <span className="mt-4 inline-block text-sm font-semibold text-gold-dark group-hover:underline">
                  Ver condições →
                </span>
              </Link>
              <a
                href="#simulacao"
                className="group rounded-2xl border border-navy/10 border-t-2 border-t-gold bg-white p-6 shadow-sm transition-shadow hover:shadow-lg"
              >
                <p className="font-semibold text-navy">Para 60+ (sênior)</p>
                <p className="mt-2 text-sm leading-relaxed text-navy/60">
                  Para quem está resolvendo o plano dos pais ou o próprio, e precisa entender as
                  alternativas do mercado nas faixas mais altas.
                </p>
                <span className="mt-4 inline-block text-sm font-semibold text-gold-dark group-hover:underline">
                  Solicitar análise →
                </span>
              </a>
            </div>
          </div>
        </section>

        {/* Bloco 6 — Prova social */}
        <SocialProofPending />

        {/* Bloco 7 — Isca de captura */}
        <section id="guia" className="bg-navy px-4 py-16 text-cream sm:px-6">
          <div className="mx-auto grid max-w-4xl gap-10 sm:grid-cols-2 sm:items-center">
            <div>
              <p className="eyebrow eyebrow-on-dark">Material gratuito</p>
              <h2 className="mt-2 font-serif-display text-2xl font-semibold sm:text-3xl">
                Guia gratuito: os hospitais de referência de São Paulo e quais planos dão acesso
                a cada um
              </h2>
              <p className="mt-4 text-sm leading-relaxed text-cream/70">
                Se existe um hospital em que você quer ser atendido, é por ele que a escolha do
                plano deveria começar — e não pelo preço. Preencha ao lado e receba o guia
                completo agora, no seu WhatsApp.
              </p>
            </div>
            <div className="rounded-2xl bg-cream p-6">
              <LeadFormIsca sourcePage="home" />
            </div>
          </div>
        </section>

        {/* Bloco 8 — FAQ */}
        <section className="px-4 py-16 sm:px-6">
          <div className="mx-auto max-w-3xl">
            <p className="eyebrow text-center">Dúvidas comuns</p>
            <h2 className="mt-2 text-center font-serif-display text-2xl font-semibold text-navy sm:text-3xl">
              Perguntas frequentes
            </h2>
            <div className="mt-10">
              <FAQAccordion />
            </div>
          </div>
        </section>

        {/* Bloco 9 — Quem somos (versão resumida; texto completo em /quem-somos). */}
        <section className="bg-white px-4 py-16 sm:px-6">
          <div className="mx-auto grid max-w-3xl gap-8 sm:grid-cols-[14rem_1fr] sm:items-center">
            <div className="relative mx-auto aspect-[4/5] w-48 overflow-hidden rounded-t-[9999px] rounded-b-2xl shadow-md sm:w-full">
              <Image
                src="/team/luciana-e-jhonatan.jpg"
                alt="Luciana Pandolfi e Jhonatan, sócios da L&J Consultoria"
                fill
                sizes="14rem"
                className="object-cover object-top"
              />
              <div
                aria-hidden
                className="absolute left-1/2 top-3 flex h-9 w-9 -translate-x-1/2 items-center justify-center rounded-full border-2 border-gold bg-navy/90 font-serif-display text-xs text-gold-light shadow"
              >
                L&J
              </div>
            </div>
            <div className="flex flex-col items-center gap-3 text-center sm:items-start sm:text-left">
              <h2 className="font-serif-display text-xl font-semibold text-navy">
                Luciana Pandolfi &amp; Jhonatan
              </h2>
              <p className="text-sm font-medium text-navy/70">
                L&amp;J Consultoria — Planos de Saúde Nacional
              </p>
              <p className="text-sm leading-relaxed text-navy/60">
                Acesso direto às principais operadoras e à rede de hospitais de referência de São
                Paulo — o diferencial que guia cada recomendação que fazemos.
              </p>
              <Link
                href="/quem-somos"
                className="text-sm font-semibold text-gold-dark hover:underline"
              >
                Conheça a L&amp;J →
              </Link>
            </div>
          </div>
        </section>

        {/* Bloco 10 — Fechamento */}
        <section id="simulacao" className="bg-cream-dark/60 px-4 py-16 sm:px-6">
          <div className="mx-auto max-w-xl">
            <p className="eyebrow text-center">Último passo</p>
            <h2 className="mt-2 text-center font-serif-display text-2xl font-semibold text-navy sm:text-3xl">
              Vamos descobrir quanto você pode melhorar no seu plano?
            </h2>
            <p className="mt-4 text-center text-sm leading-relaxed text-navy/60">
              Preencha os dados abaixo e eu retorno com a análise comparativa. Sem custo, sem
              compromisso e sem insistência.
            </p>
            <div className="mt-8 rounded-2xl border border-navy/10 bg-white p-6 shadow-sm">
              <LeadFormQualificacao sourcePage="home" ctaLabel="Solicitar minha análise gratuita" />
            </div>
          </div>
        </section>
      </main>
      <Footer showHomeLink={false} />
      <WhatsAppButton message={WHATSAPP_MESSAGES.home} />
    </>
  );
}
