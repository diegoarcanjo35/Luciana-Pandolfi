import { NextRequest, NextResponse } from "next/server";
import { getCloudflareContext } from "@opennextjs/cloudflare";
import { insertLead } from "@/lib/db";
import { sendLeadEventServerSide } from "@/lib/meta-capi";

function str(value: unknown): string | null {
  if (typeof value !== "string") return null;
  const trimmed = value.trim();
  return trimmed.length ? trimmed : null;
}

export async function POST(req: NextRequest) {
  const body = (await req.json()) as Record<string, unknown>;

  const nome = str(body.nome) ?? "";
  const whatsapp = str(body.whatsapp) ?? "";
  const email = str(body.email);
  const formType = body.form_type === "qualificacao" ? "qualificacao" : "isca";
  const sourcePage = str(body.source_page) ?? "unknown";
  const campaign = str(body.campaign);
  const eventId = str(body.event_id);

  if (!nome || !whatsapp) {
    return NextResponse.json(
      { ok: false, error: "Nome e WhatsApp são obrigatórios." },
      { status: 400 }
    );
  }

  // Honeypot anti-spam: campo invisível que só bots preenchem.
  if (str(body.website)) {
    return NextResponse.json({ ok: true });
  }

  try {
    await insertLead({
      form_type: formType,
      source_page: sourcePage,
      campaign,
      nome,
      whatsapp,
      email,
      para_quem: str(body.para_quem),
      quantidade_pessoas: str(body.quantidade_pessoas),
      ja_tem_plano: str(body.ja_tem_plano),
      quando_resolver: str(body.quando_resolver),
      hospital_especifico: str(body.hospital_especifico),
      numero_vidas: str(body.numero_vidas),
      utm_source: str(body.utm_source),
      utm_medium: str(body.utm_medium),
      utm_campaign: str(body.utm_campaign),
      utm_content: str(body.utm_content),
      utm_term: str(body.utm_term),
    });
  } catch (err) {
    console.error("Falha ao gravar lead", err);
    return NextResponse.json(
      { ok: false, error: "Não foi possível salvar seus dados agora. Tente novamente." },
      { status: 500 }
    );
  }

  if (eventId) {
    const capiCall = sendLeadEventServerSide({
      eventId,
      eventSourceUrl: req.headers.get("referer") ?? `https://lucianapandolfi.com.br/${sourcePage}`,
      nome,
      whatsapp,
      email,
      campaign,
      clientIp: req.headers.get("cf-connecting-ip") ?? req.headers.get("x-forwarded-for"),
      clientUserAgent: req.headers.get("user-agent"),
    });
    // Não bloqueia a resposta ao usuário, mas usa waitUntil pra garantir que o
    // Worker não seja finalizado antes do envio ao CAPI completar.
    try {
      const { ctx } = await getCloudflareContext({ async: true });
      ctx.waitUntil(capiCall);
    } catch {
      await capiCall;
    }
  }

  return NextResponse.json({ ok: true });
}
