import { NextRequest, NextResponse } from "next/server";
import {
  attemptRealLogin,
  createLegacySessionCookie,
  createRealSessionCookie,
  verifyLegacyPassword,
  getClientIdentifier,
  checkLoginRateLimit,
  registerLoginFailure,
  registerLoginSuccess,
} from "@/lib/auth";

const GENERIC_ERROR = "E-mail ou senha inválidos.";

function lockedResponse(retryAfterMinutes: number | undefined) {
  return NextResponse.json(
    {
      ok: false,
      error: `Muitas tentativas. Tente novamente em ${retryAfterMinutes ?? 15} minuto(s).`,
    },
    { status: 429 }
  );
}

export async function POST(req: NextRequest) {
  const body = (await req.json().catch(() => null)) as
    | { email?: unknown; password?: unknown }
    | null;
  const password = typeof body?.password === "string" ? body.password : "";
  const email = typeof body?.email === "string" ? body.email.trim() : "";

  const identifier = await getClientIdentifier(email || "legacy");
  const preCheck = await checkLoginRateLimit(identifier);
  if (preCheck.locked) return lockedResponse(preCheck.retryAfterMinutes);

  // Login real (conta individual em admin_users)
  if (email) {
    const result = await attemptRealLogin(email, password);
    if (!result.ok) {
      const after = await registerLoginFailure(identifier);
      if (after.locked) return lockedResponse(after.retryAfterMinutes);
      return NextResponse.json({ ok: false, error: GENERIC_ERROR }, { status: 401 });
    }
    await registerLoginSuccess(identifier);
    await createRealSessionCookie(result.userId);
    return NextResponse.json({ ok: true });
  }

  // Login legado (compatibilidade — mesma senha única de sempre)
  const legacyOk = await verifyLegacyPassword(password);
  if (!legacyOk) {
    const after = await registerLoginFailure(identifier);
    if (after.locked) return lockedResponse(after.retryAfterMinutes);
    return NextResponse.json({ ok: false, error: GENERIC_ERROR }, { status: 401 });
  }
  await registerLoginSuccess(identifier);
  await createLegacySessionCookie();
  return NextResponse.json({ ok: true });
}
