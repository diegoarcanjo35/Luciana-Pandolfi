import { describe, it, expect } from "vitest";
import { hashPassword, verifyPassword, generateOpaqueToken } from "../crypto";

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
