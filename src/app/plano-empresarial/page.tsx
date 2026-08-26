import type { Metadata } from "next";
import CampaignHeader from "@/components/CampaignHeader";
import Footer from "@/components/Footer";
import WhatsAppButton from "@/components/WhatsAppButton";
import LeadFormIsca from "@/components/LeadFormIsca";
import LeadFormQualificacao from "@/components/LeadFormQualificacao";
import { SITE_URL, WHATSAPP_MESSAGES, whatsappLink } from "@/lib/site-config";

const PAGE_URL = `${SITE_URL}/plano-empresarial`;
const OG_IMAGE = "/og/alice.jpg";

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
    images: [{ url: OG_IMAGE, width: 1200, height: 630 }],
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
    a: "Não necessariamente. A elegibilidade depende de regras vigentes da operadora — número de vidas, atividade e outros fatores são confirmados durante a análise.",
  },
  {
    q: "O valor é o mesmo para qualquer número de vidas?",
    a: "Não. Número de vidas, faixas etárias, região e tipo de acomodação mudam a condição final. Por isso a análise é individual, sem promessa de valor fechado aqui na página.",
  },
];

export default function PlanoEmpresarialPage() {
  return (
    <>
      <CampaignHeader
        ctaHref="#analise"
        ctaLabel="Análise empresarial"
        campaignLabel="Campanha Alice Empresarial"
        accentClass="text-alice"
      />
      <main className="flex-1">
        {/* Hero — vídeo real da Luciana como parte da composição, não um anexo ao lado */}
        <section className="relative overflow-hidden bg-navy-deep text-cream">
          <div
            aria-hidden
            className="pointer-events-none absolute inset-0 bg-gradient-to-br from-alice-deep/40 via-transparent to-transparent"
          />
          <div className="relative mx-auto grid max-w-5xl gap-0 sm:grid-cols-[1fr_0.85fr] sm:items-stretch">
            <div className="flex flex-col justify-center gap-5 px-4 py-14 sm:px-8 sm:py-20">
              <p className="text-xs font-semibold uppercase tracking-widest text-alice-tint/90">
                Análise empresarial · L&amp;J Consultoria
              </p>
              <h1 className="headline-editorial text-3xl text-cream sm:text-4xl lg:text-[2.65rem]">
                Tem CNPJ ou MEI? Entenda quais condições{" "}
                <span className="italic text-gold-light">empresariais</span> podem estar
                disponíveis para o seu perfil.
              </h1>
              <p className="max-w-md text-base leading-relaxed text-cream/70">
                Consultoria gratuita e independente — comparamos a Alice Empresarial com outras
                opções do mercado antes de você decidir.
              </p>
              <a
                href="#analise"
                className="mt-1 inline-block w-fit rounded-full bg-alice px-7 py-3.5 text-base font-semibold text-white transition-colors hover:bg-alice-deep"
              >
                Quero minha análise empresarial
              </a>
              <p className="text-xs text-cream/45">
                Resposta em até 2 horas úteis · Atendimento em São Paulo e em todo o Brasil · Sem
                custo e sem compromisso
              </p>
            </div>

            <div className="relative flex items-center justify-center bg-navy px-6 py-10 sm:py-0">
              <div className="w-full max-w-[15rem]">
                <video
                  controls
                  preload="metadata"
                  poster="/creatives/alice-video-poster.jpg"
                  playsInline
                  className="w-full rounded-sm shadow-2xl ring-1 ring-alice/30"
                >
                  <source src="/creatives/alice-video.mp4" type="video/mp4" />
                </video>
                <p className="mt-3 text-center text-xs text-cream/45">
                  Luciana explica a condição empresarial no vídeo do anúncio.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Conversão principal — logo após o hero */}
        <section id="analise" className="bg-white px-4 py-14 sm:px-6">
          <div className="mx-auto grid max-w-4xl gap-10 sm:grid-cols-[1fr_1.1fr] sm:items-start">
            <div>
              <p className="text-xs font-semibold uppercase tracking-widest text-alice">
                Análise gratuita
              </p>
              <h2 className="headline-editorial mt-2 text-2xl text-navy sm:text-3xl">
                Vamos analisar a condição empresarial para sua equipe?
              </h2>
              <p className="mt-4 text-sm leading-relaxed text-navy/60">
                Preencha ao lado e retornamos com a análise comparativa, incluindo a Alice
                Empresarial e outras opções do mercado. Sem custo, sem compromisso.
              </p>
              <div className="hairline mt-6 text-navy" />
              <p className="mt-6 text-xs leading-relaxed text-navy/45">
                Valores e condições variam conforme número de vidas, faixas etárias, região e
                produto. A elegibilidade é confirmada individualmente durante a análise.
              </p>
            </div>
            <div className="rounded-sm border border-navy/10 bg-cream/40 p-6 shadow-sm">
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

        {/* Como a elegibilidade é analisada */}
        <section className="bg-alice-tint/50 px-4 py-14 sm:px-6">
          <div className="mx-auto max-w-3xl">
            <p className="text-xs font-semibold uppercase tracking-widest text-alice">
              Por que isso importa
            </p>
            <h2 className="headline-editorial mt-2 max-w-lg text-2xl text-navy sm:text-3xl">
              Um CNPJ pode permitir acesso a modalidades empresariais com regras próprias
            </h2>
            <div className="mt-10 grid gap-6 sm:grid-cols-2">
              <div className="rounded-sm border border-navy/10 bg-white p-6 shadow-sm">
                <p className="font-semibold text-navy">Plano pessoa física</p>
                <p className="mt-2 text-sm leading-relaxed text-navy/60">
                  Tabela individual, sem as condições de negociação em grupo — é a modalidade mais
                  comum entre quem ainda não avaliou a opção empresarial.
                </p>
              </div>
              <div className="rounded-sm border-2 border-alice bg-white p-6 shadow-sm">
                <p className="font-semibold text-navy">Plano empresarial (CNPJ)</p>
                <p className="mt-2 text-sm leading-relaxed text-navy/60">
                  Tabela negociada para pessoa jurídica, sujeita a regras próprias. A elegibilidade
                  e a condição exata dependem do número de vidas e do perfil do grupo.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Fatores que influenciam a condição */}
        <section className="bg-white px-4 py-14 sm:px-6">
          <div className="mx-auto max-w-3xl">
            <p className="text-xs font-semibold uppercase tracking-widest text-alice text-center">
              O que muda a condição
            </p>
            <h2 className="headline-editorial mt-2 text-center text-2xl text-navy sm:text-3xl">
              O que analisamos antes de recomendar
            </h2>
            <div className="mt-8 grid gap-px overflow-hidden rounded-sm border border-navy/10 bg-navy/10 sm:grid-cols-3">
              {[
                "Número de vidas a incluir",
                "Faixas etárias do grupo",
                "Região de atendimento",
                "Tipo de acomodação desejada",
                "Coparticipação ou não",
                "Rede hospitalar prioritária",
              ].map((item) => (
                <div key={item} className="flex items-center gap-3 bg-white px-4 py-4 text-sm text-navy/70">
                  <span aria-hidden className="h-1.5 w-1.5 shrink-0 rounded-full bg-alice" />
                  {item}
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* FAQ específico da campanha */}
        <section className="bg-alice-tint/30 px-4 py-16 sm:px-6">
          <div className="mx-auto max-w-2xl">
            <p className="text-xs font-semibold uppercase tracking-widest text-alice text-center">
              Antes de continuar
            </p>
            <h2 className="headline-editorial mt-2 text-center text-2xl text-navy sm:text-3xl">
              Perguntas sobre esta análise
            </h2>
            <div className="mt-8 flex flex-col divide-y divide-navy/10 rounded-sm border border-navy/10 bg-white shadow-sm">
              {FAQ_ITEMS.map((item) => (
                <details key={item.q} className="group p-5 open:bg-cream/60">
                  <summary className="flex cursor-pointer list-none items-center justify-between gap-4 font-medium text-navy">
                    {item.q}
                    <span className="shrink-0 text-alice transition-transform group-open:rotate-45">
                      +
                    </span>
                  </summary>
                  <p className="mt-3 text-sm leading-relaxed text-navy/60">{item.a}</p>
                </details>
              ))}
            </div>
          </div>
        </section>

        {/* Guia gratuito — secundário */}
        <section id="guia" className="bg-navy px-4 py-14 text-cream sm:px-6">
          <div className="mx-auto flex max-w-2xl flex-col items-center gap-4 text-center">
            <p className="eyebrow eyebrow-on-dark">Enquanto isso, um material gratuito</p>
            <h2 className="headline-editorial text-xl text-cream sm:text-2xl">
              Hospitais de referência de São Paulo e quais planos dão acesso a cada um
            </h2>
            <p className="max-w-md text-sm leading-relaxed text-cream/65">
              Útil pra sua equipe avaliar a rede antes de decidir. Preencha abaixo e nossa equipe
              te envia o guia completo pelo WhatsApp.
            </p>
            <div className="mt-2 w-full max-w-sm rounded-sm bg-cream p-6 text-left">
              <LeadFormIsca sourcePage="plano-empresarial" campaign={CAMPAIGN} />
            </div>
          </div>
        </section>

        {/* CTA final */}
        <section className="bg-white px-4 py-14 text-center sm:px-6">
          <p className="headline-editorial text-xl text-navy sm:text-2xl">
            Pronto para entender a condição empresarial da sua equipe?
          </p>
          <div className="mt-6 flex flex-col items-center justify-center gap-3 sm:flex-row">
            <a
              href="#analise"
              className="rounded-full bg-alice px-7 py-3.5 text-base font-semibold text-white transition-colors hover:bg-alice-deep"
            >
              Solicitar análise empresarial
            </a>
            <a
              href={whatsappLink(WHATSAPP_MESSAGES.empresarial)}
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm font-semibold text-navy/60 underline decoration-navy/20 hover:text-navy"
            >
              ou chame no WhatsApp
            </a>
          </div>
        </section>
      </main>
      <Footer />
      <WhatsAppButton message={WHATSAPP_MESSAGES.empresarial} />
    </>
  );
}
