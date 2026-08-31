// Hash de senha com PBKDF2-SHA256 via Web Crypto — disponível nativamente no runtime dos
// Workers (sem depender de bcrypt/argon2, que exigem bindings nativos incompatíveis com
// Workers). Formato armazenado: "pbkdf2$<iterações>$<salt hex>$<hash hex>".

const ITERATIONS = 100_000;
const KEY_LENGTH_BITS = 256;

function toHex(buffer: ArrayBuffer): string {
  return Array.from(new Uint8Array(buffer))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
}

function fromHex(hex: string): Uint8Array {
  const bytes = new Uint8Array(hex.length / 2);
  for (let i = 0; i < bytes.length; i++) {
    bytes[i] = parseInt(hex.substring(i * 2, i * 2 + 2), 16);
  }
  return bytes;
}

async function deriveBits(password: string, salt: Uint8Array, iterations: number) {
  const keyMaterial = await crypto.subtle.importKey(
    "raw",
    new TextEncoder().encode(password),
    "PBKDF2",
    false,
    ["deriveBits"]
  );
  return crypto.subtle.deriveBits(
    { name: "PBKDF2", salt: new Uint8Array(salt), iterations, hash: "SHA-256" },
    keyMaterial,
    KEY_LENGTH_BITS
  );
}

export async function hashPassword(password: string): Promise<string> {
  const salt = crypto.getRandomValues(new Uint8Array(16));
  const derived = await deriveBits(password, salt, ITERATIONS);
  return `pbkdf2$${ITERATIONS}$${toHex(salt.buffer as ArrayBuffer)}$${toHex(derived)}`;
}

/** Comparação em tempo constante para os hashes hex (mesmo comprimento sempre, por virem de SHA-256). */
function timingSafeEqualHex(a: string, b: string): boolean {
  if (a.length !== b.length) return false;
  let diff = 0;
  for (let i = 0; i < a.length; i++) {
    diff |= a.charCodeAt(i) ^ b.charCodeAt(i);
  }
  return diff === 0;
}

export async function verifyPassword(password: string, stored: string): Promise<boolean> {
  const parts = stored.split("$");
  if (parts.length !== 4 || parts[0] !== "pbkdf2") return false;
  const iterations = parseInt(parts[1], 10);
  if (!Number.isFinite(iterations) || iterations <= 0) return false;
  const salt = fromHex(parts[2]);
  const expectedHex = parts[3];
  const derived = await deriveBits(password, salt, iterations);
  return timingSafeEqualHex(toHex(derived), expectedHex);
}

export function generateOpaqueToken(byteLength = 32): string {
  const bytes = crypto.getRandomValues(new Uint8Array(byteLength));
  return toHex(bytes.buffer as ArrayBuffer);
}

/** SHA-256 hex de um texto qualquer — usado pra nunca gravar token de sessão em claro no D1. */
export async function sha256Hex(text: string): Promise<string> {
  const data = new TextEncoder().encode(text);
  const hashBuffer = await crypto.subtle.digest("SHA-256", data);
  return toHex(hashBuffer);
}

/**
 * Comparação em tempo constante para duas strings de comprimento arbitrário (ex.: senha do
 * caminho legado). Sempre percorre o comprimento do maior lado, mesmo quando os tamanhos
 * diferem, pra não vazar o comprimento da senha correta pelo tempo de resposta.
 */
export function timingSafeEqualString(a: string, b: string): boolean {
  const maxLength = Math.max(a.length, b.length);
  let diff = a.length === b.length ? 0 : 1;
  for (let i = 0; i < maxLength; i++) {
    const charA = i < a.length ? a.charCodeAt(i) : 0;
    const charB = i < b.length ? b.charCodeAt(i) : 0;
    diff |= charA ^ charB;
  }
  return diff === 0;
}
