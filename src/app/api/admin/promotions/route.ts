import { NextRequest, NextResponse } from "next/server";
import { requireRole } from "@/lib/auth";
import { listAllPromotions, createPromotionWithAudit } from "@/lib/db";
import { validatePromotionInput, slugify, stripHtml, type PromotionInput } from "@/lib/promotions";

export async function GET() {
  const session = await requireRole(["superadmin", "admin"]);
  if (!session) {
    return NextResponse.json({ ok: false, error: "Não autenticado." }, { status: 401 });
  }
  const promotions = await listAllPromotions();
  return NextResponse.json({ ok: true, promotions });
}

function str(value: unknown): string | null {
  if (typeof value !== "string") return null;
  const trimmed = stripHtml(value).trim();
  return trimmed.length ? trimmed : null;
}

function num(value: unknown): number | null {
  if (typeof value === "number" && Number.isFinite(value)) return value;
  if (typeof value === "string" && value.trim() && Number.isFinite(Number(value))) return Number(value);
  return null;
}

export async function POST(req: NextRequest) {
  const session = await requireRole(["superadmin", "admin"]);
  if (!session) {
    return NextResponse.json({ ok: false, error: "Não autenticado." }, { status: 401 });
  }

  const body = (await req.json().catch(() => null)) as Record<string, unknown> | null;
  if (!body) {
    return NextResponse.json({ ok: false, error: "Corpo da requisição inválido." }, { status: 400 });
  }

  const input: PromotionInput = {
    operator_name: str(body.operator_name) ?? undefined,
    title: str(body.title) ?? undefined,
    short_description: str(body.short_description) ?? undefined,
    full_conditions: str(body.full_conditions),
    starts_at: str(body.starts_at) ?? undefined,
    ends_at: str(body.ends_at),
    status: str(body.status) ?? "draft",
    minimum_lives: num(body.minimum_lives),
    maximum_lives: num(body.maximum_lives),
    display_order: body.display_order !== undefined ? (num(body.display_order) ?? NaN) : undefined,
    is_featured: body.is_featured,
    public_cta_target: str(body.public_cta_target),
  };

  const forPublish = input.status === "active";
  const errors = validatePromotionInput(input, { forPublish });
  if (errors.length) {
    return NextResponse.json({ ok: false, error: errors.join(" ") }, { status: 400 });
  }

  const baseSlug = slugify(str(body.slug) ?? input.title ?? "");
  if (!baseSlug) {
    return NextResponse.json({ ok: false, error: "Não foi possível gerar um slug a partir do título." }, { status: 400 });
  }
  const slug = `${baseSlug}-${Date.now().toString(36)}`;

  const actorId = session.userId;

  const id = await createPromotionWithAudit(
    {
      slug,
      operator_name: input.operator_name!,
      title: input.title!,
      short_description: input.short_description!,
      benefit_type: str(body.benefit_type),
      benefit_value: str(body.benefit_value),
      full_conditions: input.full_conditions ?? null,
      eligible_products: str(body.eligible_products),
      eligible_audience: str(body.eligible_audience),
      minimum_lives: input.minimum_lives ?? null,
      maximum_lives: input.maximum_lives ?? null,
      eligible_locations: str(body.eligible_locations),
      starts_at: input.starts_at!,
      ends_at: input.ends_at ?? null,
      status: (input.status as "draft" | "active" | "archived") ?? "draft",
      is_featured: input.is_featured === true ? 1 : 0,
      display_order: input.display_order ?? 0,
      public_cta_label: str(body.public_cta_label),
      public_cta_target: input.public_cta_target ?? "#simulacao",
      source_name: str(body.source_name),
      source_reference: str(body.source_reference),
      source_verified_at: str(body.source_verified_at),
      internal_notes: str(body.internal_notes),
      created_by: actorId,
      updated_by: actorId,
    },
    {
      action: "created",
      actorUserId: actorId,
      actorName: session.name ?? "desconhecido",
      details: JSON.stringify({ status: input.status ?? "draft" }),
    }
  );

  return NextResponse.json({ ok: true, id });
}
