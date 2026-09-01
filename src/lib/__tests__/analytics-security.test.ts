import { describe, expect, it } from "vitest";
import {
  eventoValido,
  corpoGrandeDemais,
  limpa,
  limpaOuNulo,
  inteiroOuNulo,
  criarLimitador,
} from "@/lib/analytics-security";

describe("eventoValido", () => {
  it("aceita tipos da lista fechada", () => {
    expect(eventoValido("page_view")).toBe(true);
    expect(eventoValido("cta_click")).toBe(true);
  });

  it("rejeita string fora da lista", () => {
    expect(eventoValido("drop_table")).toBe(false);
  });

  it("rejeita valores não-string", () => {
    expect(eventoValido(123)).toBe(false);
    expect(eventoValido(null)).toBe(false);
    expect(eventoValido(undefined)).toBe(false);
  });
});

describe("corpoGrandeDemais", () => {
  it("permite quando não há content-length", () => {
    expect(corpoGrandeDemais(null, 8192)).toBe(false);
  });

  it("permite corpo dentro do limite", () => {
    expect(corpoGrandeDemais("1000", 8192)).toBe(false);
  });

  it("rejeita corpo acima do limite", () => {
    expect(corpoGrandeDemais("9000", 8192)).toBe(true);
  });

  it("ignora content-length não numérico", () => {
    expect(corpoGrandeDemais("abc", 8192)).toBe(false);
  });
});

describe("limpa", () => {
  it("corta pelo tamanho máximo", () => {
    expect(limpa("a".repeat(200), 10)).toBe("a".repeat(10));
  });

  it("remove espaços nas pontas", () => {
    expect(limpa("  ola  ", 20)).toBe("ola");
  });

  it("usa fallback quando não é string", () => {
    expect(limpa(42, 10, "/")).toBe("/");
    expect(limpa(undefined, 10, "/")).toBe("/");
  });

  it("usa fallback quando string vazia", () => {
    expect(limpa("   ", 10, "/")).toBe("/");
  });
});

describe("limpaOuNulo", () => {
  it("retorna null para vazio", () => {
    expect(limpaOuNulo("", 10)).toBeNull();
    expect(limpaOuNulo(undefined, 10)).toBeNull();
  });

  it("retorna string limpa quando presente", () => {
    expect(limpaOuNulo("ola", 10)).toBe("ola");
  });
});

describe("inteiroOuNulo", () => {
  it("aceita inteiro dentro da faixa", () => {
    expect(inteiroOuNulo(3, 1, 10)).toBe(3);
  });

  it("trunca decimal", () => {
    expect(inteiroOuNulo(3.9, 1, 10)).toBe(3);
  });

  it("rejeita fora da faixa", () => {
    expect(inteiroOuNulo(0, 1, 10)).toBeNull();
    expect(inteiroOuNulo(11, 1, 10)).toBeNull();
  });

  it("rejeita não-numérico", () => {
    expect(inteiroOuNulo("abc", 1, 10)).toBeNull();
    expect(inteiroOuNulo(undefined, 1, 10)).toBeNull();
  });
});

describe("criarLimitador", () => {
  it("não excede antes de atingir o máximo", () => {
    const lim = criarLimitador(3, 60_000);
    const t0 = 1_000_000;
    lim.registrar("ip1", t0);
    lim.registrar("ip1", t0);
    expect(lim.excedeu("ip1", t0)).toBe(false);
  });

  it("excede ao atingir o máximo dentro da janela", () => {
    const lim = criarLimitador(2, 60_000);
    const t0 = 1_000_000;
    lim.registrar("ip1", t0);
    lim.registrar("ip1", t0);
    expect(lim.excedeu("ip1", t0)).toBe(true);
  });

  it("reseta a contagem fora da janela", () => {
    const lim = criarLimitador(2, 60_000);
    const t0 = 1_000_000;
    lim.registrar("ip1", t0);
    lim.registrar("ip1", t0);
    expect(lim.excedeu("ip1", t0 + 61_000)).toBe(false);
  });

  it("mantém chaves diferentes isoladas", () => {
    const lim = criarLimitador(1, 60_000);
    const t0 = 1_000_000;
    lim.registrar("ip1", t0);
    expect(lim.excedeu("ip1", t0)).toBe(true);
    expect(lim.excedeu("ip2", t0)).toBe(false);
  });
});
