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
    "L&J Consultoria — Luciana Pandolfi e Jhonatan, consultoria gratuita e independente em planos de saúde em São Paulo.",
  alternates: { canonical: PAGE_URL },
  openGraph: {
    url: PAGE_URL,
    title: "Quem somos | L&J Consultoria",
    description:
      "Luciana Pandolfi e Jhonatan, consultoria gratuita e independente em planos de saúde em São Paulo.",
    images: [{ url: "/team/luciana-e-jhonatan.jpg", width: 1080, height: 1350 }],
  },
};

export default function QuemSomosPage() {
  return (
    <>
      <Header ctaHref="/#simulacao" />
      <main className="flex-1">
        <section className="bg-white px-4 py-16 sm:px-6 sm:py-24">
          <div className="mx-auto grid max-w-5xl gap-12 sm:grid-cols-[1fr_1.1fr] sm:items-center">
            {/* Foto com moldura em arco + selo sobreposto, no mesmo padrão visual
                usado nos outros sites da agência (Cris Paula, Vallery Alves). */}
            <div className="relative mx-auto w-full max-w-sm">
              <div className="relative aspect-[4/5] w-full overflow-hidden rounded-t-[9999px] rounded-b-3xl shadow-xl">
                <Image
                  src="/team/luciana-e-jhonatan.jpg"
                  alt="Luciana Pandolfi e Jhonatan, sócios da L&J Consultoria, no escritório"
                  fill
                  sizes="(min-width: 640px) 24rem, 90vw"
                  className="object-cover object-top"
                  priority
                />
                <div
                  aria-hidden
                  className="absolute inset-0 bg-gradient-to-t from-navy-deep/70 via-transparent to-transparent"
                />
                <div
                  aria-hidden
                  className="absolute left-1/2 top-4 flex h-14 w-14 -translate-x-1/2 items-center justify-center rounded-full border-2 border-gold bg-navy/90 font-serif-display text-base text-gold-light shadow-md"
                >
                  L&J
                </div>
              </div>
              <div className="absolute -bottom-5 left-1/2 w-[85%] -translate-x-1/2 rounded-xl border border-navy/10 bg-white px-4 py-3 text-center shadow-lg">
                <p className="text-sm font-semibold text-navy">Atendimento personalizado</p>
                <p className="text-xs text-navy/50">Antes, durante e depois da contratação</p>
              </div>
            </div>

            <div className="mt-6 flex flex-col gap-5 text-center sm:mt-0 sm:text-left">
              <p className="eyebrow sm:text-left">Sobre a L&amp;J</p>
              <h1 className="font-serif-display text-3xl font-semibold leading-tight text-navy sm:text-4xl">
                Decisão de plano de saúde, com informação — não com achismo.
              </h1>
              <p className="text-base leading-relaxed text-navy/65">
                A L&amp;J nasceu para resolver um problema simples: a maioria das pessoas e
                empresas contrata plano de saúde sem comparar de verdade — e só descobre o que
                ficou de fora do contrato quando precisa usar.
              </p>
              <p className="text-base leading-relaxed text-navy/65">
                Somos uma consultoria gratuita e independente, formada por Luciana Pandolfi e
                Jhonatan. Nosso diferencial é o acesso direto às principais operadoras e à rede de
                hospitais de referência de São Paulo — é esse acesso que guia cada análise antes
                de qualquer recomendação.
              </p>
              <blockquote className="border-l-2 border-gold py-1 pl-4 text-left font-serif-display text-lg italic text-navy/80">
                &ldquo;Comparamos o mercado inteiro antes de qualquer recomendação — para você
                decidir com informação, não com achismo.&rdquo;
              </blockquote>
            </div>
          </div>
        </section>

        <section className="bg-cream-dark/50 px-4 py-14 sm:px-6">
          <div className="mx-auto max-w-2xl rounded-2xl border border-navy/10 bg-white p-6 text-center shadow-sm sm:p-8">
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
