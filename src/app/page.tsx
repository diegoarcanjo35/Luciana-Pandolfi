import Link from "next/link";
import Image from "next/image";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import WhatsAppButton from "@/components/WhatsAppButton";
import CredibilityBar from "@/components/CredibilityBar";
import FAQAccordion from "@/components/FAQAccordion";
import LeadFormIsca from "@/components/LeadFormIsca";
import LeadFormQualificacao from "@/components/LeadFormQualificacao";
import type { Metadata } from "next";
import { SITE_URL, WHATSAPP_MESSAGES } from "@/lib/site-config";

export const metadata: Metadata = {
  alternates: { canonical: SITE_URL },
};

export default function HomePage() {
  return (
    <>
      <Header />
      <main className="flex-1">
        {/* Hero — editorial, dividido: texto em bloco marinho, foto real ocupando a outra metade. */}
        <section className="relative overflow-hidden bg-navy-deep text-cream">
          <div
            aria-hidden
            className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-gold/60 to-transparent"
          />
          <div className="mx-auto grid max-w-6xl sm:grid-cols-[1.1fr_1fr] sm:items-stretch">
            <div className="flex flex-col justify-center gap-5 px-4 py-16 sm:px-8 sm:py-24 lg:px-12">
              <p className="eyebrow eyebrow-on-dark">L&amp;J Consultoria · São Paulo</p>
              <h1 className="font-serif-display text-3xl font-semibold leading-[1.15] text-balance sm:text-4xl lg:text-[2.75rem]">
                Seu plano de saúde precisa fazer sentido{" "}
                <span className="italic text-gold-light">antes</span> de você precisar usá-lo.
              </h1>
              <p className="max-w-md text-base leading-relaxed text-cream/75">
                Luciana Pandolfi e Jhonatan comparam o mercado, verificam a rede credenciada e
                explicam o que cada contrato entrega — para você e sua empresa decidirem com
                informação, não com achismo.
              </p>
              <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
                <a
                  href="#simulacao"
                  className="inline-block rounded-full bg-gold px-7 py-3.5 text-center text-base font-semibold text-navy transition-colors hover:bg-gold-light"
                >
                  Quero minha análise gratuita
                </a>
                <Link
                  href="/quem-somos"
                  className="inline-block text-center text-sm font-semibold text-cream/80 underline decoration-gold/40 underline-offset-4 hover:text-cream"
                >
                  Conhecer a consultoria
                </Link>
              </div>
              <p className="text-xs uppercase tracking-wide text-cream/40">
                Consultoria independente · Sem custo para você · Atendimento SP e todo o Brasil
              </p>
            </div>

            <div className="relative min-h-[20rem] sm:min-h-0">
              <Image
                src="/team/luciana-e-jhonatan.jpg"
                alt="Luciana Pandolfi e Jhonatan, sócios da L&J Consultoria"
                fill
                sizes="(min-width: 640px) 45vw, 100vw"
                className="object-cover object-top"
                priority
              />
              <div
                aria-hidden
                className="absolute inset-0 bg-gradient-to-t from-navy-deep/80 via-navy-deep/10 to-transparent sm:bg-gradient-to-r sm:from-navy-deep/50 sm:via-transparent sm:to-transparent"
              />
              <div className="absolute bottom-5 left-5 flex items-center gap-2.5 rounded-full bg-navy-deep/80 py-2 pl-2 pr-4 backdrop-blur-sm">
                <span
                  aria-hidden
                  className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-gold bg-navy font-serif-display text-xs text-gold-light"
                >
                  L&J
                </span>
                <span className="text-xs font-medium text-cream">
                  Luciana Pandolfi &amp; Jhonatan
                </span>
              </div>
            </div>
          </div>
        </section>

        {/* Faixa de confiança — só o que é verificável. */}
        <CredibilityBar />

        {/* O problema */}
        <section className="px-4 py-16 sm:px-6">
          <div className="mx-auto grid max-w-4xl gap-8 sm:grid-cols-[auto_1fr]">
            <div className="hidden sm:block">
              <div className="h-full w-px bg-gold/40" />
            </div>
            <div>
              <p className="eyebrow">O que costuma passar despercebido</p>
              <h2 className="mt-2 font-serif-display text-2xl font-semibold text-navy sm:text-3xl">
                A mensalidade é só uma parte da conta.
              </h2>
              <p className="mt-4 max-w-2xl text-base leading-relaxed text-navy/65">
                Rede credenciada, tipo de acomodação, prazos de carência, regras de
                coparticipação, abrangência geográfica e a política de reajuste — cada um desses
                pontos muda o valor real do contrato, e costuma aparecer só na hora de usar o
                plano.
              </p>
              <p className="mt-3 max-w-2xl text-base leading-relaxed text-navy/65">
                O mesmo vale para empresas: CNPJ e MEI têm tabelas próprias, diferentes da pessoa
                física, e contratos empresariais fechados há anos raramente são revisados.
              </p>
            </div>
          </div>
        </section>

        {/* Método — progressão numerada, não cards idênticos */}
        <section className="bg-white px-4 py-16 sm:px-6">
          <div className="mx-auto max-w-3xl">
            <p className="eyebrow text-center">Como conduzimos a análise</p>
            <h2 className="mt-2 text-center font-serif-display text-2xl font-semibold text-navy sm:text-3xl">
              Quatro etapas, do jeito que deveria ser
            </h2>
            <ol className="mt-12 flex flex-col">
              {[
                {
                  n: "01",
                  t: "Compreensão do cenário",
                  d: "Você conta a situação atual — quantas pessoas, quais hospitais importam, o que paga hoje. Sem formulário longo, sem burocracia.",
                },
                {
                  n: "02",
                  t: "Comparação das alternativas",
                  d: "Analisamos as opções das principais operadoras compatíveis com o seu perfil — rede, acomodação, carência e reajuste.",
                },
                {
                  n: "03",
                  t: "Diferenças explicadas com clareza",
                  d: "Você recebe um comparativo direto do que cada opção entrega e do que não entrega, sem letra miúda.",
                },
                {
                  n: "04",
                  t: "Apoio na contratação",
                  d: "Se fizer sentido seguir, conduzimos a contratação ou a migração. Se não fizer, a análise já é sua — sem obrigação.",
                },
              ].map((step, i, arr) => (
                <li key={step.n} className="relative flex gap-6 pb-10 last:pb-0">
                  {i < arr.length - 1 && (
                    <span
                      aria-hidden
                      className="absolute left-[1.35rem] top-10 h-[calc(100%-1.5rem)] w-px bg-navy/10"
                    />
                  )}
                  <span className="font-serif-display text-2xl font-semibold text-gold-dark/70">
                    {step.n}
                  </span>
                  <div className="pt-1">
                    <p className="font-semibold text-navy">{step.t}</p>
                    <p className="mt-1 max-w-md text-sm leading-relaxed text-navy/60">{step.d}</p>
                  </div>
                </li>
              ))}
            </ol>
          </div>
        </section>

        {/* Caminhos — 2 jornadas reais, com hierarquia distinta (60+ dentro da familiar) */}
        <section className="px-4 py-16 sm:px-6">
          <div className="mx-auto max-w-5xl">
            <p className="eyebrow text-center">Para quem é</p>
            <h2 className="mt-2 text-center font-serif-display text-2xl font-semibold text-navy sm:text-3xl">
              Duas jornadas, dois pontos de partida
            </h2>
            <div className="mt-10 grid gap-6 sm:grid-cols-5">
              <Link
                href="/plano-familiar"
                className="group relative flex flex-col justify-end overflow-hidden rounded-2xl bg-navy p-7 text-cream shadow-sm transition-shadow hover:shadow-xl sm:col-span-3 sm:min-h-[16rem]"
              >
                <span className="eyebrow eyebrow-on-dark">Pessoa física</span>
                <p className="mt-2 font-serif-display text-xl font-semibold sm:text-2xl">
                  Família, individual e 60+
                </p>
                <p className="mt-2 max-w-sm text-sm leading-relaxed text-cream/70">
                  Primeiro plano, troca de operadora ou revisão do que os pais já têm — a análise
                  se ajusta ao seu momento.
                </p>
                <span className="mt-4 inline-block text-sm font-semibold text-gold-light group-hover:underline">
                  Ver a jornada familiar →
                </span>
              </Link>
              <Link
                href="/plano-empresarial"
                className="group flex flex-col justify-end rounded-2xl border border-navy/10 bg-white p-7 shadow-sm transition-shadow hover:shadow-xl sm:col-span-2 sm:min-h-[16rem]"
              >
                <span className="eyebrow">Pessoa jurídica</span>
                <p className="mt-2 font-serif-display text-xl font-semibold text-navy">
                  Empresa, CNPJ ou MEI
                </p>
                <p className="mt-2 text-sm leading-relaxed text-navy/60">
                  Tabela própria, diferente da pessoa física — para sócios, equipe ou dependentes.
                </p>
                <span className="mt-4 inline-block text-sm font-semibold text-gold-dark group-hover:underline">
                  Ver a jornada empresarial →
                </span>
              </Link>
            </div>
          </div>
        </section>

        {/*
          Prova social (depoimentos reais) fica fora do ar por enquanto — a cliente foi
          acionada, mas nada de "em breve"/placeholder público (decisão de direção premium,
          26/08/2026). O componente SocialProofPending.tsx segue pronto em
          src/components/ — reativar aqui, no mesmo lugar, assim que houver depoimento real.
        */}

        {/* Isca de captura */}
        <section id="guia" className="bg-navy px-4 py-16 text-cream sm:px-6">
          <div className="mx-auto grid max-w-4xl gap-10 sm:grid-cols-2 sm:items-center">
            <div>
              <p className="eyebrow eyebrow-on-dark">Material gratuito</p>
              <h2 className="mt-2 font-serif-display text-2xl font-semibold sm:text-3xl">
                Hospitais de referência de São Paulo e quais planos dão acesso a cada um
              </h2>
              <p className="mt-4 text-sm leading-relaxed text-cream/70">
                Se existe um hospital em que você quer ser atendido, é por ele que a escolha do
                plano deveria começar — não pelo preço. Preencha ao lado e nossa equipe te envia
                o guia completo pelo WhatsApp.
              </p>
            </div>
            <div className="rounded-2xl bg-cream p-6">
              <LeadFormIsca sourcePage="home" />
            </div>
          </div>
        </section>

        {/* FAQ — duas colunas no desktop */}
        <section className="px-4 py-16 sm:px-6">
          <div className="mx-auto grid max-w-4xl gap-10 sm:grid-cols-[1fr_1.4fr] sm:items-start">
            <div>
              <p className="eyebrow">Dúvidas comuns</p>
              <h2 className="mt-2 font-serif-display text-2xl font-semibold text-navy sm:text-3xl">
                Perguntas frequentes
              </h2>
              <p className="mt-3 text-sm leading-relaxed text-navy/55">
                As respostas mais diretas para o que costuma travar a decisão. Se ficar alguma
                dúvida, é só chamar no WhatsApp.
              </p>
            </div>
            <FAQAccordion />
          </div>
        </section>

        {/* Quem somos — teaser textual, sem repetir a foto do hero */}
        <section className="bg-white px-4 py-14 sm:px-6">
          <div className="mx-auto flex max-w-2xl flex-col items-center gap-3 text-center">
            <p className="eyebrow">Quem conduz a sua análise</p>
            <h2 className="font-serif-display text-xl font-semibold text-navy sm:text-2xl">
              Luciana Pandolfi &amp; Jhonatan, sócios da L&amp;J Consultoria
            </h2>
            <p className="max-w-md text-sm leading-relaxed text-navy/60">
              Acesso direto às principais operadoras e à rede de hospitais de referência de São
              Paulo — o diferencial que guia cada recomendação antes de chegar até você.
            </p>
            <Link
              href="/quem-somos"
              className="mt-1 text-sm font-semibold text-gold-dark hover:underline"
            >
              Conheça a L&amp;J →
            </Link>
          </div>
        </section>

        {/* Fechamento */}
        <section id="simulacao" className="bg-cream-dark/60 px-4 py-16 sm:px-6">
          <div className="mx-auto grid max-w-4xl gap-10 sm:grid-cols-2 sm:items-center">
            <div className="text-center sm:text-left">
              <p className="eyebrow">Último passo</p>
              <h2 className="mt-2 font-serif-display text-2xl font-semibold text-navy sm:text-3xl">
                Vamos entender o que faz sentido para o seu caso?
              </h2>
              <p className="mt-4 text-sm leading-relaxed text-navy/60">
                Preencha ao lado e retornamos com a análise comparativa. Sem custo, sem
                compromisso — a análise não obriga você a contratar nada, e seus dados seguem a{" "}
                <Link href="/politica-de-privacidade" className="underline decoration-gold/50">
                  nossa política de privacidade
                </Link>
                .
              </p>
            </div>
            <div className="rounded-2xl border border-navy/10 bg-white p-6 shadow-sm">
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
