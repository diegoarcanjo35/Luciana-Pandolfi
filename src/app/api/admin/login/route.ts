import { NextRequest, NextResponse } from "next/server";
import { createSessionCookie, verifyPassword } from "@/lib/auth";

export async function POST(req: NextRequest) {
  const body = (await req.json().catch(() => null)) as { password?: unknown } | null;
  const password = typeof body?.password === "string" ? body.password : "";

  const ok = await verifyPassword(password);
  if (!ok) {
    return NextResponse.json({ ok: false, error: "Senha incorreta." }, { status: 401 });
  }

  await createSessionCookie();
  return NextResponse.json({ ok: true });
}
