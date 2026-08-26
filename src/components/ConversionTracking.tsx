"use client";

import { useEffect } from "react";

/**
 * Disparo do evento de conversão "Lead" no navegador (Meta Pixel), em
 * `/obrigado`. Usa o mesmo `eventId` gerado no formulário e já enviado ao
 * servidor (API de Conversões, em src/lib/meta-capi.ts) para deduplicação —
 * a Meta soma os dois como um único evento quando o event_id bate.
 *
 * GA4 fica de fora por decisão do cliente (fase 2, ver README.md) — não é
 * bloqueante para o go-live de 01/09.
 */
export default function ConversionTracking({
  campaign,
  eventId,
}: {
  campaign?: string | null;
  eventId?: string | null;
}) {
  useEffect(() => {
    if (!eventId) return;
    window.fbq?.("track", "Lead", campaign ? { campaign } : {}, { eventID: eventId });
  }, [campaign, eventId]);

  return null;
}
