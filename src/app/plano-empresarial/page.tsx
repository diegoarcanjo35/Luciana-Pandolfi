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
        <section className="relative overflow-hidden bg-gradient-to-b from-navy-deep via-navy to-navy-light px-4 py-16 text-cream sm:px-6 sm:py-24">
          <div
            aria-hidden
            className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-gold/60 to-transparent"
          />
          <div className="relative mx-auto max-w-3xl text-center">
            <p className="eyebrow eyebrow-on-dark">Campanha Alice Empresarial</p>
            <h1 className="mt-4 font-serif-display text-3xl font-semibold leading-tight sm:text-5xl">
              Tem CNPJ ou MEI? Não perca a condição especial da Alice Empresarial pra sua equipe.
            </h1>
            <p className="mx-auto mt-5 max-w-2xl text-base text-cream/80 sm:text-lg">
              O plano de saúde ideal para sua empresa, com ampla cobertura e excelente
              custo-benefício. Consultoria gratuita e independente — eu comparo o mercado antes de
              você decidir, não sou venda direta da operadora.
            </p>
            <a
              href="#analise"
              className="mt-8 inline-block rounded-full bg-gold px-8 py-4 text-base font-semibold text-navy transition-colors hover:bg-gold-light"
            >
              Quero a condição para minha empresa
            </a>
            <p className="mt-4 text-sm text-cream/50">
              Resposta em até 2 horas úteis · Atendimento em São Paulo e em todo o Brasil · Sem
              custo e sem compromisso
            </p>
          </div>
        </section>

        {/* Vídeo do anúncio vencedor */}
        <section className="bg-white px-4 py-14 sm:px-6">
          <div className="mx-auto flex max-w-2xl flex-col items-center gap-4 text-center">
            <p className="eyebrow">Assista antes de continuar</p>
            <video
              controls
              preload="metadata"
              poster="/creatives/alice-video-poster.jpg"
              className="w-full max-w-xs rounded-2xl border border-navy/10 shadow-lg"
            >
              <source src="/creatives/alice-video.mp4" type="video/mp4" />
            </video>
            <p className="max-w-md text-sm text-navy/50">
              O vídeo que você viu no anúncio — direto da Luciana, explicando a condição da Alice
              Empresarial para quem tem CNPJ ou MEI.
            </p>
          </div>
        </section>

        {/* Comparação PF x CNPJ */}
        <section className="bg-cream-dark/50 px-4 py-16 sm:px-6">
          <div className="mx-auto max-w-3xl">
            <p className="eyebrow text-center">Por que isso importa</p>
            <h2 className="mt-2 text-center font-serif-display text-2xl font-semibold text-navy sm:text-3xl">
              Sua empresa provavelmente está pagando a tabela errada
            </h2>
            <div className="mt-10 grid gap-6 sm:grid-cols-2">
              <div className="rounded-2xl border border-navy/10 bg-white p-6 shadow-sm">
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
                  Tabela diferente, negociada para pessoa jurídica — inclusive para empresas
                  pequenas, a partir de poucas vidas. Costuma trazer melhor custo-benefício para o
                  mesmo padrão de cobertura.
                </p>
              </div>
            </div>
            <p className="mx-auto mt-6 max-w-2xl text-center text-sm text-navy/45">
              A condição exata depende do número de vidas, da faixa etária do grupo e da
              operadora — por isso a análise é individual, sem promessa de valor fechado aqui na
              página.
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
                Antes de decidir, veja quais planos dão acesso aos hospitais que sua equipe
                valoriza. Preencha ao lado e receba o guia completo agora, no seu WhatsApp.
              </p>
            </div>
            <div className="rounded-2xl bg-cream p-6">
              <LeadFormIsca sourcePage="plano-empresarial" campaign={CAMPAIGN} />
            </div>
          </div>
        </section>

        {/* Fechamento */}
        <section id="analise" className="px-4 py-16 sm:px-6">
          <div className="mx-auto max-w-xl">
            <p className="eyebrow text-center">Último passo</p>
            <h2 className="mt-2 text-center font-serif-display text-2xl font-semibold text-navy sm:text-3xl">
              Vamos calcular a condição empresarial para sua equipe?
            </h2>
            <p className="mt-4 text-center text-sm leading-relaxed text-navy/60">
              Preencha os dados abaixo e eu retorno com a análise comparativa para a Alice
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
