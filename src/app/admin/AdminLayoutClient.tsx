"use client";

import { useCallback, useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import Link from "next/link";
import { AdminSessionContext, type AdminSession } from "@/components/admin/AdminSessionContext";

const NAV_ITEMS = [
  { href: "/admin", label: "Leads" },
  { href: "/admin/promocoes", label: "Promoções" },
];

export default function AdminLayoutClient({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();

  const [session, setSession] = useState<AdminSession | null | undefined>(undefined);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loginError, setLoginError] = useState<string | null>(null);
  const [loginLoading, setLoginLoading] = useState(false);

  const loadSession = useCallback(async () => {
    const res = await fetch("/api/admin/me");
    if (res.status === 401) {
      setSession(null);
      return;
    }
    const data = (await res.json()) as {
      role: AdminSession["role"];
      name: string;
      isLegacy: boolean;
      mustChangePassword: boolean;
    };
    setSession({
      role: data.role,
      name: data.name,
      isLegacy: data.isLegacy,
      mustChangePassword: data.mustChangePassword,
    });
  }, []);

  useEffect(() => {
    loadSession();
  }, [loadSession]);

  const CHANGE_PASSWORD_PATH = "/admin/trocar-senha";
  const mustRedirectToChangePassword =
    !!session && session.mustChangePassword && pathname !== CHANGE_PASSWORD_PATH;

  useEffect(() => {
    if (mustRedirectToChangePassword) {
      router.replace(CHANGE_PASSWORD_PATH);
    }
  }, [mustRedirectToChangePassword, router]);

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    setLoginError(null);
    setLoginLoading(true);
    const res = await fetch("/api/admin/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email: email || undefined, password }),
    });
    setLoginLoading(false);
    if (!res.ok) {
      const data = (await res.json().catch(() => null)) as { error?: string } | null;
      setLoginError(data?.error ?? "Não foi possível entrar.");
      return;
    }
    setPassword("");
    loadSession();
  }

  async function handleLogout() {
    await fetch("/api/admin/logout", { method: "POST" });
    setSession(null);
    router.push("/admin");
  }

  if (session === undefined) {
    return <div className="p-8 text-center text-slate-500">Carregando...</div>;
  }

  if (session === null) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-50 px-4">
        <form
          onSubmit={handleLogin}
          className="w-full max-w-sm rounded-2xl border border-slate-200 bg-white p-6 shadow-sm"
        >
          <h1 className="font-serif-display text-xl font-semibold text-navy">Painel administrativo</h1>
          <p className="mt-1 text-sm text-slate-500">Acesso restrito à equipe da L&amp;J.</p>

          <label htmlFor="admin-email" className="mt-4 block text-sm font-medium text-slate-700">
            E-mail
          </label>
          <input
            id="admin-email"
            type="email"
            autoComplete="username"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="seu@email.com"
            className="mt-1 w-full rounded-lg border border-slate-300 px-4 py-3 text-base outline-none focus:border-gold focus:ring-2 focus:ring-gold/20"
          />
          <p className="mt-1 text-xs text-slate-400">
            Deixe em branco para entrar com a senha de acesso atual.
          </p>

          <label htmlFor="admin-password" className="mt-4 block text-sm font-medium text-slate-700">
            Senha
          </label>
          <input
            id="admin-password"
            type="password"
            required
            autoFocus
            autoComplete="current-password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="mt-1 w-full rounded-lg border border-slate-300 px-4 py-3 text-base outline-none focus:border-gold focus:ring-2 focus:ring-gold/20"
          />

          {loginError && (
            <p role="alert" className="mt-3 text-sm text-red-600">
              {loginError}
            </p>
          )}
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

  if (mustRedirectToChangePassword) {
    return <div className="p-8 text-center text-slate-500">Redirecionando...</div>;
  }

  return (
    <AdminSessionContext.Provider value={session}>
      <div className="min-h-screen bg-slate-50">
        <header className="border-b border-slate-200 bg-white px-4 py-3 sm:px-6">
          <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-3">
            <nav className="flex items-center gap-1" aria-label="Navegação do painel">
              {[
                ...NAV_ITEMS,
                ...(session.role === "superadmin"
                  ? [{ href: "/admin/usuarios", label: "Usuários" }]
                  : []),
              ].map((item) => {
                const isActive = pathname === item.href;
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    aria-current={isActive ? "page" : undefined}
                    className={`rounded-lg px-3 py-2 text-sm font-medium transition-colors ${
                      isActive ? "bg-navy text-cream" : "text-slate-600 hover:bg-slate-100"
                    }`}
                  >
                    {item.label}
                  </Link>
                );
              })}
            </nav>
            <div className="flex items-center gap-3 text-sm text-slate-500">
              <span>
                {session.name} · <span className="capitalize">{session.role}</span>
              </span>
              <button
                onClick={handleLogout}
                className="rounded-lg border border-slate-300 px-3 py-2 font-medium text-slate-700 hover:bg-slate-100"
              >
                Sair
              </button>
            </div>
          </div>
        </header>
        <main className="px-4 py-8 sm:px-6">{children}</main>
      </div>
    </AdminSessionContext.Provider>
  );
}
