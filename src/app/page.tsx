import Link from "next/link";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import WhatsAppButton from "@/components/WhatsAppButton";
import CredibilityBar from "@/components/CredibilityBar";
import FAQAccordion from "@/components/FAQAccordion";
import LeadFormIsca from "@/components/LeadFormIsca";
import LeadFormQualificacao from "@/components/LeadFormQualificacao";
import { WHATSAPP_MESSAGES } from "@/lib/site-config";

export default function HomePage() {
  return (
    <>
      <Header />
      <main className="flex-1">
        {/* Bloco 1 — Hero */}
        <section className="bg-gradient-to-b from-[#0b2436] to-[#123a52] px-4 py-16 text-white sm:px-6 sm:py-24">
          <div className="mx-auto max-w-3xl text-center">
            <h1 className="font-serif-display text-3xl font-semibold leading-tight sm:text-5xl">
              Você provavelmente está pagando mais caro do que precisa no seu plano de saúde.
            </h1>
            <p className="mx-auto mt-5 max-w-2xl text-base text-slate-200 sm:text-lg">
              Consultoria gratuita e independente em planos de saúde. Eu comparo as opções do
              mercado, verifico quais delas dão acesso aos hospitais de referência de São Paulo e
              te mostro o cenário completo — para você decidir com informação, não com achismo.
            </p>
            <a
              href="#simulacao"
              className="mt-8 inline-block rounded-full bg-teal-500 px-8 py-4 text-base font-semibold text-white transition-colors hover:bg-teal-400"
            >
              Quero minha simulação gratuita
            </a>
            <p className="mt-4 text-sm text-slate-300">
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
            <h2 className="font-serif-display text-2xl font-semibold text-[#0b2436] sm:text-3xl">
              O problema quase nunca é o preço. É o contrato montado errado.
            </h2>
            <p className="mt-5 text-base leading-relaxed text-slate-600">
              A maioria das pessoas contrata plano de saúde olhando só a mensalidade. Descobre o
              resto quando precisa usar: o hospital que queria não está na rede, a acomodação não
              é a que imaginava, a carência não era zero, a coparticipação transforma cada
              consulta em uma conta a mais.
            </p>
            <p className="mt-3 text-base leading-relaxed text-slate-600">
              Do outro lado, quem tem CNPJ segue pagando como pessoa física sem saber que existe
              outra tabela. E empresas continuam com contratos que não são revistos há anos.
            </p>
          </div>
        </section>

        {/* Bloco 4 — Como funciona */}
        <section className="bg-white px-4 py-16 sm:px-6">
          <div className="mx-auto max-w-4xl">
            <h2 className="text-center font-serif-display text-2xl font-semibold text-[#0b2436] sm:text-3xl">
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
                <li key={step.n} className="flex gap-4 rounded-2xl border border-slate-200 p-5">
                  <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-teal-600 text-sm font-semibold text-white">
                    {step.n}
                  </span>
                  <div>
                    <p className="font-semibold text-[#0b2436]">{step.t}</p>
                    <p className="mt-1 text-sm leading-relaxed text-slate-600">{step.d}</p>
                  </div>
                </li>
              ))}
            </ol>
          </div>
        </section>

        {/* Bloco 5 — Segmentação */}
        <section className="px-4 py-16 sm:px-6">
          <div className="mx-auto max-w-5xl">
            <h2 className="text-center font-serif-display text-2xl font-semibold text-[#0b2436] sm:text-3xl">
              Para quem é
            </h2>
            <div className="mt-10 grid gap-6 sm:grid-cols-3">
              <Link
                href="/plano-empresarial"
                className="group rounded-2xl border border-slate-200 bg-white p-6 transition-shadow hover:shadow-lg"
              >
                <p className="font-semibold text-[#0b2436]">Para empresas (CNPJ)</p>
                <p className="mt-2 text-sm leading-relaxed text-slate-600">
                  Plano empresarial a partir de poucas vidas, com condições diferentes das da
                  pessoa física. Para quem tem CNPJ ativo, MEI ou quer oferecer o benefício ao
                  time.
                </p>
                <span className="mt-4 inline-block text-sm font-semibold text-teal-600 group-hover:underline">
                  Ver condições →
                </span>
              </Link>
              <Link
                href="/plano-familiar"
                className="group rounded-2xl border border-slate-200 bg-white p-6 transition-shadow hover:shadow-lg"
              >
                <p className="font-semibold text-[#0b2436]">Para famílias e individual</p>
                <p className="mt-2 text-sm leading-relaxed text-slate-600">
                  Para quem quer contratar o primeiro plano, trocar de operadora ou reduzir o
                  custo mantendo o acesso aos mesmos hospitais.
                </p>
                <span className="mt-4 inline-block text-sm font-semibold text-teal-600 group-hover:underline">
                  Ver condições →
                </span>
              </Link>
              <a
                href="#simulacao"
                className="group rounded-2xl border border-slate-200 bg-white p-6 transition-shadow hover:shadow-lg"
              >
                <p className="font-semibold text-[#0b2436]">Para 60+ (sênior)</p>
                <p className="mt-2 text-sm leading-relaxed text-slate-600">
                  Para quem está resolvendo o plano dos pais ou o próprio, e precisa entender as
                  alternativas do mercado nas faixas mais altas.
                </p>
                <span className="mt-4 inline-block text-sm font-semibold text-teal-600 group-hover:underline">
                  Solicitar análise →
                </span>
              </a>
            </div>
          </div>
        </section>

        {/* Bloco 7 — Isca de captura */}
        <section id="guia" className="bg-[#0b2436] px-4 py-16 text-white sm:px-6">
          <div className="mx-auto grid max-w-4xl gap-10 sm:grid-cols-2 sm:items-center">
            <div>
              <h2 className="font-serif-display text-2xl font-semibold sm:text-3xl">
                Guia gratuito: os hospitais de referência de São Paulo e quais planos dão acesso
                a cada um
              </h2>
              <p className="mt-4 text-sm leading-relaxed text-slate-300">
                Se existe um hospital em que você quer ser atendido, é por ele que a escolha do
                plano deveria começar — e não pelo preço. Preencha ao lado e receba o guia
                completo agora, no seu WhatsApp.
              </p>
            </div>
            <div className="rounded-2xl bg-white p-6">
              <LeadFormIsca sourcePage="home" />
            </div>
          </div>
        </section>

        {/* Bloco 8 — FAQ */}
        <section className="px-4 py-16 sm:px-6">
          <div className="mx-auto max-w-3xl">
            <h2 className="text-center font-serif-display text-2xl font-semibold text-[#0b2436] sm:text-3xl">
              Perguntas frequentes
            </h2>
            <div className="mt-10">
              <FAQAccordion />
            </div>
          </div>
        </section>

        {/* Bloco 9 — Quem é você */}
        <section className="bg-white px-4 py-16 sm:px-6">
          <div className="mx-auto flex max-w-2xl flex-col items-center gap-4 text-center">
            <div
              aria-hidden
              className="flex h-24 w-24 items-center justify-center rounded-full bg-[#0b2436] font-serif-display text-2xl text-white"
            >
              LP
            </div>
            <h2 className="font-serif-display text-xl font-semibold text-[#0b2436]">
              Luciana Pandolfi
            </h2>
            <p className="max-w-md text-sm leading-relaxed text-slate-600">
              Consultora de planos de saúde em São Paulo, com acesso direto às principais
              operadoras e à rede de hospitais de referência da cidade — o diferencial que guia
              cada recomendação que eu faço.
            </p>
            <a
              href="https://www.instagram.com/lucianapandolfi.consultora/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm font-semibold text-teal-600 hover:underline"
            >
              @lucianapandolfi.consultora no Instagram
            </a>
          </div>
        </section>

        {/* Bloco 10 — Fechamento */}
        <section id="simulacao" className="px-4 py-16 sm:px-6">
          <div className="mx-auto max-w-xl">
            <h2 className="text-center font-serif-display text-2xl font-semibold text-[#0b2436] sm:text-3xl">
              Vamos descobrir quanto você pode melhorar no seu plano?
            </h2>
            <p className="mt-4 text-center text-sm leading-relaxed text-slate-600">
              Preencha os dados abaixo e eu retorno com a análise comparativa. Sem custo, sem
              compromisso e sem insistência.
            </p>
            <div className="mt-8 rounded-2xl border border-slate-200 bg-white p-6">
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
