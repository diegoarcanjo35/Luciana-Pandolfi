import { describe, expect, it } from "vitest";
import { isPasswordStrongEnough, MIN_PASSWORD_LENGTH } from "@/lib/password-policy";

describe("isPasswordStrongEnough", () => {
  it("rejeita senhas mais curtas que o mínimo", () => {
    expect(isPasswordStrongEnough("a".repeat(MIN_PASSWORD_LENGTH - 1))).toBe(false);
  });

  it("aceita senhas com exatamente o mínimo de caracteres", () => {
    expect(isPasswordStrongEnough("a".repeat(MIN_PASSWORD_LENGTH))).toBe(true);
  });

  it("aceita senhas mais longas que o mínimo", () => {
    expect(isPasswordStrongEnough("a".repeat(MIN_PASSWORD_LENGTH + 5))).toBe(true);
  });

  it("rejeita string vazia", () => {
    expect(isPasswordStrongEnough("")).toBe(false);
  });
});
