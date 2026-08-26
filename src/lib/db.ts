import { getCloudflareContext } from "@opennextjs/cloudflare";

export interface LeadInput {
  form_type: "isca" | "qualificacao";
  source_page: string;
  campaign?: string | null;
  nome: string;
  whatsapp: string;
  email?: string | null;
  para_quem?: string | null;
  quantidade_pessoas?: string | null;
  ja_tem_plano?: string | null;
  quando_resolver?: string | null;
  hospital_especifico?: string | null;
  numero_vidas?: string | null;
  utm_source?: string | null;
  utm_medium?: string | null;
  utm_campaign?: string | null;
  utm_content?: string | null;
  utm_term?: string | null;
}

export async function getDB() {
  const { env } = await getCloudflareContext({ async: true });
  return env.DB as D1Database;
}

export async function insertLead(lead: LeadInput) {
  const db = await getDB();
  await db
    .prepare(
      `INSERT INTO leads (
        form_type, source_page, campaign, nome, whatsapp, email,
        para_quem, quantidade_pessoas, ja_tem_plano, quando_resolver,
        hospital_especifico, numero_vidas,
        utm_source, utm_medium, utm_campaign, utm_content, utm_term
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`
    )
    .bind(
      lead.form_type,
      lead.source_page,
      lead.campaign ?? null,
      lead.nome,
      lead.whatsapp,
      lead.email ?? null,
      lead.para_quem ?? null,
      lead.quantidade_pessoas ?? null,
      lead.ja_tem_plano ?? null,
      lead.quando_resolver ?? null,
      lead.hospital_especifico ?? null,
      lead.numero_vidas ?? null,
      lead.utm_source ?? null,
      lead.utm_medium ?? null,
      lead.utm_campaign ?? null,
      lead.utm_content ?? null,
      lead.utm_term ?? null
    )
    .run();
}

export interface LeadRow extends LeadInput {
  id: number;
  created_at: string;
  status: string;
}

export async function listLeads(): Promise<LeadRow[]> {
  const db = await getDB();
  const { results } = await db
    .prepare(`SELECT * FROM leads ORDER BY created_at DESC LIMIT 500`)
    .all<LeadRow>();
  return results;
}
