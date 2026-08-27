import { describe, it, expect } from "vitest";
import { canDeactivateUser } from "../admin-users";

describe("canDeactivateUser", () => {
  it("permite desativar um admin comum, com outro ator e mais de um superadmin", () => {
    const target = { id: 2, role: "admin" as const, status: "active" as const };
    expect(canDeactivateUser(target, 1, 2).allowed).toBe(true);
  });

  it("impede um superadmin de desativar a própria conta", () => {
    const target = { id: 1, role: "superadmin" as const, status: "active" as const };
    const result = canDeactivateUser(target, 1, 2);
    expect(result.allowed).toBe(false);
    expect(result.reason).toMatch(/própria conta/);
  });

  it("impede desativar o último superadmin ativo", () => {
    const target = { id: 2, role: "superadmin" as const, status: "active" as const };
    const result = canDeactivateUser(target, 1, 1);
    expect(result.allowed).toBe(false);
    expect(result.reason).toMatch(/último superadmin/);
  });

  it("permite desativar um superadmin quando existe outro superadmin ativo", () => {
    const target = { id: 2, role: "superadmin" as const, status: "active" as const };
    expect(canDeactivateUser(target, 1, 2).allowed).toBe(true);
  });

  it("permite 'desativar' um superadmin já inativo (idempotente, não conta pro limite)", () => {
    const target = { id: 2, role: "superadmin" as const, status: "inactive" as const };
    expect(canDeactivateUser(target, 1, 1).allowed).toBe(true);
  });

  it("sessão legada (actorUserId null) ainda respeita a proteção do último superadmin", () => {
    const target = { id: 2, role: "superadmin" as const, status: "active" as const };
    const result = canDeactivateUser(target, null, 1);
    expect(result.allowed).toBe(false);
  });
});
