import type { Metadata } from "next";
import Image from "next/image";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import WhatsAppButton from "@/components/WhatsAppButton";
import LeadFormIsca from "@/components/LeadFormIsca";
import LeadFormQualificacao from "@/components/LeadFormQualificacao";
import { SITE_URL, WHATSAPP_MESSAGES } from "@/lib/site-config";

const PAGE_URL = `${SITE_URL}/plano-familiar`;
const OG_IMAGE = "/creatives/medsenior-fachada-sp.jpg";

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
    images: [{ url: OG_IMAGE, width: 1080, height: 740 }],
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
    a: "Não. Ela entra na comparação porque tem bom histórico para o perfil de quem busca economia — mas a recomendação final considera todas as opções compatíveis com você.",
  },
  {
    q: "Rede, carência e valores são os mesmos para todo mundo?",
    a: "Não. Variam conforme produto, idade, região e composição familiar. A disponibilidade exata é confirmada durante a análise, sem custo.",
  },
];

export default function PlanoFamiliarPage() {
  return (
    <>
      <Header ctaHref="#analise" />
      <main className="flex-1">
        {/* Hero — message match com o anúncio da MedSênior, sem prometer resultado */}
        <section className="relative overflow-hidden bg-gradient-to-b from-navy-deep via-navy to-navy-light px-4 py-16 text-cream sm:px-6 sm:py-24">
          <div
            aria-hidden
            className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-gold/60 to-transparent"
          />
          <div className="relative mx-auto grid max-w-5xl gap-10 sm:grid-cols-2 sm:items-center">
            <div className="text-center sm:text-left">
              <p className="eyebrow eyebrow-on-dark">Campanha MedSênior</p>
              <h1 className="mt-4 font-serif-display text-3xl font-semibold leading-tight sm:text-5xl">
                Cuide da sua saúde e entenda se a MedSênior faz sentido para o seu perfil.
              </h1>
              <p className="mx-auto mt-5 max-w-2xl text-base text-cream/80 sm:mx-0 sm:text-lg">
                Consultoria gratuita e independente — comparamos a MedSênior com outras operadoras
                antes de qualquer recomendação, para você decidir com informação.
              </p>
              <a
                href="#analise"
                className="mt-8 inline-block rounded-full bg-gold px-8 py-4 text-base font-semibold text-navy transition-colors hover:bg-gold-light"
              >
                Quero minha análise gratuita
              </a>
              <p className="mt-4 text-sm text-cream/50">
                Resposta em até 2 horas úteis · Atendimento em São Paulo e em todo o Brasil · Sem
                custo e sem compromisso
              </p>
            </div>
            <div className="relative mx-auto hidden aspect-[3/2] w-full max-w-md overflow-hidden rounded-2xl border border-gold/30 shadow-2xl sm:block">
              <Image
                src="/creatives/medsenior-fachada-sp.jpg"
                alt="Fachada da MedSênior em São Paulo"
                fill
                sizes="(min-width: 640px) 24rem, 0px"
                className="object-cover"
                priority
              />
            </div>
          </div>
        </section>

        {/* Aviso de responsabilidade — visível, não escondido no rodapé */}
        <div className="border-b border-navy/10 bg-cream-dark/40 px-4 py-3 text-center text-xs text-navy/55 sm:px-6">
          Rede credenciada, carência, valores e condições variam conforme produto, idade, região e
          composição familiar. A disponibilidade é confirmada durante a análise, sem custo.
        </div>

        {/* O que analisamos */}
        <section className="px-4 py-14 sm:px-6">
          <div className="mx-auto max-w-3xl">
            <p className="eyebrow text-center">O que entra na análise</p>
            <h2 className="mt-2 text-center font-serif-display text-2xl font-semibold text-navy sm:text-3xl">
              Comparamos antes de indicar
            </h2>
            <div className="mt-8 grid gap-5 sm:grid-cols-3">
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
                <div key={item.t} className="rounded-2xl border border-navy/10 bg-white p-5 shadow-sm">
                  <p className="font-semibold text-navy">{item.t}</p>
                  <p className="mt-1.5 text-sm leading-relaxed text-navy/60">{item.d}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* A dor — versão família/indivíduo */}
        <section className="bg-white px-4 py-16 sm:px-6">
          <div className="mx-auto max-w-3xl text-center">
            <div className="gold-rule-center" />
            <h2 className="mt-4 font-serif-display text-2xl font-semibold text-navy sm:text-3xl">
              O problema quase nunca é o preço. É o contrato montado errado.
            </h2>
            <p className="mt-5 text-base leading-relaxed text-navy/65">
              A maioria das famílias contrata plano de saúde olhando só a mensalidade. Descobre o
              resto quando precisa usar: o hospital que queria não está na rede, a carência
              atrapalha, a coparticipação transforma cada consulta em uma conta a mais.
            </p>
            <p className="mt-3 text-base leading-relaxed text-navy/65">
              Uma análise comparativa evita esse tipo de surpresa — e é exatamente isso que a
              simulação gratuita entrega antes de você assinar qualquer contrato.
            </p>
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
                Se existe um hospital em que você quer ser atendido, é por ele que a escolha do
                plano deveria começar — não pelo preço. Preencha ao lado e nossa equipe te envia
                o guia completo pelo WhatsApp.
              </p>
            </div>
            <div className="rounded-2xl bg-cream p-6">
              <LeadFormIsca sourcePage="plano-familiar" campaign={CAMPAIGN} />
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
              Vamos entender o que faz sentido para o seu caso?
            </h2>
            <p className="mt-4 text-center text-sm leading-relaxed text-navy/60">
              Preencha os dados abaixo e retornamos com a análise comparativa, incluindo a
              MedSênior e outras opções do mercado. Sem custo, sem compromisso.
            </p>
            <div className="mt-8 rounded-2xl border border-navy/10 bg-white p-6 shadow-sm">
              <LeadFormQualificacao
                sourcePage="plano-familiar"
                campaign={CAMPAIGN}
                paraQuemOrder={["Para mim", "Minha família", "Meus pais", "Minha empresa (CNPJ)"]}
                ctaLabel="Solicitar minha análise gratuita"
              />
            </div>
          </div>
        </section>
      </main>
      <Footer />
      <WhatsAppButton message={WHATSAPP_MESSAGES.familiar} />
    </>
  );
}
