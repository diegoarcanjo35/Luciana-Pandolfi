import { cookies } from "next/headers";
import { getCloudflareContext } from "@opennextjs/cloudflare";

const COOKIE_NAME = "lp_admin_session";

async function sha256(text: string) {
  const data = new TextEncoder().encode(text);
  const hashBuffer = await crypto.subtle.digest("SHA-256", data);
  return Array.from(new Uint8Array(hashBuffer))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
}

async function getAdminPassword() {
  const { env } = await getCloudflareContext({ async: true });
  return env.ADMIN_PASSWORD;
}

async function expectedToken() {
  const password = await getAdminPassword();
  if (!password) {
    throw new Error("ADMIN_PASSWORD não configurado nas variáveis de ambiente.");
  }
  return sha256(`lp-admin:${password}`);
}

export async function verifyPassword(password: string) {
  const configured = await getAdminPassword();
  if (!configured) return false;
  return password === configured;
}

export async function createSessionCookie() {
  const token = await expectedToken();
  const store = await cookies();
  store.set(COOKIE_NAME, token, {
    httpOnly: true,
    secure: true,
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 12, // 12h
  });
}

export async function destroySessionCookie() {
  const store = await cookies();
  store.delete(COOKIE_NAME);
}

export async function isAuthenticated() {
  const store = await cookies();
  const value = store.get(COOKIE_NAME)?.value;
  if (!value) return false;
  try {
    const expected = await expectedToken();
    return value === expected;
  } catch {
    return false;
  }
}
