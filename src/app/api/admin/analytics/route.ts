import { NextRequest, NextResponse } from "next/server";
import { isAuthenticated } from "@/lib/auth";
import { queryFunil, querySessoesTotais, queryPorCampanha } from "@/lib/db";

const DIAS_PADRAO = 7;

export async function GET(req: NextRequest) {
  const authed = await isAuthenticated();
  if (!authed) {
    return NextResponse.json({ ok: false, error: "Não autenticado." }, { status: 401 });
  }

  const diasParam = Number(req.nextUrl.searchParams.get("dias"));
  const dias = Number.isFinite(diasParam) && diasParam > 0 && diasParam <= 90 ? diasParam : DIAS_PADRAO;
  const sinceIso = new Date(Date.now() - dias * 24 * 60 * 60 * 1000).toISOString();

  const [funil, sessoes, campanhas] = await Promise.all([
    queryFunil(sinceIso),
    querySessoesTotais(sinceIso),
    queryPorCampanha(sinceIso),
  ]);

  return NextResponse.json({ ok: true, dias, sessoes, funil, campanhas });
}
