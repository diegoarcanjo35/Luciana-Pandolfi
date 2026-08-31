// Regras puras de proteção de contas administrativas — sem I/O, testáveis sem D1.

export interface DeactivationTarget {
  id: number;
  role: "superadmin" | "admin";
  status: "active" | "inactive";
}

export interface DeactivationCheck {
  allowed: boolean;
  reason?: string;
}

/**
 * Decide se uma tentativa de desativar `target` pode prosseguir.
 * - Ninguém desativa a própria conta (evita se trancar fora sem querer).
 * - O último superadmin ativo nunca pode ser desativado.
 */
export function canDeactivateUser(
  target: DeactivationTarget,
  actorUserId: number | null,
  activeSuperadminCount: number
): DeactivationCheck {
  if (actorUserId !== null && actorUserId === target.id) {
    return { allowed: false, reason: "Você não pode desativar a própria conta." };
  }
  if (target.role === "superadmin" && target.status === "active" && activeSuperadminCount <= 1) {
    return { allowed: false, reason: "Não é possível desativar o último superadmin ativo." };
  }
  return { allowed: true };
}
