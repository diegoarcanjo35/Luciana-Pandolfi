// Regras de negócio de promoções — funções puras, sem I/O, pra serem testáveis sem D1.
// `status` gravado no banco é só a intenção do admin (draft/active/archived); o estado
// efetivo (o que decide se aparece em público, e o que a coluna "Situação" do Admin
// mostra) é sempre CALCULADO a partir de status + starts_at/ends_at + data atual em
// America/Sao_Paulo. Isso evita que uma promoção fique "active" no banco mas já vencida.

export type StoredStatus = "draft" | "active" | "archived";
export type EffectiveStatus = "draft" | "scheduled" | "active" | "expired" | "archived";

export interface PromotionDates {
  status: StoredStatus;
  starts_at: string; // YYYY-MM-DD (data civil em America/Sao_Paulo)
  ends_at: string | null; // YYYY-MM-DD ou null (sem prazo definido)
}

/** Data civil (YYYY-MM-DD) em America/Sao_Paulo para um instante UTC qualquer. */
export function todaySaoPaulo(now: Date = new Date()): string {
  const formatter = new Intl.DateTimeFormat("en-CA", {
    timeZone: "America/Sao_Paulo",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  });
  return formatter.format(now); // en-CA já formata como YYYY-MM-DD
}

export function computeEffectiveStatus(
  promo: PromotionDates,
  now: Date = new Date()
): EffectiveStatus {
  if (promo.status === "archived") return "archived";
  if (promo.status === "draft") return "draft";

  const today = todaySaoPaulo(now);
  if (today < promo.starts_at) return "scheduled";
  if (promo.ends_at && today > promo.ends_at) return "expired";
  return "active";
}

export function isPubliclyVisible(promo: PromotionDates, now: Date = new Date()): boolean {
  return computeEffectiveStatus(promo, now) === "active";
}

export function slugify(input: string): string {
  return input
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

export interface PromotionInput {
  slug?: string;
  operator_name?: string;
  title?: string;
  short_description?: string;
  benefit_type?: string | null;
  benefit_value?: string | null;
  full_conditions?: string | null;
  starts_at?: string;
  ends_at?: string | null;
  status?: string;
  minimum_lives?: number | null;
  maximum_lives?: number | null;
}

const DATE_RE = /^\d{4}-\d{2}-\d{2}$/;

/** Validação server-side — nunca confiar só na validação do navegador. */
export function validatePromotionInput(
  input: PromotionInput,
  { forPublish = false }: { forPublish?: boolean } = {}
): string[] {
  const errors: string[] = [];

  if (!input.operator_name?.trim()) errors.push("Operadora é obrigatória.");
  if (!input.title?.trim()) errors.push("Título é obrigatório.");
  if (!input.short_description?.trim()) errors.push("Descrição pública é obrigatória.");
  if (!input.starts_at || !DATE_RE.test(input.starts_at)) {
    errors.push("Data inicial é obrigatória e deve estar no formato AAAA-MM-DD.");
  }
  if (input.ends_at != null && input.ends_at !== "" && !DATE_RE.test(input.ends_at)) {
    errors.push("Data final deve estar no formato AAAA-MM-DD.");
  }
  if (
    input.starts_at &&
    DATE_RE.test(input.starts_at) &&
    input.ends_at &&
    DATE_RE.test(input.ends_at) &&
    input.ends_at < input.starts_at
  ) {
    errors.push("Data final não pode ser anterior à data inicial.");
  }
  if (
    input.minimum_lives != null &&
    input.maximum_lives != null &&
    input.minimum_lives > input.maximum_lives
  ) {
    errors.push("Número mínimo de vidas não pode ser maior que o máximo.");
  }
  if (input.status && !["draft", "active", "archived"].includes(input.status)) {
    errors.push("Status inválido.");
  }

  if (forPublish) {
    if (!input.full_conditions?.trim()) {
      errors.push("Condições completas são obrigatórias antes de publicar.");
    }
  }

  return errors;
}

/** Remove HTML — os textos de promoção são sempre exibidos como texto puro, nunca como HTML. */
export function stripHtml(input: string): string {
  return input.replace(/<[^>]*>/g, "");
}
