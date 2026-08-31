import { describe, it, expect } from "vitest";
import {
  computeEffectiveStatus,
  isPubliclyVisible,
  todaySaoPaulo,
  slugify,
  validatePromotionInput,
  isSafeCtaTarget,
  isNonNegativeInt,
  isValidDisplayOrder,
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

  it("rejeita número de vidas não inteiro/negativo", () => {
    expect(validatePromotionInput({ ...base, minimum_lives: -1 }).length).toBeGreaterThan(0);
    expect(validatePromotionInput({ ...base, minimum_lives: 2.5 }).length).toBeGreaterThan(0);
  });

  it("rejeita display_order fora da faixa ou não inteiro", () => {
    expect(validatePromotionInput({ ...base, display_order: -1 }).length).toBeGreaterThan(0);
    expect(validatePromotionInput({ ...base, display_order: 1.5 }).length).toBeGreaterThan(0);
    expect(validatePromotionInput({ ...base, display_order: 999_999 }).length).toBeGreaterThan(0);
  });

  it("aceita display_order dentro da faixa", () => {
    expect(validatePromotionInput({ ...base, display_order: 0 })).toEqual([]);
    expect(validatePromotionInput({ ...base, display_order: 500 })).toEqual([]);
  });

  it("rejeita is_featured que não seja booleano real", () => {
    const errors = validatePromotionInput({ ...base, is_featured: "true" });
    expect(errors.some((e) => e.includes("Destaque"))).toBe(true);
  });

  it("rejeita public_cta_target perigoso", () => {
    const errors = validatePromotionInput({ ...base, public_cta_target: "javascript:alert(1)" });
    expect(errors.some((e) => e.includes("CTA"))).toBe(true);
  });

  it("aceita public_cta_target seguro", () => {
    expect(validatePromotionInput({ ...base, public_cta_target: "#simulacao" })).toEqual([]);
    expect(validatePromotionInput({ ...base, public_cta_target: "/plano-familiar#simulacao" })).toEqual([]);
  });

  // Regressão do bug real: criar promoção diretamente como ativa, com condições completas
  // enviadas, tinha que passar — o bug era o campo full_conditions não chegar no objeto de
  // validação no route handler, não um problema nesta função. Estes casos cobrem o cenário
  // pedido na auditoria: rascunho, ativa direta com condições, publicação sem condições
  // (deve falhar), rascunho publicado depois, e data final antes da inicial.
  describe("cenários da auditoria — criação e publicação", () => {
    const complete = { ...base, full_conditions: "Condições completas e detalhadas da campanha." };

    it("cria em rascunho sem exigir condições completas", () => {
      expect(validatePromotionInput(base, { forPublish: false })).toEqual([]);
    });

    it("cria diretamente como ativa quando as condições completas foram enviadas", () => {
      const errors = validatePromotionInput({ ...complete, status: "active" }, { forPublish: true });
      expect(errors).toEqual([]);
    });

    it("impede publicação sem condições completas", () => {
      const errors = validatePromotionInput({ ...base, status: "active" }, { forPublish: true });
      expect(errors.some((e) => e.includes("Condições completas"))).toBe(true);
    });

    it("permite salvar rascunho e, depois, publicar (duas chamadas em sequência)", () => {
      const draftErrors = validatePromotionInput(base, { forPublish: false });
      expect(draftErrors).toEqual([]);
      const publishErrors = validatePromotionInput(
        { ...complete, status: "active" },
        { forPublish: true }
      );
      expect(publishErrors).toEqual([]);
    });

    it("impede data final anterior à inicial mesmo com condições completas", () => {
      const errors = validatePromotionInput(
        { ...complete, starts_at: "2026-09-30", ends_at: "2026-07-27", status: "active" },
        { forPublish: true }
      );
      expect(errors.some((e) => e.includes("Data final"))).toBe(true);
    });
  });
});

describe("isSafeCtaTarget", () => {
  it("aceita âncoras simples", () => {
    expect(isSafeCtaTarget("#simulacao")).toBe(true);
    expect(isSafeCtaTarget("#analise")).toBe(true);
  });

  it("aceita caminhos internos", () => {
    expect(isSafeCtaTarget("/plano-familiar")).toBe(true);
    expect(isSafeCtaTarget("/plano-familiar#simulacao")).toBe(true);
    expect(isSafeCtaTarget("/?promo=hapvida#simulacao")).toBe(true);
  });

  it("rejeita protocolo javascript:", () => {
    expect(isSafeCtaTarget("javascript:alert(1)")).toBe(false);
  });

  it("rejeita protocolo data:", () => {
    expect(isSafeCtaTarget("data:text/html,<script>alert(1)</script>")).toBe(false);
  });

  it("rejeita domínio externo", () => {
    expect(isSafeCtaTarget("https://evil.com")).toBe(false);
    expect(isSafeCtaTarget("http://evil.com")).toBe(false);
  });

  it("rejeita URL protocol-relative (//dominio)", () => {
    expect(isSafeCtaTarget("//evil.com")).toBe(false);
  });

  it("rejeita string vazia", () => {
    expect(isSafeCtaTarget("")).toBe(false);
  });
});

describe("isNonNegativeInt / isValidDisplayOrder", () => {
  it("isNonNegativeInt aceita 0 e inteiros positivos, rejeita negativos e decimais", () => {
    expect(isNonNegativeInt(0)).toBe(true);
    expect(isNonNegativeInt(42)).toBe(true);
    expect(isNonNegativeInt(-1)).toBe(false);
    expect(isNonNegativeInt(1.5)).toBe(false);
    expect(isNonNegativeInt("5")).toBe(false);
  });

  it("isValidDisplayOrder aceita a faixa 0–10000, rejeita fora dela", () => {
    expect(isValidDisplayOrder(0)).toBe(true);
    expect(isValidDisplayOrder(10_000)).toBe(true);
    expect(isValidDisplayOrder(10_001)).toBe(false);
    expect(isValidDisplayOrder(-1)).toBe(false);
  });
});
