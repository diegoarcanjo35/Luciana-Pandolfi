"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import type { PromotionRow } from "@/lib/db";
import { computeEffectiveStatus, type EffectiveStatus } from "@/lib/promotions";

const FILTERS: { key: EffectiveStatus | "all"; label: string }[] = [
  { key: "all", label: "Todas" },
  { key: "active", label: "Ativa" },
  { key: "scheduled", label: "Agendada" },
  { key: "draft", label: "Rascunho" },
  { key: "expired", label: "Expirada" },
  { key: "archived", label: "Arquivada" },
];

const STATUS_LABEL: Record<EffectiveStatus, string> = {
  draft: "Rascunho",
  scheduled: "Agendada",
  active: "Ativa",
  expired: "Expirada",
  archived: "Arquivada",
};

const STATUS_BADGE: Record<EffectiveStatus, string> = {
  draft: "bg-slate-100 text-slate-600",
  scheduled: "bg-amber-100 text-amber-700",
  active: "bg-emerald-100 text-emerald-700",
  expired: "bg-rose-100 text-rose-700",
  archived: "bg-slate-200 text-slate-500",
};

type FormState = {
  id?: number;
  operator_name: string;
  title: string;
  short_description: string;
  benefit_type: string;
  benefit_value: string;
  full_conditions: string;
  eligible_products: string;
  eligible_audience: string;
  minimum_lives: string;
  maximum_lives: string;
  eligible_locations: string;
  starts_at: string;
  ends_at: string;
  status: "draft" | "active" | "archived";
  is_featured: boolean;
  display_order: string;
  public_cta_label: string;
  public_cta_target: string;
  source_name: string;
  source_reference: string;
  source_verified_at: string;
  internal_notes: string;
};

const EMPTY_FORM: FormState = {
  operator_name: "",
  title: "",
  short_description: "",
  benefit_type: "",
  benefit_value: "",
  full_conditions: "",
  eligible_products: "",
  eligible_audience: "",
  minimum_lives: "",
  maximum_lives: "",
  eligible_locations: "",
  starts_at: "",
  ends_at: "",
  status: "draft",
  is_featured: false,
  display_order: "0",
  public_cta_label: "Quero saber se me qualifico",
  public_cta_target: "#simulacao",
  source_name: "",
  source_reference: "",
  source_verified_at: "",
  internal_notes: "",
};

function rowToForm(row: PromotionRow): FormState {
  return {
    id: row.id,
    operator_name: row.operator_name,
    title: row.title,
    short_description: row.short_description,
    benefit_type: row.benefit_type ?? "",
    benefit_value: row.benefit_value ?? "",
    full_conditions: row.full_conditions ?? "",
    eligible_products: row.eligible_products ?? "",
    eligible_audience: row.eligible_audience ?? "",
    minimum_lives: row.minimum_lives?.toString() ?? "",
    maximum_lives: row.maximum_lives?.toString() ?? "",
    eligible_locations: row.eligible_locations ?? "",
    starts_at: row.starts_at,
    ends_at: row.ends_at ?? "",
    status: row.status,
    is_featured: Boolean(row.is_featured),
    display_order: row.display_order.toString(),
    public_cta_label: row.public_cta_label ?? "",
    public_cta_target: row.public_cta_target ?? "",
    source_name: row.source_name ?? "",
    source_reference: row.source_reference ?? "",
    source_verified_at: row.source_verified_at ?? "",
    internal_notes: row.internal_notes ?? "",
  };
}

