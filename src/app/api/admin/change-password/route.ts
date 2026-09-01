import { NextRequest, NextResponse } from "next/server";
import { changeOwnPassword, getSession } from "@/lib/auth";

export async function POST(req: NextRequest) {
  const session = await getSession();
  if (!session.authenticated || session.isLegacy || !session.userId) {
    // Acesso legado não tem conta própria em admin_users pra trocar senha.
    return NextResponse.json(
      { ok: false, error: "Ação não disponível para este tipo de acesso." },
      { status: 403 }
    );
  }

  const body = (await req.json().catch(() => null)) as
    | { currentPassword?: unknown; newPassword?: unknown }
    | null;
  const currentPassword = typeof body?.currentPassword === "string" ? body.currentPassword : "";
  const newPassword = typeof body?.newPassword === "string" ? body.newPassword : "";

  const result = await changeOwnPassword(session.userId, currentPassword, newPassword);
  if (!result.ok) {
    const error =
      result.error === "new_password_weak"
        ? "A nova senha precisa ter pelo menos 10 caracteres."
        : "Senha atual incorreta.";
    return NextResponse.json({ ok: false, error }, { status: 400 });
  }

  return NextResponse.json({ ok: true });
}
