"use client";

import { useCallback, useEffect, useState } from "react";
import { useAdminSession } from "@/components/admin/AdminSessionContext";

interface AdminUserListItem {
  id: number;
  name: string;
  email: string;
  role: "superadmin" | "admin";
  status: "active" | "inactive";
  created_at: string;
  last_login_at: string | null;
}

export default function AdminUsersPage() {
  const session = useAdminSession();
  const [users, setUsers] = useState<AdminUserListItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [formOpen, setFormOpen] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState<"admin" | "superadmin">("admin");
  const [formError, setFormError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  const load = useCallback(async () => {
    setLoading(true);
    const res = await fetch("/api/admin/users");
    if (res.ok) {
      const data = (await res.json()) as { users: AdminUserListItem[] };
      setUsers(data.users);
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  if (session.role !== "superadmin") {
    return (
      <div className="mx-auto max-w-2xl rounded-2xl border border-slate-200 bg-white p-6 text-center text-slate-500">
        Esta área é restrita ao superadmin.
      </div>
    );
  }

  async function handleCreate(e: React.FormEvent) {
    e.preventDefault();
    setFormError(null);
    setSaving(true);
    const res = await fetch("/api/admin/users", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, email, password, role }),
    });
    setSaving(false);
    if (!res.ok) {
      const data = (await res.json().catch(() => null)) as { error?: string } | null;
      setFormError(data?.error ?? "Não foi possível criar a conta.");
      return;
    }
    setName("");
    setEmail("");
    setPassword("");
    setRole("admin");
    setFormOpen(false);
    load();
  }

  async function toggleStatus(user: AdminUserListItem) {
    const nextStatus = user.status === "active" ? "inactive" : "active";
    const confirmed = window.confirm(
      nextStatus === "inactive"
        ? `Desativar o acesso de ${user.name}?`
        : `Reativar o acesso de ${user.name}?`
    );
    if (!confirmed) return;
    await fetch(`/api/admin/users/${user.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status: nextStatus }),
    });
    load();
  }

  const inputClass =
    "w-full rounded-lg border border-slate-300 px-3 py-2 text-sm outline-none focus:border-gold focus:ring-2 focus:ring-gold/20";
  const labelClass = "text-xs font-medium text-slate-600";

  return (
    <div className="mx-auto max-w-4xl">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="font-serif-display text-2xl font-semibold text-navy">Usuários</h1>
          <p className="text-sm text-slate-500">Contas com acesso ao painel administrativo.</p>
        </div>
        <button
          onClick={() => setFormOpen((v) => !v)}
          className="rounded-lg bg-gold px-4 py-2 text-sm font-semibold text-navy hover:bg-gold-light"
        >
          {formOpen ? "Fechar" : "Nova conta"}
        </button>
      </div>

      {formOpen && (
        <form
          onSubmit={handleCreate}
          className="mt-4 grid gap-3 rounded-2xl border border-slate-200 bg-white p-5 sm:grid-cols-2"
        >
          <div>
            <label className={labelClass} htmlFor="u-name">
              Nome
            </label>
            <input
              id="u-name"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              className={inputClass}
            />
          </div>
          <div>
            <label className={labelClass} htmlFor="u-email">
              E-mail
            </label>
            <input
              id="u-email"
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className={inputClass}
            />
          </div>
          <div>
            <label className={labelClass} htmlFor="u-password">
              Senha (mínimo 10 caracteres)
            </label>
            <input
              id="u-password"
              type="password"
              required
              minLength={10}
              autoComplete="new-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className={inputClass}
            />
          </div>
          <div>
            <label className={labelClass} htmlFor="u-role">
              Papel
            </label>
            <select
              id="u-role"
              value={role}
              onChange={(e) => setRole(e.target.value as "admin" | "superadmin")}
              className={inputClass}
            >
              <option value="admin">Admin</option>
              <option value="superadmin">Superadmin</option>
            </select>
          </div>
          {formError && (
            <p role="alert" className="text-sm text-red-600 sm:col-span-2">
              {formError}
            </p>
          )}
          <p className="text-xs text-slate-400 sm:col-span-2">
            Combine a senha com a pessoa por um canal seguro (nunca por e-mail em texto simples,
            nunca aqui no chat/README). Ela pode ser trocada depois, se vocês decidirem implementar
            um fluxo de troca de senha própria.
          </p>
          <div className="sm:col-span-2">
            <button
              type="submit"
              disabled={saving}
              className="rounded-lg bg-navy px-4 py-2 text-sm font-semibold text-gold-light hover:bg-navy-light disabled:opacity-60"
            >
              {saving ? "Criando..." : "Criar conta"}
            </button>
          </div>
        </form>
      )}

      <div className="mt-6 overflow-x-auto rounded-2xl border border-slate-200 bg-white">
        <table className="min-w-full divide-y divide-slate-200 text-sm">
          <thead className="bg-slate-50 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
            <tr>
              <th className="px-4 py-3">Nome</th>
              <th className="px-4 py-3">E-mail</th>
              <th className="px-4 py-3">Papel</th>
              <th className="px-4 py-3">Status</th>
              <th className="px-4 py-3">Último acesso</th>
              <th className="px-4 py-3">Ações</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {users.map((u) => (
              <tr key={u.id} className="hover:bg-slate-50">
                <td className="whitespace-nowrap px-4 py-3 font-medium text-navy">{u.name}</td>
                <td className="whitespace-nowrap px-4 py-3">{u.email}</td>
                <td className="whitespace-nowrap px-4 py-3 capitalize">{u.role}</td>
                <td className="whitespace-nowrap px-4 py-3">
                  <span
                    className={`rounded-full px-2 py-1 text-xs font-medium ${
                      u.status === "active" ? "bg-emerald-100 text-emerald-700" : "bg-slate-100 text-slate-500"
                    }`}
                  >
                    {u.status === "active" ? "Ativo" : "Inativo"}
                  </span>
                </td>
                <td className="whitespace-nowrap px-4 py-3 text-slate-500">
                  {u.last_login_at ? new Date(u.last_login_at + "Z").toLocaleString("pt-BR") : "Nunca"}
                </td>
                <td className="whitespace-nowrap px-4 py-3">
                  <button
                    onClick={() => toggleStatus(u)}
                    className="rounded-md border border-slate-300 px-2 py-1 text-xs font-medium text-slate-700 hover:bg-slate-100"
                  >
                    {u.status === "active" ? "Desativar" : "Reativar"}
                  </button>
                </td>
              </tr>
            ))}
            {!loading && users.length === 0 && (
              <tr>
                <td colSpan={6} className="px-4 py-10 text-center text-slate-400">
                  Nenhuma conta cadastrada ainda — crie a primeira acima.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
