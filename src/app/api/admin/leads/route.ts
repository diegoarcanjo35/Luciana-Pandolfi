import { NextResponse } from "next/server";
import { isAuthenticated } from "@/lib/auth";
import { listLeads } from "@/lib/db";

// Sempre buscar do banco na hora — sem isso, o botão "Atualizar" do painel
// pode acabar servindo uma resposta em cache (Cloudflare/navegador) e parecer
// que não fez nada.
export const dynamic = "force-dynamic";

export async function GET() {
  const authed = await isAuthenticated();
  if (!authed) {
    return NextResponse.json({ ok: false, error: "Não autenticado." }, { status: 401 });
  }

  const leads = await listLeads();
  return NextResponse.json(
    { ok: true, leads },
    { headers: { "Cache-Control": "no-store" } }
  );
}
