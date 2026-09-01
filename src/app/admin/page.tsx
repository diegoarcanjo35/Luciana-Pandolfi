"use client";

import { useCallback, useEffect, useState } from "react";
import type { LeadRow } from "@/lib/db";

const STATUS_OPTIONS: { value: string; label: string }[] = [
  { value: "novo", label: "Novo" },
  { value: "em_contato", label: "Em contato" },
  { value: "qualificado", label: "Qualificado" },
  { value: "convertido", label: "Convertido" },
  { value: "perdido", label: "Perdido" },
];

const EXPORT_COLUMNS: { header: string; get: (lead: LeadRow) => string | number }[] = [
  { header: "Data", get: (l) => new Date(l.created_at + "Z").toLocaleString("pt-BR") },
  { header: "Nome", get: (l) => l.nome },
  { header: "WhatsApp", get: (l) => l.whatsapp },
  { header: "E-mail", get: (l) => l.email ?? "" },
  { header: "Tipo", get: (l) => l.form_type },
  { header: "Página", get: (l) => l.source_page },
  { header: "Campanha", get: (l) => l.campaign ?? "" },
  { header: "Promoção", get: (l) => l.promotion_slug ?? "" },
  { header: "É para", get: (l) => l.para_quem ?? "" },
  { header: "Qtd. pessoas", get: (l) => l.quantidade_pessoas ?? "" },
  { header: "Nº vidas", get: (l) => l.numero_vidas ?? "" },
  { header: "CNPJ/MEI ativo", get: (l) => l.cnpj_ativo ?? "" },
  { header: "Já tem plano", get: (l) => l.ja_tem_plano ?? "" },
  { header: "Quando resolver", get: (l) => l.quando_resolver ?? "" },
  { header: "Hospital", get: (l) => l.hospital_especifico ?? "" },
  { header: "UTM source", get: (l) => l.utm_source ?? "" },
  { header: "UTM campaign", get: (l) => l.utm_campaign ?? "" },
  { header: "Criativo (UTM content)", get: (l) => l.utm_content ?? "" },
  {
    header: "Status",
    get: (l) => STATUS_OPTIONS.find((s) => s.value === l.status)?.label ?? l.status,
  },
];

