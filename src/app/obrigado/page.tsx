import type { Metadata } from "next";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import WhatsAppButton from "@/components/WhatsAppButton";
import ConversionTracking from "@/components/ConversionTracking";
import { WHATSAPP_MESSAGES } from "@/lib/site-config";

export const metadata: Metadata = {
  title: "Recebemos seus dados",
  robots: { index: false, follow: false },
};

export default async function ObrigadoPage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const params = await searchParams;
  const campanha = typeof params.campanha === "string" ? params.campanha : null;
  const eventId = typeof params.eid === "string" ? params.eid : null;

  return (
    <>
      <Header ctaHref="/" />
      <ConversionTracking campaign={campanha} eventId={eventId} />
      <main className="flex flex-1 items-center justify-center px-4 py-20 sm:px-6">
        <div className="mx-auto max-w-xl text-center">
          <div
            aria-hidden
            className="mx-auto flex h-16 w-16 items-center justify-center rounded-full border-2 border-gold bg-navy text-3xl text-gold-light"
          >
            ✓
          </div>
          <h1 className="mt-6 font-serif-display text-2xl font-semibold text-navy sm:text-3xl">
            Recebemos seus dados. Obrigada!
          </h1>
          <p className="mt-4 text-base leading-relaxed text-navy/65">
            Sua análise está a caminho — a Luciana retorna em até <strong>1 hora útil</strong> (para
            quem pediu a simulação) ou em até <strong>24 horas úteis</strong> (para análises
            comparativas completas).
          </p>
          <p className="mt-3 text-base leading-relaxed text-navy/65">
            Quer adiantar a conversa agora mesmo? Chame no WhatsApp.
          </p>
          <a
            href={`https://wa.me/5511956098194?text=${encodeURIComponent(
              WHATSAPP_MESSAGES.obrigado
            )}`}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-8 inline-flex items-center gap-2 rounded-full bg-gold px-8 py-4 text-base font-semibold text-navy transition-colors hover:bg-gold-light"
          >
            Falar agora no WhatsApp
          </a>
        </div>
      </main>
      <Footer />
      <WhatsAppButton message={WHATSAPP_MESSAGES.obrigado} />
    </>
  );
}
