import { NextResponse } from "next/server";
import { isAuthenticated } from "@/lib/auth";
import { listLeads } from "@/lib/db";

export async function GET() {
  const authed = await isAuthenticated();
  if (!authed) {
    return NextResponse.json({ ok: false, error: "Não autenticado." }, { status: 401 });
  }

  const leads = await listLeads();
  return NextResponse.json({ ok: true, leads });
}
