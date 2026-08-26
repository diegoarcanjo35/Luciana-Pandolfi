"use client";

import { useCallback, useEffect, useState } from "react";
import type { LeadRow } from "@/lib/db";

export default function AdminPage() {
  const [authed, setAuthed] = useState<boolean | null>(null);
  const [password, setPassword] = useState("");
  const [loginError, setLoginError] = useState<string | null>(null);
  const [loginLoading, setLoginLoading] = useState(false);

  const [leads, setLeads] = useState<LeadRow[]>([]);
  const [loadingLeads, setLoadingLeads] = useState(false);

  const loadLeads = useCallback(async () => {
    setLoadingLeads(true);
    const res = await fetch("/api/admin/leads");
    if (res.status === 401) {
      setAuthed(false);
      setLoadingLeads(false);
      return;
    }
    const data = (await res.json()) as { leads?: LeadRow[] };
    setLeads(data.leads ?? []);
    setAuthed(true);
    setLoadingLeads(false);
  }, []);

  useEffect(() => {
    loadLeads();
  }, [loadLeads]);

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    setLoginError(null);
    setLoginLoading(true);
    const res = await fetch("/api/admin/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ password }),
    });
    setLoginLoading(false);
    if (!res.ok) {
      setLoginError("Senha incorreta.");
      return;
    }
    setPassword("");
    loadLeads();
  }

  async function handleLogout() {
    await fetch("/api/admin/logout", { method: "POST" });
    setAuthed(false);
    setLeads([]);
  }

  if (authed === null) {
    return <div className="p-8 text-center text-slate-500">Carregando...</div>;
  }

  if (!authed) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-50 px-4">
        <form
          onSubmit={handleLogin}
          className="w-full max-w-sm rounded-2xl border border-slate-200 bg-white p-6 shadow-sm"
        >
          <h1 className="font-serif-display text-xl font-semibold text-navy">
            Painel de leads
          </h1>
          <p className="mt-1 text-sm text-slate-500">Acesso restrito à equipe da Luciana.</p>
          <input
            type="password"
            required
            autoFocus
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Senha"
            className="mt-4 w-full rounded-lg border border-slate-300 px-4 py-3 text-base outline-none focus:border-gold focus:ring-2 focus:ring-gold/20"
          />
          {loginError && <p className="mt-2 text-sm text-red-600">{loginError}</p>}
          <button
            type="submit"
            disabled={loginLoading}
            className="mt-4 w-full rounded-lg bg-navy px-4 py-3 text-base font-semibold text-gold-light transition-colors hover:bg-navy-light disabled:opacity-60"
          >
            {loginLoading ? "Entrando..." : "Entrar"}
          </button>
        </form>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 px-4 py-8 sm:px-6">
      <div className="mx-auto max-w-7xl">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <h1 className="font-serif-display text-2xl font-semibold text-navy">
              Leads recebidos
            </h1>
            <p className="text-sm text-slate-500">{leads.length} registro(s) · mais recentes primeiro</p>
          </div>
          <div className="flex gap-2">
            <button
              onClick={loadLeads}
              className="rounded-lg border border-slate-300 px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-100"
            >
              Atualizar
            </button>
            <button
              onClick={handleLogout}
              className="rounded-lg border border-slate-300 px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-100"
            >
              Sair
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
                <th className="px-4 py-3">É para</th>
                <th className="px-4 py-3">Qtd. pessoas</th>
                <th className="px-4 py-3">Nº vidas</th>
                <th className="px-4 py-3">Já tem plano</th>
                <th className="px-4 py-3">Quando resolver</th>
                <th className="px-4 py-3">Hospital</th>
                <th className="px-4 py-3">UTM source</th>
                <th className="px-4 py-3">UTM campaign</th>
                <th className="px-4 py-3">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {leads.map((lead) => (
                <tr key={lead.id} className="hover:bg-slate-50">
                  <td className="whitespace-nowrap px-4 py-3 text-slate-500">
                    {new Date(lead.created_at + "Z").toLocaleString("pt-BR")}
                  </td>
                  <td className="whitespace-nowrap px-4 py-3 font-medium text-navy">
                    {lead.nome}
                  </td>
                  <td className="whitespace-nowrap px-4 py-3">{lead.whatsapp}</td>
                  <td className="whitespace-nowrap px-4 py-3">{lead.email ?? "—"}</td>
                  <td className="whitespace-nowrap px-4 py-3 capitalize">{lead.form_type}</td>
                  <td className="whitespace-nowrap px-4 py-3">{lead.source_page}</td>
                  <td className="whitespace-nowrap px-4 py-3">{lead.campaign ?? "—"}</td>
                  <td className="whitespace-nowrap px-4 py-3">{lead.para_quem ?? "—"}</td>
                  <td className="whitespace-nowrap px-4 py-3">{lead.quantidade_pessoas ?? "—"}</td>
                  <td className="whitespace-nowrap px-4 py-3">{lead.numero_vidas ?? "—"}</td>
                  <td className="whitespace-nowrap px-4 py-3">{lead.ja_tem_plano ?? "—"}</td>
                  <td className="whitespace-nowrap px-4 py-3">{lead.quando_resolver ?? "—"}</td>
                  <td className="whitespace-nowrap px-4 py-3">{lead.hospital_especifico ?? "—"}</td>
                  <td className="whitespace-nowrap px-4 py-3">{lead.utm_source ?? "—"}</td>
                  <td className="whitespace-nowrap px-4 py-3">{lead.utm_campaign ?? "—"}</td>
                  <td className="whitespace-nowrap px-4 py-3">{lead.status}</td>
                </tr>
              ))}
              {!loadingLeads && leads.length === 0 && (
                <tr>
                  <td colSpan={16} className="px-4 py-10 text-center text-slate-400">
                    Nenhum lead recebido ainda.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
