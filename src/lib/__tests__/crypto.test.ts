import { describe, it, expect } from "vitest";
import {
  hashPassword,
  verifyPassword,
  generateOpaqueToken,
  sha256Hex,
  timingSafeEqualString,
} from "../crypto";

describe("hashPassword / verifyPassword", () => {
  it("verifica a senha correta", async () => {
    const hash = await hashPassword("uma-senha-bem-forte-123");
    expect(await verifyPassword("uma-senha-bem-forte-123", hash)).toBe(true);
  });

  it("rejeita senha incorreta", async () => {
    const hash = await hashPassword("uma-senha-bem-forte-123");
    expect(await verifyPassword("outra-senha", hash)).toBe(false);
  });

  it("dois hashes da mesma senha são diferentes (salt aleatório)", async () => {
    const a = await hashPassword("mesma-senha-123456");
    const b = await hashPassword("mesma-senha-123456");
    expect(a).not.toBe(b);
    expect(await verifyPassword("mesma-senha-123456", a)).toBe(true);
    expect(await verifyPassword("mesma-senha-123456", b)).toBe(true);
  });

  it("rejeita hash malformado sem lançar exceção", async () => {
    expect(await verifyPassword("qualquer-coisa", "hash-invalido")).toBe(false);
  });
});

describe("generateOpaqueToken", () => {
  it("gera tokens diferentes a cada chamada", () => {
    const a = generateOpaqueToken();
    const b = generateOpaqueToken();
    expect(a).not.toBe(b);
    expect(a).toHaveLength(64); // 32 bytes em hex
  });
});

describe("sha256Hex — usado pra nunca gravar o token bruto de sessão no D1", () => {
  it("é determinístico (mesmo texto -> mesmo hash)", async () => {
    const a = await sha256Hex("um-token-de-sessao-qualquer");
    const b = await sha256Hex("um-token-de-sessao-qualquer");
    expect(a).toBe(b);
  });

  it("o hash nunca é igual ao texto original (o token bruto não aparece no valor gravado)", async () => {
    const token = "meu-token-secreto-de-sessao";
    const hash = await sha256Hex(token);
    expect(hash).not.toBe(token);
    expect(hash).toHaveLength(64);
  });

  it("textos diferentes produzem hashes diferentes", async () => {
    const a = await sha256Hex("token-a");
    const b = await sha256Hex("token-b");
    expect(a).not.toBe(b);
  });
});

describe("timingSafeEqualString", () => {
  it("aceita strings iguais", () => {
    expect(timingSafeEqualString("senha-correta", "senha-correta")).toBe(true);
  });

  it("rejeita strings diferentes do mesmo tamanho", () => {
    expect(timingSafeEqualString("senha-correta", "senha-errada!")).toBe(false);
  });

  it("rejeita strings de tamanhos diferentes sem lançar exceção", () => {
    expect(timingSafeEqualString("curta", "muito-mais-longa-que-a-primeira")).toBe(false);
  });

  it("rejeita string vazia contra não-vazia", () => {
    expect(timingSafeEqualString("", "algo")).toBe(false);
  });

  it("aceita duas strings vazias", () => {
    expect(timingSafeEqualString("", "")).toBe(true);
  });
});
