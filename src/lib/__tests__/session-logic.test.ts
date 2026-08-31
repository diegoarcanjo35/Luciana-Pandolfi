import { describe, it, expect } from "vitest";
import { isDbSessionValid, isLegacyAdminEnabled } from "../session-logic";

const NOW = "2026-09-01T12:00:00.000Z";

describe("isDbSessionValid", () => {
  const activeUser = { status: "active" as const };
  const inactiveUser = { status: "inactive" as const };

  it("aceita sessão válida de usuário ativo", () => {
    const session = { expires_at: "2026-09-02T00:00:00.000Z", revoked_at: null };
    expect(isDbSessionValid(session, activeUser, NOW)).toBe(true);
  });

  it("rejeita quando não há sessão", () => {
    expect(isDbSessionValid(null, activeUser, NOW)).toBe(false);
  });

  it("rejeita sessão revogada", () => {
    const session = { expires_at: "2026-09-02T00:00:00.000Z", revoked_at: "2026-09-01T10:00:00.000Z" };
    expect(isDbSessionValid(session, activeUser, NOW)).toBe(false);
  });

  it("rejeita sessão expirada", () => {
    const session = { expires_at: "2026-08-31T00:00:00.000Z", revoked_at: null };
    expect(isDbSessionValid(session, activeUser, NOW)).toBe(false);
  });

  it("rejeita no instante exato de expiração (expires_at <= now)", () => {
    const session = { expires_at: NOW, revoked_at: null };
    expect(isDbSessionValid(session, activeUser, NOW)).toBe(false);
  });

  it("rejeita quando o usuário está inativo, mesmo com sessão válida", () => {
    const session = { expires_at: "2026-09-02T00:00:00.000Z", revoked_at: null };
    expect(isDbSessionValid(session, inactiveUser, NOW)).toBe(false);
  });

  it("rejeita quando o usuário não existe mais", () => {
    const session = { expires_at: "2026-09-02T00:00:00.000Z", revoked_at: null };
    expect(isDbSessionValid(session, null, NOW)).toBe(false);
  });
});

describe("isLegacyAdminEnabled", () => {
  it("habilitado por padrão (variável não definida)", () => {
    expect(isLegacyAdminEnabled(undefined)).toBe(true);
  });

  it("habilitado com qualquer valor que não seja 'false'", () => {
    expect(isLegacyAdminEnabled("true")).toBe(true);
    expect(isLegacyAdminEnabled("1")).toBe(true);
    expect(isLegacyAdminEnabled("")).toBe(true);
  });

  it("desabilitado só com a string exata 'false'", () => {
    expect(isLegacyAdminEnabled("false")).toBe(false);
  });
});
