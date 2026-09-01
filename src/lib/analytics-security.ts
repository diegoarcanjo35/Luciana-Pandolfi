// Regras puras de segurança do endpoint de analytics — sem I/O, testáveis sem D1.
// Mesmo padrão de src/lib/session-logic.ts e src/lib/password-policy.ts: a rota em
// src/app/api/evento/route.ts importa daqui e só cuida do I/O (D1, Request/Response).

// Vocabulário fechado de eventos aceitos. Nunca aceitar uma string arbitrária vinda
// do navegador de qualquer visitante — evita que o endpoint vire lixeira genérica.
export const EVENTOS_PERMITIDOS = [
  "page_view",
  "section_view",
  "cta_click",
  "whatsapp_click",
  "form_start",
  "form_submit",
] as const;

export type TipoEvento = (typeof EVENTOS_PERMITIDOS)[number];

export function eventoValido(tipo: unknown): tipo is TipoEvento {
  return typeof tipo === "string" && (EVENTOS_PERMITIDOS as readonly string[]).includes(tipo);
}

export function corpoGrandeDemais(contentLength: string | null, maxBytes: number): boolean {
  if (!contentLength) return false;
  const n = parseInt(contentLength, 10);
  return Number.isFinite(n) && n > maxBytes;
}

/** Corta e normaliza texto vindo do navegador — nunca confiar no tamanho/tipo bruto. */
export function limpa(value: unknown, maxLen: number, fallback = ""): string {
  if (typeof value !== "string") return fallback;
  const trimmed = value.trim();
  if (!trimmed) return fallback;
  return trimmed.slice(0, maxLen);
}

export function limpaOuNulo(value: unknown, maxLen: number): string | null {
  const v = limpa(value, maxLen, "");
  return v || null;
}

export function inteiroOuNulo(value: unknown, min: number, max: number): number | null {
  const n = typeof value === "number" ? value : Number(value);
  if (!Number.isFinite(n)) return null;
  const i = Math.trunc(n);
  if (i < min || i > max) return null;
  return i;
}

/**
 * Rate limiter em memória (janela deslizante simples). Escopo é por isolate do
 * Worker, não global — segura abuso trivial de um único cliente, não um ataque
 * distribuído. Ver seção "Limitações conhecidas" do guia de analytics.
 */
export function criarLimitador(max: number, janelaMs: number) {
  const registros = new Map<string, { n: number; desde: number }>();
  return {
    excedeu(chave: string, agora: number = Date.now()): boolean {
      const r = registros.get(chave);
      if (!r) return false;
      if (agora - r.desde > janelaMs) {
        registros.delete(chave);
        return false;
      }
      return r.n >= max;
    },
    registrar(chave: string, agora: number = Date.now()): void {
      const r = registros.get(chave);
      if (!r || agora - r.desde > janelaMs) {
        registros.set(chave, { n: 1, desde: agora });
      } else {
        r.n++;
      }
    },
  };
}
