import type { Metadata } from "next";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import WhatsAppButton from "@/components/WhatsAppButton";
import LeadFormIsca from "@/components/LeadFormIsca";
import LeadFormQualificacao from "@/components/LeadFormQualificacao";
import { SITE_URL, WHATSAPP_MESSAGES } from "@/lib/site-config";

const PAGE_URL = `${SITE_URL}/plano-empresarial`;
const OG_IMAGE = "/creatives/alice-video-poster.jpg";

export const metadata: Metadata = {
  title: "Alice Empresarial: condições para CNPJ e MEI",
  description:
    "Tem CNPJ ou MEI? Consultoria gratuita e independente — comparamos a Alice Empresarial com outras opções compatíveis com a sua empresa.",
  alternates: { canonical: PAGE_URL },
  openGraph: {
    url: PAGE_URL,
    title: "Alice Empresarial: condições para CNPJ e MEI | L&J Consultoria",
    description:
      "Consultoria gratuita e independente em planos de saúde empresariais. Comparamos a Alice com outras operadoras antes de qualquer recomendação.",
    images: [{ url: OG_IMAGE, width: 1080, height: 1920 }],
  },
  twitter: {
    card: "summary_large_image",
    images: [OG_IMAGE],
  },
};

const CAMPAIGN = "alice-empresarial";

const FAQ_ITEMS = [
  {
    q: "Vocês são representantes da Alice?",
    a: "Não. Somos uma consultoria independente — comparamos a Alice Empresarial com outras operadoras antes de qualquer recomendação para a sua empresa.",
  },
  {
    q: "Qualquer CNPJ ou MEI pode contratar?",
    a: "A elegibilidade e as condições dependem de regras vigentes da operadora — número de vidas, atividade e outros fatores são confirmados durante a análise.",
  },
  {
    q: "O valor é o mesmo para qualquer número de vidas?",
    a: "Não. Número de vidas, faixas etárias, região e tipo de acomodação mudam a condição final. Por isso a análise é individual, sem promessa de valor fechado aqui na página.",
  },
];

