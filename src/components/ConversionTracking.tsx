"use client";

import { useEffect } from "react";

/**
 * Disparo do evento de conversão (Meta Pixel + API de Conversões, e Google Tag / GA4).
 *
 * BYPASS ATIVO — por decisão do cliente, o Pixel e o GA4 ainda não foram conectados
 * (aguardando os IDs/tokens do Business Manager e do GA4). Esta função só loga no
 * console por enquanto. Antes de qualquer campanha subir (contrato exige isso), plugar:
 *
 * 1. Meta Pixel: adicionar o snippet do Pixel no <head> (ver next/script em layout.tsx)
 *    com o Pixel ID real, e chamar fbq('track', 'Lead', { campaign }) aqui.
 * 2. API de Conversões: enviar o mesmo evento Lead server-side (ideal: dentro de
 *    /api/lead/route.ts, usando o Pixel ID + Access Token via variável de ambiente).
 * 3. GA4: adicionar o gtag.js com o Measurement ID real e chamar
 *    gtag('event', 'generate_lead', { campaign }) aqui.
 * 4. Validar no "Testar Eventos" do Meta Events Manager antes do go-live.
 */
export default function ConversionTracking({ campaign }: { campaign?: string | null }) {
  useEffect(() => {
    console.log("[conversion-tracking:bypass] Lead event", { campaign: campaign ?? "não informada" });
    // TODO: substituir pelo disparo real assim que Pixel/GA4 estiverem configurados.
  }, [campaign]);

  return null;
}
