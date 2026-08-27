import { NextResponse } from "next/server";
import { getSession } from "@/lib/auth";

export async function GET() {
  const session = await getSession();
  if (!session.authenticated) {
    return NextResponse.json({ ok: false, error: "Não autenticado." }, { status: 401 });
  }
  return NextResponse.json({
    ok: true,
    role: session.role,
    name: session.name,
    isLegacy: session.isLegacy,
  });
}
