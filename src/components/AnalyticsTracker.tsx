"use client";

import { useEffect, useRef } from "react";
import { usePathname } from "next/navigation";

// Rastreador de sessão pseudônima — sem GA4, sem cookie de rastreio entre sites.
// Adaptado do guia extraído do site da Vallery Alves (multi-page, script solto) para
// Next.js App Router: como a navegação entre páginas é client-side (sem reload),
// o page_view dispara a cada troca de pathname via usePathname, não só no load.

const UTM_KEYS = ["utm_source", "utm_medium", "utm_campaign", "utm_content", "utm_term"] as const;

function sessaoId(): string {
  try {
    const atual = sessionStorage.getItem("sessao_id");
    if (atual) return atual;
    const novo = crypto.randomUUID();
    sessionStorage.setItem("sessao_id", novo);
    return novo;
  } catch {
    return "sem-sessao";
  }
}

function utmAtual(): Record<string, string> {
  const params = new URLSearchParams(window.location.search);
  const dados: Record<string, string> = {};
  for (const key of UTM_KEYS) {
    const v = params.get(key);
    if (v) dados[key] = v.slice(0, 120);
  }
  return dados;
}

export type TrackDetails = {
  elemento?: string;
  oferta?: string;
  etapa?: number;
};

declare global {
  interface Window {
    track?: (tipo: string, detalhes?: TrackDetails) => void;
  }
}

function track(tipo: string, detalhes?: TrackDetails) {
  try {
    const corpo = JSON.stringify({
      evento: tipo,
      sessao: sessaoId(),
      pagina: window.location.pathname,
      referrer: document.referrer || "",
      ...utmAtual(),
      ...detalhes,
    });
    if (navigator.sendBeacon) {
      navigator.sendBeacon("/api/evento", new Blob([corpo], { type: "application/json" }));
    } else {
      fetch("/api/evento", { method: "POST", body: corpo, keepalive: true }).catch(() => {});
    }
  } catch {
    // rastreamento nunca pode quebrar a navegação
  }
}

export default function AnalyticsTracker() {
  const pathname = usePathname();
  const vistos = useRef<Set<string>>(new Set());

  useEffect(() => {
    window.track = track;
  }, []);

  // page_view a cada troca de rota (equivalente ao "um por carregamento de página"
  // do guia original, adaptado pra navegação client-side sem reload)
  useEffect(() => {
    track("page_view");
  }, [pathname]);

  // section_view automático — qualquer <section id="..."> que entrar na tela,
  // uma vez por sessão de página (reseta a cada troca de rota)
  useEffect(() => {
    if (!("IntersectionObserver" in window)) return;
    vistos.current = new Set();

    const obs = new IntersectionObserver(
      (entradas) => {
        for (const entrada of entradas) {
          const id = entrada.target.id;
          if (!entrada.isIntersecting || !id || vistos.current.has(id)) continue;
          vistos.current.add(id);
          track("section_view", { elemento: id });
          obs.unobserve(entrada.target);
        }
      },
      { threshold: 0.4 }
    );

    const timer = setTimeout(() => {
      document.querySelectorAll("section[id]").forEach((el) => obs.observe(el));
    }, 50);

    return () => {
      clearTimeout(timer);
      obs.disconnect();
    };
  }, [pathname]);

  // cta_click — qualquer elemento marcado com data-cta="rotulo" no HTML
  useEffect(() => {
    function onClick(e: MouseEvent) {
      const alvo = (e.target as HTMLElement | null)?.closest<HTMLElement>("[data-cta]");
      if (alvo) track("cta_click", { elemento: alvo.getAttribute("data-cta") ?? undefined });
    }
    document.addEventListener("click", onClick);
    return () => document.removeEventListener("click", onClick);
  }, []);

  return null;
}

export { track };
