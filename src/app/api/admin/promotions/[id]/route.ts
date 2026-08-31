import { NextRequest, NextResponse } from "next/server";
import { requireRole } from "@/lib/auth";
import {
  getPromotionById,
  updatePromotionWithAudit,
  archivePromotionWithAudit,
  listPromotionAudit,
  type PromotionRow,
} from "@/lib/db";
import { validatePromotionInput, stripHtml, type PromotionInput } from "@/lib/promotions";

const REQUIRED_STRING_FIELDS = ["operator_name", "title", "short_description", "starts_at"] as const;

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

function parsePositiveIntId(raw: string): number | null {
  const id = Number(raw);
  if (!Number.isInteger(id) || id <= 0) return null;
  return id;
}

export async function GET(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const session = await requireRole(["superadmin", "admin"]);
  if (!session) {
    return NextResponse.json({ ok: false, error: "Não autenticado." }, { status: 401 });
  }
  const { id } = await params;
  const promotionId = parsePositiveIntId(id);
  if (promotionId === null) {
    return NextResponse.json({ ok: false, error: "ID inválido." }, { status: 400 });
  }
  const promotion = await getPromotionById(promotionId);
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
  const promotionId = parsePositiveIntId(id);
  if (promotionId === null) {
    return NextResponse.json({ ok: false, error: "ID inválido." }, { status: 400 });
  }

  const existing = await getPromotionById(promotionId);
  if (!existing) {
    return NextResponse.json({ ok: false, error: "Promoção não encontrada." }, { status: 404 });
  }

  const body = (await req.json().catch(() => null)) as Record<string, unknown> | null;
  if (!body) {
    return NextResponse.json({ ok: false, error: "Corpo da requisição inválido." }, { status: 400 });
  }

  // Campo obrigatório enviado explicitamente como null/vazio é erro do cliente (400),
  // nunca deve virar um UPDATE que grava NULL numa coluna NOT NULL (o que o D1
  // rejeitaria como 500 — ou pior, silenciosamente ficaria inconsistente).
  for (const field of REQUIRED_STRING_FIELDS) {
    if (field in body && str(body[field]) == null) {
      return NextResponse.json(
        { ok: false, error: `O campo "${field}" não pode ficar vazio.` },
        { status: 400 }
      );
    }
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
  setIfPresent("eligible_locations", str(body.eligible_locations));
  setIfPresent("starts_at", str(body.starts_at) as string | undefined);
  setIfPresent("ends_at", str(body.ends_at));
  setIfPresent("public_cta_label", str(body.public_cta_label));
  setIfPresent("public_cta_target", str(body.public_cta_target));
  setIfPresent("source_name", str(body.source_name));
  setIfPresent("source_reference", str(body.source_reference));
  setIfPresent("source_verified_at", str(body.source_verified_at));
  setIfPresent("internal_notes", str(body.internal_notes));

  if (body.minimum_lives !== undefined) {
    const v = num(body.minimum_lives);
    if (v !== null && !Number.isInteger(v)) {
      return NextResponse.json({ ok: false, error: "Número mínimo de vidas inválido." }, { status: 400 });
    }
    patch.minimum_lives = v ?? null;
  }
  if (body.maximum_lives !== undefined) {
    const v = num(body.maximum_lives);
    if (v !== null && !Number.isInteger(v)) {
      return NextResponse.json({ ok: false, error: "Número máximo de vidas inválido." }, { status: 400 });
    }
    patch.maximum_lives = v ?? null;
  }
  if (body.is_featured !== undefined) {
    if (typeof body.is_featured !== "boolean") {
      return NextResponse.json({ ok: false, error: "Destaque deve ser verdadeiro ou falso." }, { status: 400 });
    }
    patch.is_featured = body.is_featured ? 1 : 0;
  }
  if (body.display_order !== undefined) {
    const v = num(body.display_order);
    if (v === null || !Number.isInteger(v)) {
      return NextResponse.json({ ok: false, error: "Ordem de exibição inválida." }, { status: 400 });
    }
    patch.display_order = v;
  }

  let statusChanged = false;
  if (typeof body.status === "string" && ["draft", "active", "archived"].includes(body.status)) {
    statusChanged = body.status !== existing.status;
    patch.status = body.status as "draft" | "active" | "archived";
  } else if (body.status !== undefined) {
    return NextResponse.json({ ok: false, error: "Status inválido." }, { status: 400 });
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
    display_order: patch.display_order !== undefined ? patch.display_order : existing.display_order,
    is_featured: patch.is_featured !== undefined ? patch.is_featured === 1 : Boolean(existing.is_featured),
    public_cta_target: patch.public_cta_target !== undefined ? patch.public_cta_target : existing.public_cta_target,
  };
  const forPublish = merged.status === "active";
  const errors = validatePromotionInput(merged, { forPublish });
  if (errors.length) {
    return NextResponse.json({ ok: false, error: errors.join(" ") }, { status: 400 });
  }

  patch.updated_by = session.userId;

  if (patch.status === "archived" && existing.status !== "archived") {
    // Arquivamento tem seu próprio helper atômico (status + archived_at + auditoria numa
    // transação); aplica o resto do patch, se houver algo além do status, depois.
    await archivePromotionWithAudit(promotionId, {
      action: "archived",
      actorUserId: session.userId,
      actorName: session.name ?? "desconhecido",
    });
    const rest = { ...patch };
    delete rest.status;
    if (Object.keys(rest).length) {
      await updatePromotionWithAudit(promotionId, rest, {
        action: "updated",
        actorUserId: session.userId,
        actorName: session.name ?? "desconhecido",
      });
    }
  } else {
    const action = !statusChanged
      ? "updated"
      : patch.status === "active"
        ? "published"
        : patch.status === "draft"
          ? "deactivated"
          : "updated";
    await updatePromotionWithAudit(promotionId, patch, {
      action,
      actorUserId: session.userId,
      actorName: session.name ?? "desconhecido",
      details: statusChanged ? JSON.stringify({ from: existing.status, to: patch.status }) : undefined,
    });
  }

  return NextResponse.json({ ok: true });
}

export async function DELETE(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const session = await requireRole(["superadmin", "admin"]);
  if (!session) {
    return NextResponse.json({ ok: false, error: "Não autenticado." }, { status: 401 });
  }

  const { id } = await params;
  const promotionId = parsePositiveIntId(id);
  if (promotionId === null) {
    return NextResponse.json({ ok: false, error: "ID inválido." }, { status: 400 });
  }

  const existing = await getPromotionById(promotionId);
  if (!existing) {
    return NextResponse.json({ ok: false, error: "Promoção não encontrada." }, { status: 404 });
  }

  // "Remover" sempre arquiva — nunca apaga de verdade. O painel não expõe exclusão
  // definitiva; os dados e o histórico ficam sempre preservados.
  await archivePromotionWithAudit(promotionId, {
    action: "archived",
    actorUserId: session.userId,
    actorName: session.name ?? "desconhecido",
  });
  return NextResponse.json({ ok: true, archived: true });
}
