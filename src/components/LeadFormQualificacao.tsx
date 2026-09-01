"use client";

import { useRef, useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import { maskPhoneBR, isValidPhoneBR } from "@/lib/phone-mask";
import { getStoredUtm } from "@/lib/utm";
import { track } from "@/components/AnalyticsTracker";

const PARA_QUEM_OPTIONS = ["Para mim", "Minha família", "Minha empresa (CNPJ)", "Meus pais"];
const QUANTIDADE_OPTIONS = ["1", "2 a 3", "4 a 9", "10 ou mais"];
const QUANDO_OPTIONS = ["O quanto antes", "Nos próximos 30 dias", "Só pesquisando"];

export default function LeadFormQualificacao({
  sourcePage,
  campaign,
  showNumeroVidas = false,
  paraQuemOrder,
  ctaLabel = "Solicitar minha análise gratuita",
  promotionSlug,
}: {
  sourcePage: string;
  campaign?: string;
  showNumeroVidas?: boolean;
  paraQuemOrder?: string[];
  ctaLabel?: string;
  promotionSlug?: string;
}) {
  const router = useRouter();
  const options = paraQuemOrder ?? PARA_QUEM_OPTIONS;

  const [nome, setNome] = useState("");
  const [whatsapp, setWhatsapp] = useState("");
  const [email, setEmail] = useState("");
  const [paraQuem, setParaQuem] = useState("");
  const [quantidade, setQuantidade] = useState("");
  const [jaTemPlano, setJaTemPlano] = useState("");
  const [quando, setQuando] = useState("");
  const [hospital, setHospital] = useState("");
  const [numeroVidas, setNumeroVidas] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const started = useRef(false);

  function handleFocus() {
    if (started.current) return;
    started.current = true;
    track("form_start", { elemento: sourcePage, oferta: campaign });
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError(null);

    if (
      !nome.trim() ||
      !isValidPhoneBR(whatsapp) ||
      !paraQuem ||
      !quantidade ||
      !jaTemPlano ||
      !quando ||
      (showNumeroVidas && !numeroVidas.trim())
    ) {
      setError("Preencha os campos obrigatórios antes de enviar.");
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
          form_type: "qualificacao",
          source_page: sourcePage,
          campaign: campaign ?? null,
          nome,
          whatsapp,
          email,
          para_quem: paraQuem,
          quantidade_pessoas: quantidade,
          ja_tem_plano: jaTemPlano,
          quando_resolver: quando,
          hospital_especifico: hospital || null,
          numero_vidas: showNumeroVidas ? numeroVidas : null,
          event_id: eventId,
          promotion_slug: promotionSlug ?? null,
          ...utm,
        }),
      });

      if (!res.ok) throw new Error("Falha no envio");

      track("form_submit", { elemento: sourcePage, oferta: campaign });
      const params = new URLSearchParams({ origem: "qualificacao", eid: eventId });
      if (campaign) params.set("campanha", campaign);
      router.push(`/obrigado?${params.toString()}`);
    } catch {
      setError("Não conseguimos enviar agora. Tente novamente em instantes.");
      setLoading(false);
    }
  }

  const selectClass =
    "rounded-lg border border-navy/20 bg-white px-4 py-3 text-base text-navy outline-none focus:border-gold focus:ring-2 focus:ring-gold/20";
  const inputClass =
    "rounded-lg border border-navy/20 px-4 py-3 text-base text-navy outline-none focus:border-gold focus:ring-2 focus:ring-gold/20";
  const labelClass = "text-sm font-medium text-navy/80";

  return (
    <form onSubmit={handleSubmit} onFocus={handleFocus} className="flex flex-col gap-3">
      <div className="flex flex-col gap-1">
        <label htmlFor="q-nome" className={labelClass}>
          Nome completo
        </label>
        <input
          id="q-nome"
          type="text"
          required
          value={nome}
          onChange={(e) => setNome(e.target.value)}
          className={inputClass}
        />
      </div>

      <div className="flex flex-col gap-1">
        <label htmlFor="q-whatsapp" className={labelClass}>
          WhatsApp
        </label>
        <input
          id="q-whatsapp"
          type="tel"
          required
          inputMode="numeric"
          value={whatsapp}
          onChange={(e) => setWhatsapp(maskPhoneBR(e.target.value))}
          placeholder="(11) 90000-0000"
          className={inputClass}
        />
      </div>

      <div className="flex flex-col gap-1">
        <label htmlFor="q-email" className={labelClass}>
          E-mail
        </label>
        <input
          id="q-email"
          type="email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className={inputClass}
        />
      </div>

      <div className="flex flex-col gap-1">
        <label htmlFor="q-para-quem" className={labelClass}>
          É para você ou para uma empresa?
        </label>
        <select
          id="q-para-quem"
          required
          value={paraQuem}
          onChange={(e) => setParaQuem(e.target.value)}
          className={selectClass}
        >
          <option value="" disabled>
            Selecione
          </option>
          {options.map((opt) => (
            <option key={opt} value={opt}>
              {opt}
            </option>
          ))}
        </select>
      </div>

      {showNumeroVidas && (
        <div className="flex flex-col gap-1">
          <label htmlFor="q-numero-vidas" className={labelClass}>
            Número de vidas (funcionários/dependentes no plano)
          </label>
          <input
            id="q-numero-vidas"
            type="text"
            required
            inputMode="numeric"
            value={numeroVidas}
            onChange={(e) => setNumeroVidas(e.target.value)}
            placeholder="Ex: 8"
            className={inputClass}
          />
        </div>
      )}

      <div className="flex flex-col gap-1">
        <label htmlFor="q-quantidade" className={labelClass}>
          Quantas pessoas?
        </label>
        <select
          id="q-quantidade"
          required
          value={quantidade}
          onChange={(e) => setQuantidade(e.target.value)}
          className={selectClass}
        >
          <option value="" disabled>
            Selecione
          </option>
          {QUANTIDADE_OPTIONS.map((opt) => (
            <option key={opt} value={opt}>
              {opt}
            </option>
          ))}
        </select>
      </div>

      <div className="flex flex-col gap-1">
        <label htmlFor="q-ja-tem" className={labelClass}>
          Já tem plano hoje?
        </label>
        <select
          id="q-ja-tem"
          required
          value={jaTemPlano}
          onChange={(e) => setJaTemPlano(e.target.value)}
          className={selectClass}
        >
          <option value="" disabled>
            Selecione
          </option>
          <option value="Sim">Sim</option>
          <option value="Não">Não</option>
        </select>
      </div>

      <div className="flex flex-col gap-1">
        <label htmlFor="q-quando" className={labelClass}>
          Quando pretende resolver?
        </label>
        <select
          id="q-quando"
          required
          value={quando}
          onChange={(e) => setQuando(e.target.value)}
          className={selectClass}
        >
          <option value="" disabled>
            Selecione
          </option>
          {QUANDO_OPTIONS.map((opt) => (
            <option key={opt} value={opt}>
              {opt}
            </option>
          ))}
        </select>
      </div>

      <div className="flex flex-col gap-1">
        <label htmlFor="q-hospital" className={labelClass}>
          Algum hospital específico? <span className="font-normal text-navy/40">(opcional)</span>
        </label>
        <input
          id="q-hospital"
          type="text"
          value={hospital}
          onChange={(e) => setHospital(e.target.value)}
          placeholder="Ex: Hospital Albert Einstein"
          className={inputClass}
        />
      </div>

      {error && <p className="text-sm text-red-600">{error}</p>}

      <button
        type="submit"
        disabled={loading}
        className="mt-1 rounded-lg bg-gold px-6 py-3.5 text-base font-semibold text-navy transition-colors hover:bg-gold-light disabled:opacity-60"
      >
        {loading ? "Enviando..." : ctaLabel}
      </button>
    </form>
  );
}
