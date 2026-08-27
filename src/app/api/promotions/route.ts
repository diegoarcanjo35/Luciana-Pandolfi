import { NextResponse } from "next/server";
import { listActivePromotionsRaw } from "@/lib/db";
import { isPubliclyVisible } from "@/lib/promotions";

// Endpoint público — só devolve campos seguros pra exibição ao consumidor.
// Nunca inclui internal_notes, source_name, source_reference, created_by/updated_by
// ou qualquer coisa que exponha remuneração de corretor ou fonte administrativa interna.
export async function GET() {
  const now = new Date();
  try {
    const rows = await listActivePromotionsRaw();
    const visible = rows
      .filter((p) => isPubliclyVisible({ status: p.status, starts_at: p.starts_at, ends_at: p.ends_at }, now))
      .sort((a, b) => a.display_order - b.display_order)
      .map((p) => ({
        slug: p.slug,
        operator_name: p.operator_name,
        title: p.title,
        short_description: p.short_description,
        benefit_type: p.benefit_type,
        benefit_value: p.benefit_value,
        eligible_products: p.eligible_products,
        eligible_audience: p.eligible_audience,
        eligible_locations: p.eligible_locations,
        starts_at: p.starts_at,
        ends_at: p.ends_at,
        is_featured: Boolean(p.is_featured),
        public_cta_label: p.public_cta_label ?? "Quero saber se me qualifico",
        public_cta_target: p.public_cta_target ?? "#simulacao",
      }));
    return NextResponse.json({ ok: true, promotions: visible });
  } catch (err) {
    console.error("Falha ao buscar promoções em /api/promotions.", err);
    return NextResponse.json({ ok: true, promotions: [] });
  }
}
