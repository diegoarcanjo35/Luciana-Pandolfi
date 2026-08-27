import type { Metadata } from "next";
import Image from "next/image";
import CampaignHeader from "@/components/CampaignHeader";
import Footer from "@/components/Footer";
import WhatsAppButton from "@/components/WhatsAppButton";
import LeadFormIsca from "@/components/LeadFormIsca";
import LeadFormQualificacao from "@/components/LeadFormQualificacao";
import { SITE_URL, WHATSAPP_MESSAGES, whatsappLink } from "@/lib/site-config";

const PAGE_URL = `${SITE_URL}/plano-familiar`;
const OG_IMAGE = "/og/medsenior.jpg";

export const metadata: Metadata = {
  title: "MedSênior: entenda se faz sentido para o seu perfil",
  description:
    "Consultoria gratuita e independente. Comparamos a MedSênior com outras operadoras compatíveis com o seu perfil antes de qualquer recomendação.",
  alternates: { canonical: PAGE_URL },
  openGraph: {
    url: PAGE_URL,
    title: "MedSênior: entenda se faz sentido para o seu perfil | L&J Consultoria",
    description:
      "Consultoria gratuita e independente em planos de saúde. Comparamos a MedSênior com outras opções do mercado antes de qualquer recomendação.",
    images: [{ url: OG_IMAGE, width: 1200, height: 630 }],
  },
  twitter: {
    card: "summary_large_image",
    images: [OG_IMAGE],
  },
};

const CAMPAIGN = "medsenior-economia";

const FAQ_ITEMS = [
  {
    q: "Vocês são representantes da MedSênior?",
    a: "Não. Somos uma consultoria independente — comparamos a MedSênior com outras operadoras compatíveis com o seu perfil antes de qualquer recomendação.",
  },
  {
    q: "A MedSênior é a única opção analisada?",
    a: "Não. Ela entra na análise como uma das alternativas consideradas para o perfil, sempre conforme disponibilidade e condições vigentes — ao lado de outras operadoras compatíveis.",
  },
  {
    q: "Rede, carência e valores são os mesmos para todo mundo?",
    a: "Não. Variam conforme produto, idade, região e composição familiar. A disponibilidade exata é confirmada durante a análise, sem custo.",
  },
];

