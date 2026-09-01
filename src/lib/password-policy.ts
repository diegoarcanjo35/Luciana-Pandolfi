// Regra pura de força mínima de senha — sem I/O, testável sem D1. Reaproveitada na criação
// de conta (admin/usuarios) e na troca de senha própria (admin/trocar-senha).

export const MIN_PASSWORD_LENGTH = 10;

export function isPasswordStrongEnough(password: string): boolean {
  return password.length >= MIN_PASSWORD_LENGTH;
}
