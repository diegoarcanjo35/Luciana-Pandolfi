import type { Metadata } from "next";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import WhatsAppButton from "@/components/WhatsAppButton";
import LeadFormIsca from "@/components/LeadFormIsca";
import LeadFormQualificacao from "@/components/LeadFormQualificacao";
import { WHATSAPP_MESSAGES } from "@/lib/site-config";

export const metadata: Metadata = {
  title: "Plano de saúde empresarial (CNPJ) com a Alice",
  description:
    "Tem CNPJ ou MEI? Conheça a condição especial da Alice Empresarial para sua equipe, com consultoria gratuita e independente.",
};

const CAMPAIGN = "alice-empresarial";

export default function PlanoEmpresarialPage() {
  return (
    <>
      <Header ctaHref="#analise" />
      <main className="flex-1">
        {/* Hero — message match com o anúncio da Alice */}
        <section className="bg-gradient-to-b from-[#0b2436] to-[#123a52] px-4 py-16 text-white sm:px-6 sm:py-24">
          <div className="mx-auto max-w-3xl text-center">
            <h1 className="font-serif-display text-3xl font-semibold leading-tight sm:text-5xl">
              Tem CNPJ ou MEI? Não perca a condição especial da Alice Empresarial pra sua equipe.
            </h1>
            <p className="mx-auto mt-5 max-w-2xl text-base text-slate-200 sm:text-lg">
              O plano de saúde ideal para sua empresa, com ampla cobertura e excelente
              custo-benefício. Consultoria gratuita e independente — eu comparo o mercado antes de
              você decidir, não sou venda direta da operadora.
            </p>
            <a
              href="#analise"
              className="mt-8 inline-block rounded-full bg-teal-500 px-8 py-4 text-base font-semibold text-white transition-colors hover:bg-teal-400"
            >
              Quero a condição para minha empresa
            </a>
            <p className="mt-4 text-sm text-slate-300">
              Resposta em até 2 horas úteis · Atendimento em São Paulo e em todo o Brasil · Sem
              custo e sem compromisso
            </p>
          </div>
        </section>

        {/* Comparação PF x CNPJ */}
        <section className="px-4 py-16 sm:px-6">
          <div className="mx-auto max-w-3xl">
            <h2 className="text-center font-serif-display text-2xl font-semibold text-[#0b2436] sm:text-3xl">
              Sua empresa provavelmente está pagando a tabela errada
            </h2>
            <div className="mt-10 grid gap-6 sm:grid-cols-2">
              <div className="rounded-2xl border border-slate-200 bg-white p-6">
                <p className="font-semibold text-[#0b2436]">Plano pessoa física</p>
                <p className="mt-2 text-sm leading-relaxed text-slate-600">
                  Tabela individual, sem as condições de negociação em grupo. É o que a maioria
                  dos donos de CNPJ e MEI ainda paga — muitas vezes sem saber que existe outra
                  opção.
                </p>
              </div>
              <div className="rounded-2xl border-2 border-teal-600 bg-white p-6">
                <p className="font-semibold text-[#0b2436]">Plano empresarial (CNPJ)</p>
                <p className="mt-2 text-sm leading-relaxed text-slate-600">
                  Tabela diferente, negociada para pessoa jurídica — inclusive para empresas
                  pequenas, a partir de poucas vidas. Costuma trazer melhor custo-benefício para o
                  mesmo padrão de cobertura.
                </p>
              </div>
            </div>
            <p className="mx-auto mt-6 max-w-2xl text-center text-sm text-slate-500">
              A condição exata depende do número de vidas, da faixa etária do grupo e da
              operadora — por isso a análise é individual, sem promessa de valor fechado aqui na
              página.
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
                Antes de decidir, veja quais planos dão acesso aos hospitais que sua equipe
                valoriza. Preencha ao lado e receba o guia completo agora, no seu WhatsApp.
              </p>
            </div>
            <div className="rounded-2xl bg-white p-6">
              <LeadFormIsca sourcePage="plano-empresarial" campaign={CAMPAIGN} />
            </div>
          </div>
        </section>

        {/* Fechamento */}
        <section id="analise" className="px-4 py-16 sm:px-6">
          <div className="mx-auto max-w-xl">
            <h2 className="text-center font-serif-display text-2xl font-semibold text-[#0b2436] sm:text-3xl">
              Vamos calcular a condição empresarial para sua equipe?
            </h2>
            <p className="mt-4 text-center text-sm leading-relaxed text-slate-600">
              Preencha os dados abaixo e eu retorno com a análise comparativa para a Alice
              Empresarial e outras opções do mercado. Sem custo, sem compromisso.
            </p>
            <div className="mt-8 rounded-2xl border border-slate-200 bg-white p-6">
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