export default function AdminLeadsPage() {
  const [leads, setLeads] = useState<LeadRow[]>([]);
  const [loadingLeads, setLoadingLeads] = useState(false);
  const [savingId, setSavingId] = useState<number | null>(null);
  const [exporting, setExporting] = useState(false);

  const loadLeads = useCallback(async () => {
    setLoadingLeads(true);
    const res = await fetch("/api/admin/leads", { cache: "no-store" });
    if (res.ok) {
      const data = (await res.json()) as { leads?: LeadRow[] };
      setLeads(data.leads ?? []);
    }
    setLoadingLeads(false);
  }, []);

  useEffect(() => {
    loadLeads();
  }, [loadLeads]);

  async function handleStatusChange(id: number, status: string) {
    const anterior = leads;
    setLeads((prev) => prev.map((l) => (l.id === id ? { ...l, status } : l)));
    setSavingId(id);
    try {
      const res = await fetch(`/api/admin/leads/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status }),
      });
      if (!res.ok) throw new Error("Falha ao salvar status");
    } catch {
      setLeads(anterior);
      alert("Não foi possível salvar o status agora. Tente novamente.");
    } finally {
      setSavingId(null);
    }
  }

  async function handleDelete(id: number, nome: string) {
    if (!confirm(`Excluir o lead de "${nome}"? Essa ação não pode ser desfeita.`)) return;
    const anterior = leads;
    setLeads((prev) => prev.filter((l) => l.id !== id));
    try {
      const res = await fetch(`/api/admin/leads/${id}`, { method: "DELETE" });
      if (!res.ok) throw new Error("Falha ao excluir");
    } catch {
      setLeads(anterior);
      alert("Não foi possível excluir agora. Tente novamente.");
    }
  }

  async function handleExport() {
    setExporting(true);
    try {
      const XLSX = await import("xlsx");
      const rows = leads.map((lead) =>
        Object.fromEntries(EXPORT_COLUMNS.map((col) => [col.header, col.get(lead)]))
      );
      const sheet = XLSX.utils.json_to_sheet(rows, {
        header: EXPORT_COLUMNS.map((c) => c.header),
      });
      sheet["!cols"] = EXPORT_COLUMNS.map((col) => ({
        wch: Math.max(col.header.length + 2, 14),
      }));
      const workbook = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(workbook, sheet, "Leads");
      const data = new Date().toISOString().slice(0, 10);
      XLSX.writeFile(workbook, `leads-l-e-j-consultoria-${data}.xlsx`);
    } finally {
      setExporting(false);
    }
  }

  return (
    <div className="mx-auto max-w-7xl">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="font-serif-display text-2xl font-semibold text-navy">Leads recebidos</h1>
          <p className="text-sm text-slate-500">{leads.length} registro(s) · mais recentes primeiro</p>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={handleExport}
            disabled={exporting || leads.length === 0}
            className="rounded-lg border border-slate-300 px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-100 disabled:opacity-50"
          >
            {exporting ? "Gerando..." : "Exportar .xlsx"}
          </button>
          <button
            onClick={loadLeads}
            disabled={loadingLeads}
            className="rounded-lg border border-slate-300 px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-100 disabled:opacity-50"
          >
            {loadingLeads ? "Atualizando..." : "Atualizar"}
          </button>
        </div>
      </div>

      <div className="mt-6 overflow-x-auto rounded-2xl border border-slate-200 bg-white">
        <table className="min-w-full divide-y divide-slate-200 text-sm">
          <thead className="bg-slate-50 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
            <tr>
              <th className="px-4 py-3">Data</th>
              <th className="px-4 py-3">Nome</th>
              <th className="px-4 py-3">WhatsApp</th>
              <th className="px-4 py-3">E-mail</th>
              <th className="px-4 py-3">Tipo</th>
              <th className="px-4 py-3">Página</th>
              <th className="px-4 py-3">Campanha</th>
              <th className="px-4 py-3">Promoção</th>
              <th className="px-4 py-3">É para</th>
              <th className="px-4 py-3">Qtd. pessoas</th>
              <th className="px-4 py-3">Nº vidas</th>
              <th className="px-4 py-3">CNPJ/MEI ativo</th>
              <th className="px-4 py-3">Já tem plano</th>
              <th className="px-4 py-3">Quando resolver</th>
              <th className="px-4 py-3">Hospital</th>
              <th className="px-4 py-3">UTM source</th>
              <th className="px-4 py-3">UTM campaign</th>
              <th className="px-4 py-3">Criativo (UTM content)</th>
              <th className="px-4 py-3">Status</th>
              <th className="px-4 py-3"></th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {leads.map((lead) => (
              <tr key={lead.id} className="hover:bg-slate-50">
                <td className="whitespace-nowrap px-4 py-3 text-slate-500">
                  {new Date(lead.created_at + "Z").toLocaleString("pt-BR")}
                </td>
                <td className="whitespace-nowrap px-4 py-3 font-medium text-navy">{lead.nome}</td>
                <td className="whitespace-nowrap px-4 py-3">{lead.whatsapp}</td>
                <td className="whitespace-nowrap px-4 py-3">{lead.email ?? "—"}</td>
                <td className="whitespace-nowrap px-4 py-3 capitalize">{lead.form_type}</td>
                <td className="whitespace-nowrap px-4 py-3">{lead.source_page}</td>
                <td className="whitespace-nowrap px-4 py-3">{lead.campaign ?? "—"}</td>
                <td className="whitespace-nowrap px-4 py-3">{lead.promotion_slug ?? "—"}</td>
                <td className="whitespace-nowrap px-4 py-3">{lead.para_quem ?? "—"}</td>
                <td className="whitespace-nowrap px-4 py-3">{lead.quantidade_pessoas ?? "—"}</td>
                <td className="whitespace-nowrap px-4 py-3">{lead.numero_vidas ?? "—"}</td>
                <td className="whitespace-nowrap px-4 py-3">{lead.cnpj_ativo ?? "—"}</td>
                <td className="whitespace-nowrap px-4 py-3">{lead.ja_tem_plano ?? "—"}</td>
                <td className="whitespace-nowrap px-4 py-3">{lead.quando_resolver ?? "—"}</td>
                <td className="whitespace-nowrap px-4 py-3">{lead.hospital_especifico ?? "—"}</td>
                <td className="whitespace-nowrap px-4 py-3">{lead.utm_source ?? "—"}</td>
                <td className="whitespace-nowrap px-4 py-3">{lead.utm_campaign ?? "—"}</td>
                <td className="whitespace-nowrap px-4 py-3">{lead.utm_content ?? "—"}</td>
                <td className="whitespace-nowrap px-4 py-3">
                  <select
                    value={lead.status}
                    disabled={savingId === lead.id}
                    onChange={(e) => handleStatusChange(lead.id, e.target.value)}
                    className="rounded-md border border-slate-300 bg-white px-2 py-1.5 text-xs font-medium text-navy outline-none focus:border-gold focus:ring-1 focus:ring-gold/30 disabled:opacity-50"
                  >
                    {STATUS_OPTIONS.map((opt) => (
                      <option key={opt.value} value={opt.value}>
                        {opt.label}
                      </option>
                    ))}
                  </select>
                </td>
                <td className="whitespace-nowrap px-4 py-3">
                  <button
                    onClick={() => handleDelete(lead.id, lead.nome)}
                    className="text-xs font-medium text-red-600 hover:underline"
                  >
                    Excluir
                  </button>
                </td>
              </tr>
            ))}
            {!loadingLeads && leads.length === 0 && (
              <tr>
                <td colSpan={20} className="px-4 py-10 text-center text-slate-400">
                  Nenhum lead recebido ainda.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
