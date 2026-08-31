import Link from "next/link";
import Image from "next/image";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import WhatsAppButton from "@/components/WhatsAppButton";
import CredibilityBar from "@/components/CredibilityBar";
import OperatorsList from "@/components/OperatorsList";
import HospitalNetwork from "@/components/HospitalNetwork";
import SocialProof from "@/components/SocialProof";
import FAQAccordion from "@/components/FAQAccordion";
import LeadFormIsca from "@/components/LeadFormIsca";
import LeadFormQualificacao from "@/components/LeadFormQualificacao";
import PromotionsSection from "@/components/PromotionsSection";
import type { Metadata } from "next";
import { SITE_URL, WHATSAPP_MESSAGES } from "@/lib/site-config";
import { listActivePromotionsRaw } from "@/lib/db";
import { isPubliclyVisible } from "@/lib/promotions";

export const metadata: Metadata = {
  alternates: { canonical: SITE_URL },
};

export default async function HomePage({ searchParams }: PageProps<"/">) {
  const params = await searchParams;
  const promotionSlug = typeof params.promo === "string" ? params.promo : undefined;

  const now = new Date();
  // Defensivo: se a tabela `promotions` ainda não existir (migration não aplicada) ou o
  // D1 falhar por qualquer motivo, a Home não pode cair — a seção de promoções só some.
  // O erro fica só no log do servidor, nunca é exposto ao visitante.
  let publicPromotions: {
    slug: string;
    operator_name: string;
    title: string;
    short_description: string;
    benefit_value: string | null;
    eligible_products: string | null;
    eligible_audience: string | null;
    eligible_locations: string | null;
    starts_at: string;
    ends_at: string | null;
    is_featured: boolean;
    public_cta_label: string;
    public_cta_target: string;
  }[] = [];
  try {
    const allActive = await listActivePromotionsRaw();
    publicPromotions = allActive
      .filter((p) => isPubliclyVisible({ status: p.status, starts_at: p.starts_at, ends_at: p.ends_at }, now))
      .sort((a, b) => a.display_order - b.display_order)
      .map((p) => ({
        slug: p.slug,
        operator_name: p.operator_name,
        title: p.title,
        short_description: p.short_description,
        benefit_value: p.benefit_value,
        eligible_products: p.eligible_products,
        eligible_audience: p.eligible_audience,
        eligible_locations: p.eligible_locations,
        starts_at: p.starts_at,
        ends_at: p.ends_at,
        is_featured: Boolean(p.is_featured),
        public_cta_label: p.public_cta_label ?? "Quero saber se me qualifico",
        public_cta_target: p.public_cta_target ?? "#simulacao",
      }));
  } catch (err) {
    console.error("Falha ao buscar promoções para a Home — seção fica oculta.", err);
  }

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
          <div className="mx-auto grid max-w-6xl sm:grid-cols-[0.9fr_1.15fr] sm:items-stretch">
            <div className="flex flex-col justify-center gap-5 px-4 py-14 sm:px-8 sm:py-24 lg:px-12">
              <p className="eyebrow eyebrow-on-dark">L&amp;J Consultoria · São Paulo</p>
              <h1 className="headline-editorial text-3xl text-cream sm:text-4xl lg:text-[2.65rem]">
                Seu plano de saúde precisa fazer sentido{" "}
                <span className="italic text-gold-light">antes</span> de você precisar usá-lo.
              </h1>
              <p className="max-w-md text-base leading-relaxed text-cream/75">
                Comparamos o mercado, verificamos a rede credenciada e explicamos o que cada
                contrato entrega — para você e sua empresa decidirem com informação, não com
                achismo.
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
                Consultoria independente · Sem custo para você · Atendimento por telefone e WhatsApp
              </p>
            </div>

            <div className="relative flex min-h-[22rem] flex-col sm:min-h-0">
              <div className="relative flex-1">
                <Image
                  src="/team/luciana-e-jhonatan.jpg"
                  alt="Luciana Pandolfi e Jhonatan, sócios da L&J Consultoria"
                  fill
                  sizes="(min-width: 640px) 55vw, 100vw"
                  className="object-cover object-top"
                  priority
                />
                <div
                  aria-hidden
                  className="absolute inset-0 bg-gradient-to-t from-navy-deep/55 via-transparent to-transparent"
                />
              </div>
              {/* Legenda editorial — não é um selo flutuante, é a assinatura da foto */}
              <div className="relative flex items-center gap-3 border-t border-gold/50 bg-navy-deep px-5 py-3.5 sm:px-8">
                <span
                  aria-hidden
                  className="font-serif-display text-sm italic text-gold-light"
                >
                  L&amp;J
                </span>
                <span className="h-3 w-px bg-gold/40" aria-hidden />
                <span className="text-xs font-medium uppercase tracking-wide text-cream/80">
                  Luciana Pandolfi &amp; Jhonatan — sócios da consultoria
                </span>
              </div>
            </div>
          </div>
        </section>

        {/* Faixa de confiança — só o que é verificável. */}
        <CredibilityBar />
        <OperatorsList />

        {/* O problema */}
        <section className="px-4 py-16 sm:px-6">
          <div className="mx-auto grid max-w-4xl gap-8 sm:grid-cols-[auto_1fr]">
            <div className="hidden sm:block">
              <div className="h-full w-px bg-gold/40" />
            </div>
            <div>
              <p className="eyebrow">O que costuma passar despercebido</p>
              <h2 className="mt-2 headline-editorial text-2xl text-navy sm:text-3xl">
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
            <h2 className="mt-2 text-center headline-editorial text-2xl text-navy sm:text-3xl">
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
                <li key={step.n} className="relative flex gap-7 pb-12 last:pb-0">
                  {i < arr.length - 1 && (
                    <span
                      aria-hidden
                      className="absolute left-[1.15rem] top-12 h-[calc(100%-2rem)] w-px bg-gold/25"
                    />
                  )}
                  <span className="numeral w-9 shrink-0 text-4xl sm:text-5xl">{step.n}</span>
                  <div className="pt-2">
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
            <h2 className="mt-2 text-center headline-editorial text-2xl text-navy sm:text-3xl">
              Duas jornadas, dois pontos de partida
            </h2>
            <div className="mt-10 grid gap-6 sm:grid-cols-5">
              <Link
                href="/plano-familiar"
                className="group relative flex flex-col justify-end overflow-hidden bg-navy p-7 text-cream shadow-sm transition-shadow hover:shadow-xl sm:col-span-3 sm:min-h-[17rem]"
              >
                <span aria-hidden className="absolute inset-x-0 top-0 h-1 bg-medsenior" />
                <span className="eyebrow eyebrow-on-dark">Pessoa física</span>
                <p className="headline-editorial mt-2 text-xl text-cream sm:text-2xl">
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
                className="group relative flex flex-col justify-end border border-navy/10 bg-white p-7 shadow-sm transition-shadow hover:shadow-xl sm:col-span-2 sm:min-h-[17rem]"
              >
                <span aria-hidden className="absolute inset-x-0 top-0 h-1 bg-alice" />
                <span className="eyebrow">Pessoa jurídica</span>
                <p className="headline-editorial mt-2 text-xl text-navy">
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

        <SocialProof />

        <HospitalNetwork />

        <PromotionsSection promotions={publicPromotions} />

        {/* Isca de captura */}
        <section id="guia" className="bg-navy px-4 py-16 text-cream sm:px-6">
          <div className="mx-auto grid max-w-4xl gap-10 sm:grid-cols-2 sm:items-center">
            <div>
              <p className="eyebrow eyebrow-on-dark">Material gratuito</p>
              <h2 className="mt-2 headline-editorial text-2xl text-cream sm:text-3xl">
                Como avaliar hospitais e rede credenciada antes de escolher seu plano
              </h2>
              <p className="mt-4 text-sm leading-relaxed text-cream/70">
                Preencha ao lado e nossa equipe te envia, pelo WhatsApp, um guia com o passo a
                passo para conferir rede credenciada, carência e condições antes de assinar
                qualquer contrato.
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
              <h2 className="mt-2 headline-editorial text-2xl text-navy sm:text-3xl">
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
        <section className="bg-white px-4 py-16 sm:px-6">
          <div className="mx-auto flex max-w-xl flex-col items-center gap-4 text-center">
            <span
              aria-hidden
              className="font-serif-display text-3xl italic text-gold/70"
            >
              L&amp;J
            </span>
            <blockquote className="headline-editorial text-xl text-navy sm:text-2xl">
              Quem atende é quem assina o nome — Luciana Pandolfi &amp; Jhonatan.
            </blockquote>
            <div className="gold-rule-center" />
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
              <h2 className="mt-2 headline-editorial text-2xl text-navy sm:text-3xl">
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
              <LeadFormQualificacao
                sourcePage="home"
                ctaLabel="Solicitar minha análise gratuita"
                promotionSlug={promotionSlug}
              />
            </div>
          </div>
        </section>
      </main>
      <Footer showHomeLink={false} />
      <WhatsAppButton message={WHATSAPP_MESSAGES.home} />
    </>
  );
}
