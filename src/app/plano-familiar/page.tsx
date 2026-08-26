import type { Metadata } from "next";
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
        <section className="bg-gradient-to-b from-[#0b2436] to-[#123a52] px-4 py-16 text-white sm:px-6 sm:py-24">
          <div className="mx-auto max-w-3xl text-center">
            <h1 className="font-serif-display text-3xl font-semibold leading-tight sm:text-5xl">
              Cuide da sua saúde e economize com a MedSênior.
            </h1>
            <p className="mx-auto mt-5 max-w-2xl text-base text-slate-200 sm:text-lg">
              O plano de saúde mais completo e acessível de São Paulo está ao seu alcance.
              Consultoria gratuita e independente — eu comparo o mercado e te mostro o cenário
              completo antes de você decidir.
            </p>
            <a
              href="#analise"
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

        {/*
          Bloco de promoção (1ª mensalidade com desconto) fica de fora por enquanto:
          o criativo "Promoção prorrogada — 20% de desconto" precisa de confirmação da
          cliente sobre se a condição ainda está ativa na operadora e qual a data de
          validade real antes de reaparecer aqui. Não inventar prazo.
        */}

        {/* A dor — versão família/indivíduo */}
        <section className="px-4 py-16 sm:px-6">
          <div className="mx-auto max-w-3xl text-center">
            <h2 className="font-serif-display text-2xl font-semibold text-[#0b2436] sm:text-3xl">
              O problema quase nunca é o preço. É o contrato montado errado.
            </h2>
            <p className="mt-5 text-base leading-relaxed text-slate-600">
              A maioria das famílias contrata plano de saúde olhando só a mensalidade. Descobre o
              resto quando precisa usar: o hospital que queria não está na rede, a carência não
              era zero, a coparticipação transforma cada consulta em uma conta a mais.
            </p>
            <p className="mt-3 text-base leading-relaxed text-slate-600">
              Uma análise comparativa evita esse tipo de surpresa — e é exatamente isso que a
              simulação gratuita entrega antes de você assinar qualquer contrato.
            </p>
          </div>
        </section>

        {/* Isca de captura */}
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
              <LeadFormIsca sourcePage="plano-familiar" campaign={CAMPAIGN} />
            </div>
          </div>
        </section>

        {/* Fechamento */}
        <section id="analise" className="px-4 py-16 sm:px-6">
          <div className="mx-auto max-w-xl">
            <h2 className="text-center font-serif-display text-2xl font-semibold text-[#0b2436] sm:text-3xl">
              Vamos descobrir quanto você pode economizar?
            </h2>
            <p className="mt-4 text-center text-sm leading-relaxed text-slate-600">
              Preencha os dados abaixo e eu retorno com a análise comparativa, incluindo a
              MedSênior e outras opções do mercado. Sem custo, sem compromisso.
            </p>
            <div className="mt-8 rounded-2xl border border-slate-200 bg-white p-6">
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
