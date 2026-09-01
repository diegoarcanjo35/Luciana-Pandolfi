"use client";

import { useEffect } from "react";

/**
 * Disparo do evento de conversão no navegador (Meta Pixel), em `/obrigado`.
 * Usa o mesmo `eventId` gerado no formulário e já enviado ao servidor (API de
 * Conversões, em src/lib/meta-capi.ts) para deduplicação — a Meta soma os
 * dois como um único evento quando o event_id bate.
 *
 * `eventName` varia por tipo de formulário — "Lead" fica reservado à análise
 * completa (é nela que a campanha otimiza), o guia gratuito usa
 * "CompleteRegistration" pra não misturar intenção alta com quem só queria o
 * material (ver auditoria de campanha, 01/09/2026). Precisa bater exatamente
 * com o que foi enviado à API de Conversões pro mesmo event_id.
 *
 * GA4 fica de fora por decisão do cliente (fase 2, ver README.md) — não é
 * bloqueante para o go-live de 01/09.
 */
export default function ConversionTracking({
  campaign,
  eventId,
  eventName,
}: {
  campaign?: string | null;
  eventId?: string | null;
  eventName: string;
}) {
  useEffect(() => {
    if (!eventId) return;
    window.fbq?.("track", eventName, campaign ? { campaign } : {}, { eventID: eventId });
  }, [campaign, eventId, eventName]);

  return null;
}