export default function PlanoFamiliarPage() {
  return (
    <>
      <CampaignHeader
        ctaHref="#analise"
        ctaLabel="Quero minha análise"
        campaignLabel="Campanha MedSênior"
        accentClass="text-medsenior"
      />
      <main className="flex-1">
        {/* Hero — identidade própria (verde MedSênior + base clara da L&J), foto visível em todo breakpoint */}
        <section className="bg-medsenior-tint">
          {/* Banner mobile — a fachada some no desktop porque o grid abaixo já mostra a foto maior */}
          <div className="relative aspect-[16/9] w-full sm:hidden">
            <Image
              src="/creatives/medsenior-fachada-sp.jpg"
              alt="Fachada da MedSênior em São Paulo"
              fill
              sizes="100vw"
              className="object-cover"
              priority
            />
            <div
              aria-hidden
              className="absolute inset-0 bg-gradient-to-t from-navy-deep/50 to-transparent"
            />
          </div>

          <div className="mx-auto grid max-w-5xl gap-10 px-4 py-12 sm:grid-cols-2 sm:items-center sm:px-6 sm:py-20">
            <div>
              <p className="text-xs font-semibold uppercase tracking-widest text-medsenior">
                Análise MedSênior · L&amp;J Consultoria
              </p>
              <h1 className="headline-editorial mt-3 text-3xl text-navy sm:text-4xl lg:text-5xl">
                Cuide da sua saúde e entenda se a{" "}
                <span className="italic text-medsenior">MedSênior</span> faz sentido para o seu
                perfil.
              </h1>
              <p className="mt-5 max-w-md text-base leading-relaxed text-navy/65">
                Consultoria gratuita e independente — comparamos a MedSênior com outras operadoras
                antes de qualquer recomendação, para você decidir com informação.
              </p>
              <a
                href="#analise"
                className="mt-7 inline-block rounded-full bg-medsenior px-7 py-3.5 text-base font-semibold text-white transition-colors hover:bg-medsenior-deep"
              >
                Quero minha análise gratuita
              </a>
              <p className="mt-4 text-xs text-navy/45">
                Resposta em até 1 hora útil · Consultoria em São Paulo e em todo o Brasil · Sem
                custo e sem compromisso
              </p>
            </div>
            <div className="relative hidden aspect-[3/2] overflow-hidden rounded-sm sm:block">
              <Image
                src="/creatives/medsenior-fachada-sp.jpg"
                alt="Fachada da MedSênior em São Paulo"
                fill
                sizes="(min-width: 640px) 40vw, 0px"
                className="object-cover"
              />
              <div aria-hidden className="absolute inset-x-0 bottom-0 h-1 bg-medsenior" />
            </div>
          </div>
        </section>

        {/* Conversão principal — logo após o hero, sem fricção de rolagem */}
        <section id="analise" className="bg-white px-4 py-14 sm:px-6">
          <div className="mx-auto grid max-w-4xl gap-10 sm:grid-cols-[1fr_1.1fr] sm:items-start">
            <div>
              <p className="text-xs font-semibold uppercase tracking-widest text-medsenior">
                Análise gratuita
              </p>
              <h2 className="headline-editorial mt-2 text-2xl text-navy sm:text-3xl">
                Vamos entender o que faz sentido para o seu caso?
              </h2>
              <p className="mt-4 text-sm leading-relaxed text-navy/60">
                Preencha ao lado e retornamos com a análise comparativa, incluindo a MedSênior e
                outras opções do mercado. Sem custo, sem compromisso.
              </p>
              <div className="hairline mt-6 text-navy" />
              <p className="mt-6 text-xs leading-relaxed text-navy/45">
                Rede credenciada, carência, valores e condições variam conforme produto, idade,
                região e composição familiar. A disponibilidade é confirmada durante a análise.
              </p>
            </div>
            <div className="rounded-sm border border-navy/10 bg-cream/40 p-6 shadow-sm">
              <LeadFormQualificacao
                sourcePage="plano-familiar"
                campaign={CAMPAIGN}
                paraQuemOrder={["Para mim", "Minha família", "Meus pais", "Minha empresa (CNPJ)"]}
                ctaLabel="Solicitar minha análise gratuita"
              />
            </div>
          </div>
        </section>

        {/* O que analisamos */}
        <section className="bg-medsenior-tint/60 px-4 py-14 sm:px-6">
          <div className="mx-auto max-w-4xl">
            <p className="text-xs font-semibold uppercase tracking-widest text-medsenior">
              O que entra na análise
            </p>
            <h2 className="headline-editorial mt-2 max-w-md text-2xl text-navy sm:text-3xl">
              Comparamos antes de indicar
            </h2>
            <div className="mt-8 grid gap-px overflow-hidden rounded-sm border border-navy/10 bg-navy/10 sm:grid-cols-3">
              {[
                {
                  t: "Rede credenciada",
                  d: "Verificamos se os hospitais que importam para a sua família estão realmente cobertos.",
                },
                {
                  t: "Condições por perfil",
                  d: "Idade, região e composição familiar mudam carência, reajuste e valor — analisamos o seu caso específico.",
                },
                {
                  t: "Comparação com o mercado",
                  d: "A MedSênior entra ao lado de outras operadoras compatíveis, não como recomendação isolada.",
                },
              ].map((item) => (
                <div key={item.t} className="bg-white p-5">
                  <p className="font-semibold text-navy">{item.t}</p>
                  <p className="mt-1.5 text-sm leading-relaxed text-navy/60">{item.d}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* A dor — versão família/indivíduo */}
        <section className="bg-white px-4 py-16 sm:px-6">
          <div className="mx-auto max-w-2xl">
            <div className="hairline text-gold" style={{ width: "3rem", opacity: 0.8 }} />
            <h2 className="headline-editorial mt-4 text-2xl text-navy sm:text-3xl">
              O problema quase nunca é o preço. É o contrato montado errado.
            </h2>
            <p className="mt-5 text-base leading-relaxed text-navy/65">
              A maioria das famílias contrata plano de saúde olhando só a mensalidade. Descobre o
              resto quando precisa usar: o hospital que queria não está na rede, a carência
              atrapalha, a coparticipação transforma cada consulta em uma conta a mais.
            </p>
            <p className="mt-3 text-base leading-relaxed text-navy/65">
              Uma análise comparativa ajuda a reduzir o risco de surpresas — é exatamente isso que
              a simulação gratuita entrega antes de você assinar qualquer contrato.
            </p>
          </div>
        </section>

        {/* FAQ específico da campanha */}
        <section className="bg-medsenior-tint/40 px-4 py-16 sm:px-6">
          <div className="mx-auto max-w-2xl">
            <p className="text-xs font-semibold uppercase tracking-widest text-medsenior text-center">
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
                    <span className="shrink-0 text-medsenior transition-transform group-open:rotate-45">
                      +
                    </span>
                  </summary>
                  <p className="mt-3 text-sm leading-relaxed text-navy/60">{item.a}</p>
                </details>
              ))}
            </div>
          </div>
        </section>

        {/* Guia gratuito — secundário, não disputa protagonismo com a conversão principal */}
        <section id="guia" className="bg-navy px-4 py-14 text-cream sm:px-6">
          <div className="mx-auto flex max-w-2xl flex-col items-center gap-4 text-center">
            <p className="eyebrow eyebrow-on-dark">Enquanto isso, um material gratuito</p>
            <h2 className="headline-editorial text-xl text-cream sm:text-2xl">
              Guia para avaliar hospitais e rede credenciada em São Paulo
            </h2>
            <p className="max-w-md text-sm leading-relaxed text-cream/65">
              Se preferir só pesquisar por enquanto, preencha abaixo e nossa equipe te envia o
              guia completo pelo WhatsApp.
            </p>
            <div className="mt-2 w-full max-w-sm rounded-sm bg-cream p-6 text-left">
              <LeadFormIsca sourcePage="plano-familiar" campaign={CAMPAIGN} />
            </div>
          </div>
        </section>

        {/* CTA final */}
        <section className="bg-white px-4 py-14 text-center sm:px-6">
          <p className="headline-editorial text-xl text-navy sm:text-2xl">
            Pronto para saber se a MedSênior é a escolha certa?
          </p>
          <div className="mt-6 flex flex-col items-center justify-center gap-3 sm:flex-row">
            <a
              href="#analise"
              className="rounded-full bg-medsenior px-7 py-3.5 text-base font-semibold text-white transition-colors hover:bg-medsenior-deep"
            >
              Solicitar análise gratuita
            </a>
            <a
              href={whatsappLink(WHATSAPP_MESSAGES.familiar)}
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
      <WhatsAppButton message={WHATSAPP_MESSAGES.familiar} />
    </>
  );
}
