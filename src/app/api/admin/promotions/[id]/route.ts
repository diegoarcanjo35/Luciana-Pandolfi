import { NextRequest, NextResponse } from "next/server";
import { requireRole } from "@/lib/auth";
import {
  getPromotionById,
  updatePromotion,
  archivePromotion,
  deletePromotionPermanently,
  logPromotionAudit,
  listPromotionAudit,
  type PromotionRow,
} from "@/lib/db";
import { validatePromotionInput, stripHtml, type PromotionInput } from "@/lib/promotions";

function str(value: unknown): string | null | undefined {
  if (value === undefined) return undefined;
  if (typeof value !== "string") return null;
  const trimmed = stripHtml(value).trim();
  return trimmed.length ? trimmed : null;
}

function num(value: unknown): number | null | undefined {
  if (value === undefined) return undefined;
  if (typeof value === "number" && Number.isFinite(value)) return value;
  if (typeof value === "string" && value.trim() && Number.isFinite(Number(value))) return Number(value);
  return null;
}

export async function GET(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const session = await requireRole(["superadmin", "admin"]);
  if (!session) {
    return NextResponse.json({ ok: false, error: "Não autenticado." }, { status: 401 });
  }
  const { id } = await params;
  const promotion = await getPromotionById(Number(id));
  if (!promotion) {
    return NextResponse.json({ ok: false, error: "Promoção não encontrada." }, { status: 404 });
  }
  const history = await listPromotionAudit(promotion.id);
  return NextResponse.json({ ok: true, promotion, history });
}

export async function PATCH(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const session = await requireRole(["superadmin", "admin"]);
  if (!session) {
    return NextResponse.json({ ok: false, error: "Não autenticado." }, { status: 401 });
  }

  const { id } = await params;
  const promotionId = Number(id);
  const existing = await getPromotionById(promotionId);
  if (!existing) {
    return NextResponse.json({ ok: false, error: "Promoção não encontrada." }, { status: 404 });
  }

  const body = (await req.json().catch(() => null)) as Record<string, unknown> | null;
  if (!body) {
    return NextResponse.json({ ok: false, error: "Corpo da requisição inválido." }, { status: 400 });
  }

  const patch: Partial<PromotionRow> = {};
  const setIfPresent = <K extends keyof PromotionRow>(key: K, value: PromotionRow[K] | undefined) => {
    if (value !== undefined) patch[key] = value;
  };

  setIfPresent("operator_name", str(body.operator_name) as string | undefined);
  setIfPresent("title", str(body.title) as string | undefined);
  setIfPresent("short_description", str(body.short_description) as string | undefined);
  setIfPresent("benefit_type", str(body.benefit_type));
  setIfPresent("benefit_value", str(body.benefit_value));
  setIfPresent("full_conditions", str(body.full_conditions));
  setIfPresent("eligible_products", str(body.eligible_products));
  setIfPresent("eligible_audience", str(body.eligible_audience));
  setIfPresent("minimum_lives", num(body.minimum_lives));
  setIfPresent("maximum_lives", num(body.maximum_lives));
  setIfPresent("eligible_locations", str(body.eligible_locations));
  setIfPresent("starts_at", str(body.starts_at) as string | undefined);
  setIfPresent("ends_at", str(body.ends_at));
  setIfPresent("public_cta_label", str(body.public_cta_label));
  setIfPresent("public_cta_target", str(body.public_cta_target));
  setIfPresent("source_name", str(body.source_name));
  setIfPresent("source_reference", str(body.source_reference));
  setIfPresent("source_verified_at", str(body.source_verified_at));
  setIfPresent("internal_notes", str(body.internal_notes));
  if (typeof body.is_featured === "boolean") patch.is_featured = body.is_featured ? 1 : 0;
  if (body.display_order !== undefined) patch.display_order = num(body.display_order) ?? 0;

  let statusChanged = false;
  if (typeof body.status === "string" && ["draft", "active", "archived"].includes(body.status)) {
    statusChanged = body.status !== existing.status;
    patch.status = body.status as "draft" | "active" | "archived";
  }

  const merged: PromotionInput = {
    operator_name: (patch.operator_name ?? existing.operator_name) || undefined,
    title: (patch.title ?? existing.title) || undefined,
    short_description: (patch.short_description ?? existing.short_description) || undefined,
    starts_at: (patch.starts_at ?? existing.starts_at) || undefined,
    ends_at: patch.ends_at !== undefined ? patch.ends_at : existing.ends_at,
    status: patch.status ?? existing.status,
    minimum_lives: patch.minimum_lives !== undefined ? patch.minimum_lives : existing.minimum_lives,
    maximum_lives: patch.maximum_lives !== undefined ? patch.maximum_lives : existing.maximum_lives,
    full_conditions: patch.full_conditions !== undefined ? patch.full_conditions : existing.full_conditions,
  };
  const forPublish = merged.status === "active";
  const errors = validatePromotionInput(merged, { forPublish });
  if (errors.length) {
    return NextResponse.json({ ok: false, error: errors.join(" ") }, { status: 400 });
  }

  patch.updated_by = session.userId;
  if (patch.status === "archived" && existing.status !== "archived") {
    await archivePromotion(promotionId);
    await logPromotionAudit({
      promotionId,
      action: "archived",
      actorUserId: session.userId,
      actorName: session.name ?? "desconhecido",
    });
    // archivePromotion já cobre status/archived_at — aplica o resto do patch além disso
    const rest = { ...patch };
    delete rest.status;
    if (Object.keys(rest).length) await updatePromotion(promotionId, rest);
  } else {
    await updatePromotion(promotionId, patch);
    if (statusChanged) {
      const action =
        patch.status === "active"
          ? "published"
          : patch.status === "draft"
            ? "deactivated"
            : "updated";
      await logPromotionAudit({
        promotionId,
        action,
        actorUserId: session.userId,
        actorName: session.name ?? "desconhecido",
        details: JSON.stringify({ from: existing.status, to: patch.status }),
      });
    } else {
      await logPromotionAudit({
        promotionId,
        action: "updated",
        actorUserId: session.userId,
        actorName: session.name ?? "desconhecido",
      });
    }
  }

  return NextResponse.json({ ok: true });
}

export async function DELETE(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const session = await requireRole(["superadmin", "admin"]);
  if (!session) {
    return NextResponse.json({ ok: false, error: "Não autenticado." }, { status: 401 });
  }

  const { id } = await params;
  const promotionId = Number(id);
  const existing = await getPromotionById(promotionId);
  if (!existing) {
    return NextResponse.json({ ok: false, error: "Promoção não encontrada." }, { status: 404 });
  }

  const hard = new URL(req.url).searchParams.get("hard") === "true";
  if (hard) {
    if (session.role !== "superadmin") {
      return NextResponse.json(
        { ok: false, error: "Exclusão definitiva é restrita ao superadmin." },
        { status: 403 }
      );
    }
    await logPromotionAudit({
      promotionId,
      action: "deleted_permanently",
      actorUserId: session.userId,
      actorName: session.name ?? "desconhecido",
    });
    await deletePromotionPermanently(promotionId);
    return NextResponse.json({ ok: true, hardDeleted: true });
  }

  // Padrão: arquiva, nunca exclui de verdade.
  await archivePromotion(promotionId);
  await logPromotionAudit({
    promotionId,
    action: "archived",
    actorUserId: session.userId,
    actorName: session.name ?? "desconhecido",
  });
  return NextResponse.json({ ok: true, archived: true });
}
