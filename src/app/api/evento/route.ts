import { NextRequest, NextResponse } from "next/server";
import {
  eventoValido,
  corpoGrandeDemais,
  criarLimitador,
  limpa,
  limpaOuNulo,
  inteiroOuNulo,
} from "@/lib/analytics-security";
import { insertAnalyticsEvent } from "@/lib/db";

const MAX_BODY_BYTES = 8 * 1024;
const limitador = criarLimitador(120, 60_000); // 120 eventos/min por IP, por isolate

// Regra de ouro: este endpoint sempre responde rápido e nunca em erro visível — a
// aba do visitante não pode travar nem mostrar erro por causa do analytics. Toda
// falha (banco fora do ar, campo estranho, rate limit) engole o erro e responde 204.
export async function POST(req: NextRequest) {
  const ip = req.headers.get("cf-connecting-ip") ?? req.headers.get("x-forwarded-for") ?? "sem-ip";

  if (limitador.excedeu(ip)) {
    return new NextResponse(null, { status: 204 });
  }
  limitador.registrar(ip);

  if (corpoGrandeDemais(req.headers.get("content-length"), MAX_BODY_BYTES)) {
    return new NextResponse(null, { status: 204 });
  }

  try {
    const body = (await req.json().catch(() => ({}))) as Record<string, unknown>;

    if (!eventoValido(body.evento)) {
      return new NextResponse(null, { status: 204 });
    }

    await insertAnalyticsEvent({
      criadoEm: new Date().toISOString(),
      sessaoId: limpa(body.sessao, 80, "sem-sessao"),
      tipoEvento: body.evento,
      pagina: limpa(body.pagina, 120, "/"),
      elemento: limpaOuNulo(body.elemento, 120),
      oferta: limpaOuNulo(body.oferta, 120),
      etapa: inteiroOuNulo(body.etapa, 1, 10),
      utmSource: limpaOuNulo(body.utm_source, 120),
      utmMedium: limpaOuNulo(body.utm_medium, 120),
      utmCampaign: limpaOuNulo(body.utm_campaign, 160),
      utmContent: limpaOuNulo(body.utm_content, 160),
      utmTerm: limpaOuNulo(body.utm_term, 160),
      referrer: limpaOuNulo(body.referrer, 160),
      landingPage: limpaOuNulo(body.landing_page, 120),
    });
  } catch {
    // rastreamento nunca pode travar a navegação do visitante
  }

  return new NextResponse(null, { status: 204 });
}
