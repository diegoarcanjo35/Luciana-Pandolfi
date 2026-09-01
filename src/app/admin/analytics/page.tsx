"use client";

import { useCallback, useEffect, useState } from "react";
import { pivotarFunil } from "@/lib/analytics-funil";

interface AnalyticsResponse {
  ok: boolean;
  dias: number;
  sessoes: number;
  funil: { pagina: string; tipo_evento: string; n: number }[];
  campanhas: { utm_campaign: string | null; n: number }[];
}

const COLUNAS_FUNIL = [
  { chave: "page_view", label: "Visitas" },
  { chave: "section_view", label: "Rolou a página" },
  { chave: "cta_click", label: "Clicou CTA" },
  { chave: "whatsapp_click", label: "Clicou WhatsApp" },
  { chave: "form_start", label: "Começou form." },
  { chave: "form_submit", label: "Enviou form." },
];

export default function AdminAnalyticsPage() {
  const [data, setData] = useState<AnalyticsResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [dias, setDias] = useState(7);

  const load = useCallback(async (d: number) => {
    setLoading(true);
    const res = await fetch(`/api/admin/analytics?dias=${d}`);
    if (res.ok) {
      const json = (await res.json()) as AnalyticsResponse;
      setData(json);
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    load(dias);
  }, [load, dias]);

  const funilPivotado = data ? pivotarFunil(data.funil) : {};
  const paginas = Object.keys(funilPivotado).sort();

  return (
    <div className="mx-auto max-w-5xl">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="font-serif-display text-2xl font-semibold text-navy">Analytics</h1>
          <p className="text-sm text-slate-500">
            Sessão pseudônima, própria do site — não substitui o Meta Ads/Pixel, é um funil
            interno ligado às suas páginas e formulários.
          </p>
        </div>
        <select
          value={dias}
          onChange={(e) => setDias(Number(e.target.value))}
          className="rounded-lg border border-slate-300 px-3 py-2 text-sm"
        >
          <option value={1}>Últimas 24h</option>
          <option value={7}>Últimos 7 dias</option>
          <option value={30}>Últimos 30 dias</option>
          <option value={90}>Últimos 90 dias</option>
        </select>
      </div>

      <div className="mt-6 rounded-2xl border border-slate-200 bg-white p-6">
        <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
          Sessões (visitas únicas)
        </p>
        <p className="mt-1 text-3xl font-semibold text-navy">
          {loading ? "…" : (data?.sessoes ?? 0)}
        </p>
      </div>

      <div className="mt-6 overflow-x-auto rounded-2xl border border-slate-200 bg-white">
        <table className="min-w-full divide-y divide-slate-200 text-sm">
          <thead className="bg-slate-50 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
            <tr>
              <th className="px-4 py-3">Página</th>
              {COLUNAS_FUNIL.map((c) => (
                <th key={c.chave} className="px-4 py-3">
                  {c.label}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {paginas.map((pagina) => (
              <tr key={pagina} className="hover:bg-slate-50">
                <td className="whitespace-nowrap px-4 py-3 font-medium text-navy">{pagina}</td>
                {COLUNAS_FUNIL.map((c) => (
                  <td key={c.chave} className="whitespace-nowrap px-4 py-3 text-slate-600">
                    {funilPivotado[pagina]?.[c.chave] ?? "—"}
                  </td>
                ))}
              </tr>
            ))}
            {!loading && paginas.length === 0 && (
              <tr>
                <td colSpan={COLUNAS_FUNIL.length + 1} className="px-4 py-10 text-center text-slate-400">
                  Nenhum evento registrado ainda no período.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <div className="mt-6 overflow-x-auto rounded-2xl border border-slate-200 bg-white">
        <table className="min-w-full divide-y divide-slate-200 text-sm">
          <thead className="bg-slate-50 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
            <tr>
              <th className="px-4 py-3">Campanha (UTM)</th>
              <th className="px-4 py-3">Visitas</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {(data?.campanhas ?? []).map((c) => (
              <tr key={c.utm_campaign ?? "sem-utm"} className="hover:bg-slate-50">
                <td className="whitespace-nowrap px-4 py-3 text-navy">
                  {c.utm_campaign ?? "Sem UTM (direto/orgânico)"}
                </td>
                <td className="whitespace-nowrap px-4 py-3 text-slate-600">{c.n}</td>
              </tr>
            ))}
            {!loading && (data?.campanhas ?? []).length === 0 && (
              <tr>
                <td colSpan={2} className="px-4 py-10 text-center text-slate-400">
                  Nenhuma visita registrada ainda no período.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
