import { NextRequest, NextResponse } from "next/server";
import { requireRole } from "@/lib/auth";
import { getAdminUserById, updateAdminUserStatus, countSuperadmins } from "@/lib/db";
import { canDeactivateUser } from "@/lib/admin-users";

export async function PATCH(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const session = await requireRole(["superadmin"]);
  if (!session) {
    return NextResponse.json({ ok: false, error: "Acesso restrito ao superadmin." }, { status: 403 });
  }

  const { id } = await params;
  const userId = Number(id);
  if (!Number.isInteger(userId) || userId <= 0) {
    return NextResponse.json({ ok: false, error: "ID inválido." }, { status: 400 });
  }

  const body = (await req.json().catch(() => null)) as { status?: unknown } | null;
  const status = body?.status === "active" ? "active" : body?.status === "inactive" ? "inactive" : null;
  if (!status) {
    return NextResponse.json({ ok: false, error: "Status inválido." }, { status: 400 });
  }

  const target = await getAdminUserById(userId);
  if (!target) {
    return NextResponse.json({ ok: false, error: "Conta não encontrada." }, { status: 404 });
  }

  if (status === "inactive") {
    const activeSuperadmins = await countSuperadmins();
    const check = canDeactivateUser(target, session.userId, activeSuperadmins);
    if (!check.allowed) {
      return NextResponse.json({ ok: false, error: check.reason }, { status: 400 });
    }
  }

  await updateAdminUserStatus(userId, status);
  return NextResponse.json({ ok: true });
}
