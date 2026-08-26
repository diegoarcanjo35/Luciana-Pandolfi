"use client";

import { useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import { maskPhoneBR, isValidPhoneBR } from "@/lib/phone-mask";
import { getStoredUtm } from "@/lib/utm";

export default function LeadFormIsca({
  sourcePage,
  campaign,
}: {
  sourcePage: string;
  campaign?: string;
}) {
  const router = useRouter();
  const [nome, setNome] = useState("");
  const [whatsapp, setWhatsapp] = useState("");
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError(null);

    if (!nome.trim() || !isValidPhoneBR(whatsapp)) {
      setError("Preencha nome e um WhatsApp válido.");
      return;
    }

    setLoading(true);
    const utm = getStoredUtm();
    const eventId = crypto.randomUUID();

    try {
      const res = await fetch("/api/lead", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          form_type: "isca",
          source_page: sourcePage,
          campaign: campaign ?? null,
          nome,
          whatsapp,
          email,
          event_id: eventId,
          ...utm,
        }),
      });

      if (!res.ok) throw new Error("Falha no envio");

      const params = new URLSearchParams({ origem: "guia", eid: eventId });
      if (campaign) params.set("campanha", campaign);
      router.push(`/obrigado?${params.toString()}`);
    } catch {
      setError("Não conseguimos enviar agora. Tente novamente em instantes.");
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-3">
      <div className="flex flex-col gap-1">
        <label htmlFor="isca-nome" className="text-sm font-medium text-slate-700">
          Nome
        </label>
        <input
          id="isca-nome"
          type="text"
          required
          value={nome}
          onChange={(e) => setNome(e.target.value)}
          placeholder="Seu nome"
          className="rounded-lg border border-slate-300 px-4 py-3 text-base outline-none focus:border-teal-600 focus:ring-2 focus:ring-teal-100"
        />
      </div>
      <div className="flex flex-col gap-1">
        <label htmlFor="isca-whatsapp" className="text-sm font-medium text-slate-700">
          WhatsApp
        </label>
        <input
          id="isca-whatsapp"
          type="tel"
          required
          inputMode="numeric"
          value={whatsapp}
          onChange={(e) => setWhatsapp(maskPhoneBR(e.target.value))}
          placeholder="(11) 90000-0000"
          className="rounded-lg border border-slate-300 px-4 py-3 text-base outline-none focus:border-teal-600 focus:ring-2 focus:ring-teal-100"
        />
      </div>
      <div className="flex flex-col gap-1">
        <label htmlFor="isca-email" className="text-sm font-medium text-slate-700">
          E-mail
        </label>
        <input
          id="isca-email"
          type="email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="seuemail@exemplo.com"
          className="rounded-lg border border-slate-300 px-4 py-3 text-base outline-none focus:border-teal-600 focus:ring-2 focus:ring-teal-100"
        />
      </div>

      {error && <p className="text-sm text-red-600">{error}</p>}

      <button
        type="submit"
        disabled={loading}
        className="mt-1 rounded-lg bg-teal-600 px-6 py-3.5 text-base font-semibold text-white transition-colors hover:bg-teal-700 disabled:opacity-60"
      >
        {loading ? "Enviando..." : "Receber o guia gratuito"}
      </button>
      <p className="text-center text-xs text-slate-500">
        Envio imediato · Sem custo · Seus dados não são compartilhados com terceiros
      </p>
    </form>
  );
}
