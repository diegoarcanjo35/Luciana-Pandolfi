import type { Metadata } from "next";
import Image from "next/image";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import WhatsAppButton from "@/components/WhatsAppButton";
import { WHATSAPP_MESSAGES } from "@/lib/site-config";

export const metadata: Metadata = {
  title: "Quem somos",
  description:
    "L&J Consultoria — Luciana Pandolfi e Jhonatan, consultoria gratuita e independente em planos de saúde em São Paulo.",
};

export default function QuemSomosPage() {
  return (
    <>
      <Header ctaHref="/#simulacao" />
      <main className="flex-1">
        <section className="px-4 py-16 sm:px-6">
          <div className="mx-auto max-w-4xl">
            <p className="eyebrow text-center">Quem somos</p>
            <h1 className="mt-2 text-center font-serif-display text-3xl font-semibold text-navy sm:text-4xl">
              L&amp;J Consultoria
            </h1>
            <p className="mx-auto mt-3 max-w-xl text-center text-sm text-navy/55">
              Luciana Pandolfi &amp; Jhonatan
            </p>

            <div className="mt-10 grid gap-10 sm:grid-cols-2 sm:items-center">
              <div className="relative mx-auto aspect-square w-full max-w-sm overflow-hidden rounded-2xl border-2 border-gold shadow-lg">
                <Image
                  src="/team/luciana-e-jhonatan.jpg"
                  alt="Luciana Pandolfi e Jhonatan, sócios da L&J Consultoria, no escritório"
                  fill
                  sizes="(min-width: 640px) 24rem, 90vw"
                  className="object-cover"
                  priority
                />
              </div>

              <div className="flex flex-col gap-4 text-center sm:text-left">
                <p className="text-base leading-relaxed text-navy/70">
                  A L&amp;J nasceu para resolver um problema simples: a maioria das pessoas e
                  empresas contrata plano de saúde sem comparar de verdade — e só descobre o que
                  ficou de fora do contrato quando precisa usar.
                </p>
                <p className="text-base leading-relaxed text-navy/70">
                  Somos uma consultoria gratuita e independente. Luciana lidera o atendimento e a
                  análise técnica de cada caso — comparando operadoras, redes credenciadas e
                  condições antes de qualquer recomendação. Jhonatan cuida da estrutura por trás
                  do atendimento, para que cada consulta chegue rápido e seja respondida com
                  atenção.
                </p>
                <p className="text-base leading-relaxed text-navy/70">
                  Nosso diferencial é o acesso direto às principais operadoras e à rede de
                  hospitais de referência de São Paulo — é esse acesso que guia cada análise que
                  fazemos, para você decidir com informação, não com achismo.
                </p>
              </div>
            </div>

            <div className="mx-auto mt-12 max-w-2xl rounded-2xl border border-navy/10 bg-white p-6 shadow-sm sm:p-8">
              <p className="text-sm font-medium text-navy/70">Especialista em Planos de Saúde Nacional</p>
              <ul className="mt-3 flex flex-col gap-1.5 text-sm text-navy/60">
                <li>💲 Redução de custos para empresas e famílias</li>
                <li>🏥 Hospitais de referência</li>
                <li>🤝 Atendimento personalizado</li>
              </ul>
              <a
                href="https://www.instagram.com/lucianapandolfi.consultora/"
                target="_blank"
                rel="noopener noreferrer"
                className="mt-4 inline-block text-sm font-semibold text-gold-dark hover:underline"
              >
                @lucianapandolfi.consultora no Instagram
              </a>
            </div>

            <div className="mx-auto mt-12 max-w-2xl text-center">
              <a
                href="/#simulacao"
                className="inline-block rounded-full bg-gold px-8 py-4 text-base font-semibold text-navy transition-colors hover:bg-gold-light"
              >
                Quero minha simulação gratuita
              </a>
            </div>
          </div>
        </section>
      </main>
      <Footer />
      <WhatsAppButton message={WHATSAPP_MESSAGES.home} />
    </>
  );
}
