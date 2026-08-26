import { NextRequest, NextResponse } from "next/server";
import { insertLead } from "@/lib/db";

function str(value: unknown): string | null {
  if (typeof value !== "string") return null;
  const trimmed = value.trim();
  return trimmed.length ? trimmed : null;
}

export async function POST(req: NextRequest) {
  const body = (await req.json()) as Record<string, unknown>;

  const nome = str(body.nome) ?? "";
  const whatsapp = str(body.whatsapp) ?? "";
  const formType = body.form_type === "qualificacao" ? "qualificacao" : "isca";
  const sourcePage = str(body.source_page) ?? "unknown";

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
      campaign: str(body.campaign),
      nome,
      whatsapp,
      email: str(body.email),
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

  return NextResponse.json({ ok: true });
}
