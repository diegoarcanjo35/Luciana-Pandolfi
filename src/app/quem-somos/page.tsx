import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import WhatsAppButton from "@/components/WhatsAppButton";
import { SITE_URL, WHATSAPP_MESSAGES } from "@/lib/site-config";

const PAGE_URL = `${SITE_URL}/quem-somos`;

export const metadata: Metadata = {
  title: "Quem somos",
  description:
    "L&J Consultoria — Luciana Pandolfi e Jonathan, consultoria gratuita e independente em planos de saúde em São Paulo.",
  alternates: { canonical: PAGE_URL },
  openGraph: {
    url: PAGE_URL,
    title: "Quem somos | L&J Consultoria",
    description:
      "Luciana Pandolfi e Jonathan, consultoria gratuita e independente em planos de saúde em São Paulo.",
    images: [{ url: "/og/lj.jpg", width: 1200, height: 630 }],
  },
};

export default function QuemSomosPage() {
  return (
    <>
      <Header ctaHref="/#simulacao" />
      <main className="flex-1">
        {/* Hero institucional — assimétrico, monograma grande, sem moldura em arco genérica */}
        <section className="relative overflow-hidden bg-navy-deep">
          <div className="mx-auto grid max-w-6xl sm:grid-cols-[1.05fr_1fr] sm:items-stretch">
            <div className="flex flex-col justify-center gap-6 px-4 py-16 sm:px-8 sm:py-24">
              <span aria-hidden className="font-serif-display text-5xl italic text-gold-light/80">
                L&amp;J
              </span>
              <p className="eyebrow eyebrow-on-dark">Sobre a consultoria</p>
              <h1 className="headline-editorial text-3xl text-cream sm:text-4xl lg:text-[2.75rem]">
                Decisão de plano de saúde, com informação — não com achismo.
              </h1>
              <blockquote className="border-l-2 border-gold py-1 pl-5 text-left font-serif-display text-lg italic text-cream/85">
                &ldquo;Comparamos o mercado inteiro antes de qualquer recomendação — para você
                decidir com informação, não com achismo.&rdquo;
              </blockquote>
              <p className="max-w-md text-sm text-cream/50">
                Luciana Pandolfi &amp; Jonathan — sócios da L&amp;J Consultoria
              </p>
            </div>
            <div className="relative min-h-[20rem] sm:min-h-0">
              <Image
                src="/team/luciana-e-jhonatan.jpg"
                alt="Luciana Pandolfi e Jonathan, sócios da L&J Consultoria, no escritório"
                fill
                sizes="(min-width: 640px) 45vw, 100vw"
                className="object-cover object-top"
                priority
              />
              <div
                aria-hidden
                className="absolute inset-0 bg-gradient-to-r from-navy-deep/50 via-transparent to-transparent sm:bg-gradient-to-r"
              />
            </div>
          </div>
        </section>

        {/* Quem faz o quê — a consultoria é dos dois, com função própria de cada sócio */}
        <section className="bg-white px-4 py-16 sm:px-6">
          <div className="mx-auto max-w-3xl">
            <p className="eyebrow">Quem assina o nome</p>
            <h2 className="headline-editorial mt-2 max-w-lg text-2xl text-navy sm:text-3xl">
              A consultoria nasceu para resolver um problema simples
            </h2>
            <p className="mt-5 text-base leading-relaxed text-navy/65">
              A maioria das pessoas e empresas contrata plano de saúde sem comparar de verdade — e
              só descobre o que ficou de fora do contrato quando precisa usar. Somos uma
              consultoria gratuita e independente, formada por Luciana Pandolfi e Jonathan. Nosso
              diferencial é o acesso direto às principais operadoras e à rede de hospitais de
              referência de São Paulo — é esse acesso que guia cada análise antes de qualquer
              recomendação.
            </p>
            <div className="mt-10 grid gap-px overflow-hidden rounded-sm border border-navy/10 bg-navy/10 sm:grid-cols-2">
              <div className="bg-cream/60 p-6">
                <p className="font-serif-display text-lg text-navy">Luciana Pandolfi</p>
                <p className="mt-1.5 text-sm leading-relaxed text-navy/60">
                  Especialista em planos de saúde nacional, à frente do atendimento e da análise
                  comparativa de cada caso.
                </p>
              </div>
              <div className="bg-cream/60 p-6">
                <p className="font-serif-display text-lg text-navy">Jonathan</p>
                <p className="mt-1.5 text-sm leading-relaxed text-navy/60">
                  Sócio da L&amp;J, responsável pela estrutura da consultoria e pelo relacionamento
                  com as operadoras parceiras.
                </p>
              </div>
            </div>
          </div>
        </section>

        <section className="bg-cream-dark/50 px-4 py-14 sm:px-6">
          <div className="mx-auto max-w-2xl border border-navy/10 bg-white p-6 text-center shadow-sm sm:p-8">
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
            <div className="mt-6">
              <Link
                href="/#simulacao"
                className="inline-block rounded-full bg-gold px-8 py-4 text-base font-semibold text-navy transition-colors hover:bg-gold-light"
              >
                Quero minha simulação gratuita
              </Link>
            </div>
          </div>
        </section>
      </main>
      <Footer />
      <WhatsAppButton message={WHATSAPP_MESSAGES.home} />
    </>
  );
}