export default function AdminPromotionsPage() {
  const [promotions, setPromotions] = useState<PromotionRow[]>([]);
  const [loading, setLoading] = useState(false);
  const [filter, setFilter] = useState<EffectiveStatus | "all">("all");
  const [operatorFilter, setOperatorFilter] = useState("all");
  const [formOpen, setFormOpen] = useState(false);
  const [form, setForm] = useState<FormState>(EMPTY_FORM);
  const [formError, setFormError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  const load = useCallback(async () => {
    setLoading(true);
    const res = await fetch("/api/admin/promotions");
    if (res.ok) {
      const data = (await res.json()) as { promotions: PromotionRow[] };
      setPromotions(data.promotions);
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const now = useMemo(() => new Date(), []);
  const withStatus = useMemo(
    () =>
      promotions.map((p) => ({
        ...p,
        effective: computeEffectiveStatus({ status: p.status, starts_at: p.starts_at, ends_at: p.ends_at }, now),
      })),
    [promotions, now]
  );

  const operators = useMemo(
    () => Array.from(new Set(promotions.map((p) => p.operator_name))).sort(),
    [promotions]
  );

  const filtered = withStatus.filter((p) => {
    if (filter !== "all" && p.effective !== filter) return false;
    if (operatorFilter !== "all" && p.operator_name !== operatorFilter) return false;
    return true;
  });

  function openNew() {
    setForm(EMPTY_FORM);
    setFormError(null);
    setFormOpen(true);
  }

  function openEdit(row: PromotionRow) {
    setForm(rowToForm(row));
    setFormError(null);
    setFormOpen(true);
  }

  async function handleSave(e: React.FormEvent) {
    e.preventDefault();
    setFormError(null);
    setSaving(true);

    const payload = {
      operator_name: form.operator_name,
      title: form.title,
      short_description: form.short_description,
      benefit_type: form.benefit_type || null,
      benefit_value: form.benefit_value || null,
      full_conditions: form.full_conditions || null,
      eligible_products: form.eligible_products || null,
      eligible_audience: form.eligible_audience || null,
      minimum_lives: form.minimum_lives ? Number(form.minimum_lives) : null,
      maximum_lives: form.maximum_lives ? Number(form.maximum_lives) : null,
      eligible_locations: form.eligible_locations || null,
      starts_at: form.starts_at,
      ends_at: form.ends_at || null,
      status: form.status,
      is_featured: form.is_featured,
      display_order: Number(form.display_order) || 0,
      public_cta_label: form.public_cta_label || null,
      public_cta_target: form.public_cta_target || null,
      source_name: form.source_name || null,
      source_reference: form.source_reference || null,
      source_verified_at: form.source_verified_at || null,
      internal_notes: form.internal_notes || null,
    };

    const url = form.id ? `/api/admin/promotions/${form.id}` : "/api/admin/promotions";
    const method = form.id ? "PATCH" : "POST";
    const res = await fetch(url, {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    setSaving(false);

    if (!res.ok) {
      const data = (await res.json().catch(() => null)) as { error?: string } | null;
      setFormError(data?.error ?? "Não foi possível salvar.");
      return;
    }

    setFormOpen(false);
    load();
  }

  async function handleStatusChange(row: PromotionRow, status: "draft" | "active" | "archived") {
    if (status === "archived") {
      const confirmed = window.confirm(
        `Arquivar "${row.title}"? Ela deixa de aparecer publicamente, mas os dados são preservados.`
      );
      if (!confirmed) return;
    }
    await fetch(`/api/admin/promotions/${row.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status }),
    });
    load();
  }

  const inputClass =
    "w-full rounded-lg border border-slate-300 px-3 py-2 text-sm outline-none focus:border-gold focus:ring-2 focus:ring-gold/20";
  const labelClass = "text-xs font-medium text-slate-600";

  return (
    <div className="mx-auto max-w-6xl">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="font-serif-display text-2xl font-semibold text-navy">Promoções</h1>
          <p className="text-sm text-slate-500">{promotions.length} cadastrada(s) ao todo</p>
          <p className="mt-1 text-xs text-slate-400">
            &ldquo;Arquivar&rdquo; nunca apaga — a promoção some da exibição pública, mas os dados e
            o histórico de alterações continuam disponíveis aqui.
          </p>
        </div>
        <button
          onClick={openNew}
          className="rounded-lg bg-gold px-4 py-2 text-sm font-semibold text-navy hover:bg-gold-light"
        >
          Nova promoção
        </button>
      </div>

      <div className="mt-4 flex flex-wrap gap-2">
        {FILTERS.map((f) => (
          <button
            key={f.key}
            onClick={() => setFilter(f.key)}
            className={`rounded-full px-3 py-1.5 text-xs font-medium ${
              filter === f.key ? "bg-navy text-cream" : "bg-white text-slate-600 border border-slate-200"
            }`}
          >
            {f.label}
          </button>
        ))}
        {operators.length > 0 && (
          <select
            value={operatorFilter}
            onChange={(e) => setOperatorFilter(e.target.value)}
            className="rounded-full border border-slate-200 bg-white px-3 py-1.5 text-xs font-medium text-slate-600"
            aria-label="Filtrar por operadora"
          >
            <option value="all">Todas as operadoras</option>
            {operators.map((op) => (
              <option key={op} value={op}>
                {op}
              </option>
            ))}
          </select>
        )}
      </div>

      <div className="mt-6 overflow-x-auto rounded-2xl border border-slate-200 bg-white">
        <table className="min-w-full divide-y divide-slate-200 text-sm">
          <thead className="bg-slate-50 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
            <tr>
              <th className="px-4 py-3">Operadora</th>
              <th className="px-4 py-3">Título</th>
              <th className="px-4 py-3">Situação</th>
              <th className="px-4 py-3">Início</th>
              <th className="px-4 py-3">Fim</th>
              <th className="px-4 py-3">Destaque</th>
              <th className="px-4 py-3">Ordem</th>
              <th className="px-4 py-3">Atualizada em</th>
              <th className="px-4 py-3">Ações</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {filtered.map((p) => (
              <tr key={p.id} className="hover:bg-slate-50">
                <td className="whitespace-nowrap px-4 py-3 font-medium text-navy">{p.operator_name}</td>
                <td className="px-4 py-3">{p.title}</td>
                <td className="whitespace-nowrap px-4 py-3">
                  <span className={`rounded-full px-2 py-1 text-xs font-medium ${STATUS_BADGE[p.effective]}`}>
                    {STATUS_LABEL[p.effective]}
                  </span>
                </td>
                <td className="whitespace-nowrap px-4 py-3 text-slate-500">{p.starts_at}</td>
                <td className="whitespace-nowrap px-4 py-3 text-slate-500">{p.ends_at ?? "—"}</td>
                <td className="whitespace-nowrap px-4 py-3">{p.is_featured ? "Sim" : "—"}</td>
                <td className="whitespace-nowrap px-4 py-3">{p.display_order}</td>
                <td className="whitespace-nowrap px-4 py-3 text-slate-400">
                  {new Date(p.updated_at + "Z").toLocaleString("pt-BR")}
                </td>
                <td className="whitespace-nowrap px-4 py-3">
                  <div className="flex flex-wrap gap-2">
                    <button
                      onClick={() => openEdit(p)}
                      className="rounded-md border border-slate-300 px-2 py-1 text-xs font-medium text-slate-700 hover:bg-slate-100"
                    >
                      Editar
                    </button>
                    {p.status !== "active" && p.status !== "archived" && (
                      <button
                        onClick={() => handleStatusChange(p, "active")}
                        className="rounded-md border border-emerald-300 px-2 py-1 text-xs font-medium text-emerald-700 hover:bg-emerald-50"
                      >
                        Publicar
                      </button>
                    )}
                    {p.status === "active" && (
                      <button
                        onClick={() => handleStatusChange(p, "draft")}
                        className="rounded-md border border-amber-300 px-2 py-1 text-xs font-medium text-amber-700 hover:bg-amber-50"
                      >
                        Desativar
                      </button>
                    )}
                    {p.status !== "archived" && (
                      <button
                        onClick={() => handleStatusChange(p, "archived")}
                        className="rounded-md border border-slate-300 px-2 py-1 text-xs font-medium text-slate-500 hover:bg-slate-100"
                      >
                        Arquivar
                      </button>
                    )}
                  </div>
                </td>
              </tr>
            ))}
            {!loading && filtered.length === 0 && (
              <tr>
                <td colSpan={9} className="px-4 py-10 text-center text-slate-400">
                  Nenhuma promoção encontrada com esses filtros.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {formOpen && (
        <div className="fixed inset-0 z-50 flex items-start justify-center overflow-y-auto bg-navy-deep/50 px-4 py-8">
          <form
            onSubmit={handleSave}
            className="w-full max-w-2xl rounded-2xl bg-white p-6 shadow-xl"
            aria-labelledby="promo-form-title"
          >
            <div className="flex items-center justify-between">
              <h2 id="promo-form-title" className="font-serif-display text-lg font-semibold text-navy">
                {form.id ? "Editar promoção" : "Nova promoção"}
              </h2>
              <button
                type="button"
                onClick={() => setFormOpen(false)}
                aria-label="Fechar"
                className="rounded-full p-1 text-slate-400 hover:bg-slate-100 hover:text-slate-600"
              >
                ✕
              </button>
            </div>

            <div className="mt-4 grid gap-3 sm:grid-cols-2">
              <div>
                <label className={labelClass} htmlFor="f-operator">
                  Operadora *
                </label>
                <input
                  id="f-operator"
                  required
                  value={form.operator_name}
                  onChange={(e) => setForm({ ...form, operator_name: e.target.value })}
                  className={inputClass}
                />
              </div>
              <div>
                <label className={labelClass} htmlFor="f-title">
                  Título *
                </label>
                <input
                  id="f-title"
                  required
                  value={form.title}
                  onChange={(e) => setForm({ ...form, title: e.target.value })}
                  className={inputClass}
                />
              </div>
              <div className="sm:col-span-2">
                <label className={labelClass} htmlFor="f-short">
                  Descrição pública *
                </label>
                <textarea
                  id="f-short"
                  required
                  rows={2}
                  value={form.short_description}
                  onChange={(e) => setForm({ ...form, short_description: e.target.value })}
                  className={inputClass}
                />
              </div>
              <div>
                <label className={labelClass} htmlFor="f-benefit-type">
                  Tipo de benefício
                </label>
                <input
                  id="f-benefit-type"
                  value={form.benefit_type}
                  onChange={(e) => setForm({ ...form, benefit_type: e.target.value })}
                  className={inputClass}
                />
              </div>
              <div>
                <label className={labelClass} htmlFor="f-benefit-value">
                  Valor do benefício
                </label>
                <input
                  id="f-benefit-value"
                  value={form.benefit_value}
                  onChange={(e) => setForm({ ...form, benefit_value: e.target.value })}
                  className={inputClass}
                />
              </div>
              <div className="sm:col-span-2">
                <label className={labelClass} htmlFor="f-conditions">
                  Condições completas {form.status === "active" && "*"}
                </label>
                <textarea
                  id="f-conditions"
                  rows={3}
                  required={form.status === "active"}
                  value={form.full_conditions}
                  onChange={(e) => setForm({ ...form, full_conditions: e.target.value })}
                  className={inputClass}
                />
              </div>
              <div>
                <label className={labelClass} htmlFor="f-products">
                  Produtos elegíveis
                </label>
                <input
                  id="f-products"
                  value={form.eligible_products}
                  onChange={(e) => setForm({ ...form, eligible_products: e.target.value })}
                  className={inputClass}
                />
              </div>
              <div>
                <label className={labelClass} htmlFor="f-audience">
                  Público elegível
                </label>
                <input
                  id="f-audience"
                  value={form.eligible_audience}
                  onChange={(e) => setForm({ ...form, eligible_audience: e.target.value })}
                  className={inputClass}
                />
              </div>
              <div>
                <label className={labelClass} htmlFor="f-min-lives">
                  Nº mínimo de vidas
                </label>
                <input
                  id="f-min-lives"
                  type="number"
                  min={0}
                  value={form.minimum_lives}
                  onChange={(e) => setForm({ ...form, minimum_lives: e.target.value })}
                  className={inputClass}
                />
              </div>
              <div>
                <label className={labelClass} htmlFor="f-max-lives">
                  Nº máximo de vidas
                </label>
                <input
                  id="f-max-lives"
                  type="number"
                  min={0}
                  value={form.maximum_lives}
                  onChange={(e) => setForm({ ...form, maximum_lives: e.target.value })}
                  className={inputClass}
                />
              </div>
              <div className="sm:col-span-2">
                <label className={labelClass} htmlFor="f-locations">
                  Praças/regiões elegíveis
                </label>
                <input
                  id="f-locations"
                  value={form.eligible_locations}
                  onChange={(e) => setForm({ ...form, eligible_locations: e.target.value })}
                  className={inputClass}
                />
              </div>
              <div>
                <label className={labelClass} htmlFor="f-starts">
                  Data inicial * (AAAA-MM-DD)
                </label>
                <input
                  id="f-starts"
                  type="date"
                  required
                  value={form.starts_at}
                  onChange={(e) => setForm({ ...form, starts_at: e.target.value })}
                  className={inputClass}
                />
              </div>
              <div>
                <label className={labelClass} htmlFor="f-ends">
                  Data final (opcional)
                </label>
                <input
                  id="f-ends"
                  type="date"
                  value={form.ends_at}
                  onChange={(e) => setForm({ ...form, ends_at: e.target.value })}
                  className={inputClass}
                />
              </div>
              <div>
                <label className={labelClass} htmlFor="f-status">
                  Status
                </label>
                <select
                  id="f-status"
                  value={form.status}
                  onChange={(e) => setForm({ ...form, status: e.target.value as FormState["status"] })}
                  className={inputClass}
                >
                  <option value="draft">Rascunho</option>
                  <option value="active">Publicada (ativa)</option>
                  <option value="archived">Arquivada</option>
                </select>
              </div>
              <div>
                <label className={labelClass} htmlFor="f-order">
                  Ordem de exibição
                </label>
                <input
                  id="f-order"
                  type="number"
                  value={form.display_order}
                  onChange={(e) => setForm({ ...form, display_order: e.target.value })}
                  className={inputClass}
                />
              </div>
              <div className="flex items-center gap-2 pt-5">
                <input
                  id="f-featured"
                  type="checkbox"
                  checked={form.is_featured}
                  onChange={(e) => setForm({ ...form, is_featured: e.target.checked })}
                  className="h-4 w-4"
                />
                <label htmlFor="f-featured" className="text-sm text-slate-600">
                  Destacar esta promoção
                </label>
              </div>
              <div>
                <label className={labelClass} htmlFor="f-cta-label">
                  Texto do CTA público
                </label>
                <input
                  id="f-cta-label"
                  value={form.public_cta_label}
                  onChange={(e) => setForm({ ...form, public_cta_label: e.target.value })}
                  className={inputClass}
                />
              </div>
              <div>
                <label className={labelClass} htmlFor="f-cta-target">
                  Destino do CTA
                </label>
                <input
                  id="f-cta-target"
                  value={form.public_cta_target}
                  onChange={(e) => setForm({ ...form, public_cta_target: e.target.value })}
                  placeholder="#simulacao"
                  className={inputClass}
                />
                <p className="mt-1 text-xs text-slate-400">
                  Só destinos internos: uma âncora (#simulacao) ou um caminho começando com /
                  (ex.: /plano-familiar#simulacao).
                </p>
              </div>
              <div className="sm:col-span-2">
                <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">
                  Só para a equipe (nunca aparece publicamente)
                </p>
              </div>
              <div>
                <label className={labelClass} htmlFor="f-source-name">
                  Fonte (referência administrativa)
                </label>
                <input
                  id="f-source-name"
                  value={form.source_name}
                  onChange={(e) => setForm({ ...form, source_name: e.target.value })}
                  className={inputClass}
                />
              </div>
              <div>
                <label className={labelClass} htmlFor="f-source-ref">
                  Link da fonte
                </label>
                <input
                  id="f-source-ref"
                  value={form.source_reference}
                  onChange={(e) => setForm({ ...form, source_reference: e.target.value })}
                  className={inputClass}
                />
              </div>
              <div className="sm:col-span-2">
                <label className={labelClass} htmlFor="f-notes">
                  Notas internas
                </label>
                <textarea
                  id="f-notes"
                  rows={2}
                  value={form.internal_notes}
                  onChange={(e) => setForm({ ...form, internal_notes: e.target.value })}
                  className={inputClass}
                />
              </div>
            </div>

            {formError && (
              <p role="alert" className="mt-3 text-sm text-red-600">
                {formError}
              </p>
            )}

            <div className="mt-5 flex justify-end gap-2">
              <button
                type="button"
                onClick={() => setFormOpen(false)}
                className="rounded-lg border border-slate-300 px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-100"
              >
                Cancelar
              </button>
              <button
                type="submit"
                disabled={saving}
                className="rounded-lg bg-navy px-4 py-2 text-sm font-semibold text-gold-light hover:bg-navy-light disabled:opacity-60"
              >
                {saving ? "Salvando..." : "Salvar"}
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}
