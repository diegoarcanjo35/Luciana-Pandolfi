import { describe, it, expect } from "vitest";
import {
  computeEffectiveStatus,
  isPubliclyVisible,
  todaySaoPaulo,
  slugify,
  validatePromotionInput,
} from "../promotions";

// "Agora" fixo em 01/09/2026 meio-dia UTC — data do lançamento, usada em quase todo teste.
const LAUNCH_DAY = new Date("2026-09-01T12:00:00Z");

describe("computeEffectiveStatus", () => {
  it("promoção ativa dentro da vigência", () => {
    const status = computeEffectiveStatus(
      { status: "active", starts_at: "2026-07-27", ends_at: "2026-09-30" },
      LAUNCH_DAY
    );
    expect(status).toBe("active");
  });

  it("promoção expirada (data final antes de hoje)", () => {
    const status = computeEffectiveStatus(
      { status: "active", starts_at: "2026-07-01", ends_at: "2026-08-31" },
      LAUNCH_DAY
    );
    expect(status).toBe("expired");
  });

  it("promoção futura aparece como agendada", () => {
    const status = computeEffectiveStatus(
      { status: "active", starts_at: "2026-10-01", ends_at: "2026-12-31" },
      LAUNCH_DAY
    );
    expect(status).toBe("scheduled");
  });

  it("rascunho nunca aparece como ativo, mesmo dentro da janela de datas", () => {
    const status = computeEffectiveStatus(
      { status: "draft", starts_at: "2026-07-01", ends_at: "2026-12-31" },
      LAUNCH_DAY
    );
    expect(status).toBe("draft");
  });

  it("arquivada nunca aparece como ativa, mesmo dentro da janela de datas", () => {
    const status = computeEffectiveStatus(
      { status: "archived", starts_at: "2026-07-01", ends_at: "2026-12-31" },
      LAUNCH_DAY
    );
    expect(status).toBe("archived");
  });

  it("promoção sem data final e já iniciada fica ativa indefinidamente", () => {
    const status = computeEffectiveStatus(
      { status: "active", starts_at: "2026-07-01", ends_at: null },
      LAUNCH_DAY
    );
    expect(status).toBe("active");
  });

  it("no dia exato de início já é ativa (inclusivo)", () => {
    const status = computeEffectiveStatus(
      { status: "active", starts_at: "2026-09-01", ends_at: "2026-09-30" },
      LAUNCH_DAY
    );
    expect(status).toBe("active");
  });

  it("no dia exato de encerramento ainda é ativa (inclusivo)", () => {
    const status = computeEffectiveStatus(
      { status: "active", starts_at: "2026-07-01", ends_at: "2026-09-01" },
      LAUNCH_DAY
    );
    expect(status).toBe("active");
  });

  it("virada de UTC não antecipa o fim da vigência em São Paulo (UTC-3)", () => {
    // 2026-09-01T02:00:00Z já é dia 1º de setembro em UTC, mas em América/São_Paulo
    // (UTC-3) ainda são 31/08 23:00 — a promoção com ends_at=2026-08-31 continua ativa.
    const status = computeEffectiveStatus(
      { status: "active", starts_at: "2026-07-01", ends_at: "2026-08-31" },
      new Date("2026-09-01T02:00:00Z")
    );
    expect(status).toBe("active");
  });

  it("um dia inteiro após o encerramento (em São Paulo) já expira", () => {
    // 2026-09-02T03:00:00Z = 2026-09-02T00:00:00-03:00 em São Paulo — já passou o dia 31/08.
    const status = computeEffectiveStatus(
      { status: "active", starts_at: "2026-07-01", ends_at: "2026-08-31" },
      new Date("2026-09-02T03:00:00Z")
    );
    expect(status).toBe("expired");
  });
});

