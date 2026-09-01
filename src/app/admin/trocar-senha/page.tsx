"use client";

import { useState, type FormEvent } from "react";
import { useAdminSession } from "@/components/admin/AdminSessionContext";

export default function TrocarSenhaPage() {
  const session = useAdminSession();
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError(null);

    if (newPassword !== confirmPassword) {
      setError("As duas senhas novas não são iguais.");
      return;
    }

    setSaving(true);
    const res = await fetch("/api/admin/change-password", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ currentPassword, newPassword }),
    });
    setSaving(false);

    if (!res.ok) {
      const data = (await res.json().catch(() => null)) as { error?: string } | null;
      setError(data?.error ?? "Não foi possível trocar a senha.");
      return;
    }

    // Reload completo (não router.replace) — garante que a sessão em memória no client
    // seja recarregada com must_change_password já zerado, evitando redirecionar de
    // volta pra cá em loop.
    window.location.href = "/admin";
  }

  const inputClass =
    "mt-1 w-full rounded-lg border border-slate-300 px-4 py-3 text-base outline-none focus:border-gold focus:ring-2 focus:ring-gold/20";

  return (
    <div className="mx-auto max-w-sm">
      <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <h1 className="font-serif-display text-xl font-semibold text-navy">
          Defina sua senha
        </h1>
        <p className="mt-1 text-sm text-slate-500">
          {session.name}, sua conta foi criada com uma senha temporária. Defina uma senha só
          sua antes de continuar.
        </p>

        <form onSubmit={handleSubmit} className="mt-5 space-y-4">
          <div>
            <label htmlFor="current-password" className="block text-sm font-medium text-slate-700">
              Senha temporária
            </label>
            <input
              id="current-password"
              type="password"
              required
              autoFocus
              autoComplete="current-password"
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
              className={inputClass}
            />
          </div>

          <div>
            <label htmlFor="new-password" className="block text-sm font-medium text-slate-700">
              Nova senha (mínimo 10 caracteres)
            </label>
            <input
              id="new-password"
              type="password"
              required
              minLength={10}
              autoComplete="new-password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              className={inputClass}
            />
          </div>

          <div>
            <label htmlFor="confirm-password" className="block text-sm font-medium text-slate-700">
              Confirmar nova senha
            </label>
            <input
              id="confirm-password"
              type="password"
              required
              minLength={10}
              autoComplete="new-password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className={inputClass}
            />
          </div>

          {error && (
            <p role="alert" className="text-sm text-red-600">
              {error}
            </p>
          )}

          <button
            type="submit"
            disabled={saving}
            className="w-full rounded-lg bg-navy px-4 py-3 text-base font-semibold text-gold-light transition-colors hover:bg-navy-light disabled:opacity-60"
          >
            {saving ? "Salvando..." : "Salvar nova senha"}
          </button>
        </form>
      </div>
    </div>
  );
}