export default function PlanoEmpresarialPage() {
  return (
    <>
      <Header ctaHref="#analise" />
      <main className="flex-1">
        {/* Hero — vídeo real da Luciana integrado à primeira dobra */}
        <section className="relative overflow-hidden bg-gradient-to-b from-navy-deep via-navy to-navy-light px-4 py-16 text-cream sm:px-6 sm:py-20">
          <div
            aria-hidden
            className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-gold/60 to-transparent"
          />
          <div className="relative mx-auto grid max-w-5xl gap-10 sm:grid-cols-[1.15fr_0.85fr] sm:items-center">
            <div className="text-center sm:text-left">
              <p className="eyebrow eyebrow-on-dark">Campanha Alice Empresarial</p>
              <h1 className="mt-4 font-serif-display text-3xl font-semibold leading-tight sm:text-4xl lg:text-5xl">
                Tem CNPJ ou MEI? Entenda quais condições empresariais podem estar disponíveis
                para o seu perfil.
              </h1>
              <p className="mx-auto mt-5 max-w-xl text-base text-cream/80 sm:mx-0 sm:text-lg">
                Consultoria gratuita e independente — comparamos a Alice Empresarial com outras
                opções do mercado antes de você decidir.
              </p>
              <a
                href="#analise"
                className="mt-8 inline-block rounded-full bg-gold px-8 py-4 text-base font-semibold text-navy transition-colors hover:bg-gold-light"
              >
                Quero minha análise empresarial
              </a>
              <p className="mt-4 text-sm text-cream/50">
                Resposta em até 2 horas úteis · Atendimento em São Paulo e em todo o Brasil · Sem
                custo e sem compromisso
              </p>
            </div>

            <div className="mx-auto w-full max-w-xs">
              <video
                controls
                preload="metadata"
                poster="/creatives/alice-video-poster.jpg"
                playsInline
                className="w-full rounded-2xl border border-gold/30 shadow-2xl"
              >
                <source src="/creatives/alice-video.mp4" type="video/mp4" />
              </video>
              <p className="mt-3 text-center text-xs text-cream/50">
                Luciana explica a condição empresarial no vídeo do anúncio.
              </p>
            </div>
          </div>
        </section>

        {/* Aviso de responsabilidade — visível, não escondido no rodapé */}
        <div className="border-b border-navy/10 bg-cream-dark/40 px-4 py-3 text-center text-xs text-navy/55 sm:px-6">
          Valores e condições variam conforme número de vidas, faixas etárias, região e produto.
          A elegibilidade é confirmada individualmente durante a análise.
        </div>

        {/* Comparação PF x CNPJ */}
        <section className="bg-white px-4 py-16 sm:px-6">
          <div className="mx-auto max-w-3xl">
            <p className="eyebrow text-center">Por que isso importa</p>
            <h2 className="mt-2 text-center font-serif-display text-2xl font-semibold text-navy sm:text-3xl">
              CNPJ e pessoa física seguem tabelas diferentes
            </h2>
            <div className="mt-10 grid gap-6 sm:grid-cols-2">
              <div className="rounded-2xl border border-navy/10 bg-cream-dark/30 p-6 shadow-sm">
                <p className="font-semibold text-navy">Plano pessoa física</p>
                <p className="mt-2 text-sm leading-relaxed text-navy/60">
                  Tabela individual, sem as condições de negociação em grupo. É o que a maioria
                  dos donos de CNPJ e MEI ainda paga — muitas vezes sem saber que existe outra
                  opção.
                </p>
              </div>
              <div className="rounded-2xl border-2 border-gold bg-white p-6 shadow-sm">
                <p className="font-semibold text-navy">Plano empresarial (CNPJ)</p>
                <p className="mt-2 text-sm leading-relaxed text-navy/60">
                  Tabela negociada para pessoa jurídica — inclusive para empresas pequenas. A
                  condição exata depende do número de vidas e do perfil do grupo.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Fatores que influenciam a condição */}
        <section className="px-4 py-14 sm:px-6">
          <div className="mx-auto max-w-3xl">
            <p className="eyebrow text-center">O que muda a condição</p>
            <h2 className="mt-2 text-center font-serif-display text-2xl font-semibold text-navy sm:text-3xl">
              O que analisamos antes de recomendar
            </h2>
            <div className="mt-8 grid gap-4 sm:grid-cols-2">
              {[
                "Número de vidas a incluir",
                "Faixas etárias do grupo",
                "Região de atendimento",
                "Tipo de acomodação desejada",
                "Coparticipação ou não",
                "Rede hospitalar prioritária",
              ].map((item) => (
                <div
                  key={item}
                  className="flex items-center gap-3 rounded-xl border border-navy/10 bg-white px-4 py-3 text-sm text-navy/70 shadow-sm"
                >
                  <span aria-hidden className="h-1.5 w-1.5 shrink-0 rounded-full bg-gold" />
                  {item}
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Isca de captura */}
        <section id="guia" className="bg-navy px-4 py-16 text-cream sm:px-6">
          <div className="mx-auto grid max-w-4xl gap-10 sm:grid-cols-2 sm:items-center">
            <div>
              <p className="eyebrow eyebrow-on-dark">Material gratuito</p>
              <h2 className="mt-2 font-serif-display text-2xl font-semibold sm:text-3xl">
                Hospitais de referência de São Paulo e quais planos dão acesso a cada um
              </h2>
              <p className="mt-4 text-sm leading-relaxed text-cream/70">
                Antes de decidir, veja quais planos dão acesso aos hospitais que sua equipe
                valoriza. Preencha ao lado e nossa equipe te envia o guia completo pelo WhatsApp.
              </p>
            </div>
            <div className="rounded-2xl bg-cream p-6">
              <LeadFormIsca sourcePage="plano-empresarial" campaign={CAMPAIGN} />
            </div>
          </div>
        </section>

        {/* FAQ específico da campanha */}
        <section className="px-4 py-16 sm:px-6">
          <div className="mx-auto max-w-2xl">
            <p className="eyebrow text-center">Antes de continuar</p>
            <h2 className="mt-2 text-center font-serif-display text-2xl font-semibold text-navy sm:text-3xl">
              Perguntas sobre esta análise
            </h2>
            <div className="mt-8 flex flex-col divide-y divide-navy/10 rounded-2xl border border-navy/10 bg-white shadow-sm">
              {FAQ_ITEMS.map((item) => (
                <details key={item.q} className="group p-5 open:bg-cream/60">
                  <summary className="flex cursor-pointer list-none items-center justify-between gap-4 font-medium text-navy">
                    {item.q}
                    <span className="shrink-0 text-gold-dark transition-transform group-open:rotate-45">
                      +
                    </span>
                  </summary>
                  <p className="mt-3 text-sm leading-relaxed text-navy/60">{item.a}</p>
                </details>
              ))}
            </div>
          </div>
        </section>

        {/* Fechamento */}
        <section id="analise" className="bg-cream-dark/50 px-4 py-16 sm:px-6">
          <div className="mx-auto max-w-xl">
            <p className="eyebrow text-center">Último passo</p>
            <h2 className="mt-2 text-center font-serif-display text-2xl font-semibold text-navy sm:text-3xl">
              Vamos analisar a condição empresarial para sua equipe?
            </h2>
            <p className="mt-4 text-center text-sm leading-relaxed text-navy/60">
              Preencha os dados abaixo e retornamos com a análise comparativa, incluindo a Alice
              Empresarial e outras opções do mercado. Sem custo, sem compromisso.
            </p>
            <div className="mt-8 rounded-2xl border border-navy/10 bg-white p-6 shadow-sm">
              <LeadFormQualificacao
                sourcePage="plano-empresarial"
                campaign={CAMPAIGN}
                showNumeroVidas
                paraQuemOrder={["Minha empresa (CNPJ)", "Para mim", "Minha família", "Meus pais"]}
                ctaLabel="Solicitar minha análise empresarial"
              />
            </div>
          </div>
        </section>
      </main>
      <Footer />
      <WhatsAppButton message={WHATSAPP_MESSAGES.empresarial} />
    </>
  );
}