describe("promoções do lançamento de 01/09/2026 (cenário real do briefing)", () => {
  it("Hapvida (27/07 a 30/09) aparece ativa em 01/09", () => {
    const hapvida = { status: "active" as const, starts_at: "2026-07-27", ends_at: "2026-09-30" };
    expect(isPubliclyVisible(hapvida, LAUNCH_DAY)).toBe(true);
  });

  it("Omint em rascunho não aparece publicamente em 01/09", () => {
    const omint = { status: "draft" as const, starts_at: "2026-07-01", ends_at: null };
    expect(isPubliclyVisible(omint, LAUNCH_DAY)).toBe(false);
  });

  it("campanhas com vigência até 31/08 (Prevent Senior, SulAmérica) não aparecem em 01/09", () => {
    const preventSenior = { status: "active" as const, starts_at: "2026-08-01", ends_at: "2026-08-31" };
    expect(isPubliclyVisible(preventSenior, LAUNCH_DAY)).toBe(false);
  });

  it("Porto Bairro (encerrada em 10/08) não aparece em 01/09", () => {
    const portoBairro = { status: "active" as const, starts_at: "2026-07-01", ends_at: "2026-08-10" };
    expect(isPubliclyVisible(portoBairro, LAUNCH_DAY)).toBe(false);
  });
});

describe("todaySaoPaulo — vira o dia em America/Sao_Paulo, não em UTC", () => {
  it("00:30 UTC ainda é o dia anterior em São Paulo (UTC-3)", () => {
    // 2026-09-01T00:30:00Z -> 2026-08-31T21:30:00-03:00
    expect(todaySaoPaulo(new Date("2026-09-01T00:30:00Z"))).toBe("2026-08-31");
  });

  it("03:00 UTC já é o novo dia em São Paulo", () => {
    // 2026-09-01T03:00:00Z -> 2026-09-01T00:00:00-03:00
    expect(todaySaoPaulo(new Date("2026-09-01T03:00:00Z"))).toBe("2026-09-01");
  });
});

describe("slugify", () => {
  it("remove acentos e normaliza espaços/pontuação", () => {
    expect(slugify("Hapvida: 50% de desconto")).toBe("hapvida-50-de-desconto");
  });
  it("mantém números", () => {
    expect(slugify("Omint 4 a 99 vidas")).toBe("omint-4-a-99-vidas");
  });
});

describe("validatePromotionInput", () => {
  const base = {
    operator_name: "Hapvida",
    title: "Hapvida: 50% de desconto",
    short_description: "Desconto na primeira mensalidade.",
    starts_at: "2026-07-27",
    ends_at: "2026-09-30",
    status: "draft",
  };

  it("aceita um rascunho válido", () => {
    expect(validatePromotionInput(base)).toEqual([]);
  });

  it("rejeita data final anterior à inicial", () => {
    const errors = validatePromotionInput({ ...base, starts_at: "2026-09-30", ends_at: "2026-07-27" });
    expect(errors.some((e) => e.includes("Data final"))).toBe(true);
  });

  it("rejeita operadora ausente", () => {
    const errors = validatePromotionInput({ ...base, operator_name: "" });
    expect(errors.some((e) => e.includes("Operadora"))).toBe(true);
  });

  it("exige condições completas para publicar (forPublish)", () => {
    const errors = validatePromotionInput({ ...base, status: "active" }, { forPublish: true });
    expect(errors.some((e) => e.includes("Condições completas"))).toBe(true);
  });

  it("não exige condições completas para salvar como rascunho", () => {
    const errors = validatePromotionInput(base, { forPublish: false });
    expect(errors.some((e) => e.includes("Condições completas"))).toBe(false);
  });

  it("aceita promoção sem data final (sem prazo definido, como a Omint)", () => {
    const errors = validatePromotionInput({ ...base, ends_at: null });
    expect(errors).toEqual([]);
  });

  it("rejeita mínimo de vidas maior que o máximo", () => {
    const errors = validatePromotionInput({ ...base, minimum_lives: 100, maximum_lives: 10 });
    expect(errors.some((e) => e.includes("vidas"))).toBe(true);
  });
});
