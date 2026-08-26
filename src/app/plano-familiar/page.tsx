import type { Metadata } from "next";
import Image from "next/image";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import WhatsAppButton from "@/components/WhatsAppButton";
import LeadFormIsca from "@/components/LeadFormIsca";
import LeadFormQualificacao from "@/components/LeadFormQualificacao";
import { WHATSAPP_MESSAGES } from "@/lib/site-config";

export const metadata: Metadata = {
  title: "Cuide da saúde e economize com a MedSênior",
  description:
    "Plano de saúde completo e acessível em São Paulo. Consultoria gratuita e independente para você e sua família decidirem com informação.",
};

const CAMPAIGN = "medsenior-economia";

export default function PlanoFamiliarPage() {
  return (
    <>
      <Header ctaHref="#analise" />
      <main className="flex-1">
        {/* Hero — message match com o anúncio da MedSênior */}
        <section className="relative overflow-hidden bg-gradient-to-b from-navy-deep via-navy to-navy-light px-4 py-16 text-cream sm:px-6 sm:py-24">
          <div
            aria-hidden
            className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-gold/60 to-transparent"
          />
          <div className="relative mx-auto grid max-w-5xl gap-10 sm:grid-cols-2 sm:items-center">
            <div className="text-center sm:text-left">
              <p className="eyebrow eyebrow-on-dark">Campanha MedSênior</p>
              <h1 className="mt-4 font-serif-display text-3xl font-semibold leading-tight sm:text-5xl">
                Cuide da sua saúde e economize com a MedSênior.
              </h1>
              <p className="mx-auto mt-5 max-w-2xl text-base text-cream/80 sm:mx-0 sm:text-lg">
                O plano de saúde mais completo e acessível de São Paulo está ao seu alcance.
                Consultoria gratuita e independente — eu comparo o mercado e te mostro o cenário
                completo antes de você decidir.
              </p>
              <a
                href="#analise"
                className="mt-8 inline-block rounded-full bg-gold px-8 py-4 text-base font-semibold text-navy transition-colors hover:bg-gold-light"
              >
                Quero minha simulação gratuita
              </a>
              <p className="mt-4 text-sm text-cream/50">
                Resposta em até 2 horas úteis · Atendimento em São Paulo e em todo o Brasil · Sem
                custo e sem compromisso
              </p>
            </div>
            <div className="relative mx-auto hidden aspect-[4/5] w-full max-w-sm overflow-hidden rounded-2xl border border-gold/30 shadow-2xl sm:block">
              <Image
                src="/creatives/medsenior-fachada.jpg"
                alt="Fachada da MedSênior em São Paulo"
                fill
                sizes="(min-width: 640px) 24rem, 0px"
                className="object-cover"
                priority
              />
            </div>
          </div>
        </section>

        {/*
          Bloco de promoção (1ª mensalidade com desconto) fica de fora por enquanto:
          o criativo "Promoção prorrogada — 20% de desconto" precisa de confirmação da
          cliente sobre se a condição ainda está ativa na operadora e qual a data de
          validade real antes de reaparecer aqui. Não inventar prazo.
        */}

        {/* A dor — versão família/indivíduo */}
        <section className="px-4 py-16 sm:px-6">
          <div className="mx-auto max-w-3xl text-center">
            <div className="gold-rule-center" />
            <h2 className="mt-4 font-serif-display text-2xl font-semibold text-navy sm:text-3xl">
              O problema quase nunca é o preço. É o contrato montado errado.
            </h2>
            <p className="mt-5 text-base leading-relaxed text-navy/65">
              A maioria das famílias contrata plano de saúde olhando só a mensalidade. Descobre o
              resto quando precisa usar: o hospital que queria não está na rede, a carência não
              era zero, a coparticipação transforma cada consulta em uma conta a mais.
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
              <LeadFormIsca sourcePage="plano-familiar" campaign={CAMPAIGN} />
            </div>
          </div>
        </section>

        {/* Fechamento */}
        <section id="analise" className="px-4 py-16 sm:px-6">
          <div className="mx-auto max-w-xl">
            <p className="eyebrow text-center">Último passo</p>
            <h2 className="mt-2 text-center font-serif-display text-2xl font-semibold text-navy sm:text-3xl">
              Vamos descobrir quanto você pode economizar?
            </h2>
            <p className="mt-4 text-center text-sm leading-relaxed text-navy/60">
              Preencha os dados abaixo e eu retorno com a análise comparativa, incluindo a
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
