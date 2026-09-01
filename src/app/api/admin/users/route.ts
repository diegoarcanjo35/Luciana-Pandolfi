import { NextRequest, NextResponse } from "next/server";
import { requireRole } from "@/lib/auth";
import { hashPassword } from "@/lib/crypto";
import { isPasswordStrongEnough, MIN_PASSWORD_LENGTH } from "@/lib/password-policy";
import { listAdminUsers, createAdminUser, getAdminUserByEmail, type AdminRole } from "@/lib/db";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export async function GET() {
  const session = await requireRole(["superadmin"]);
  if (!session) {
    return NextResponse.json({ ok: false, error: "Acesso restrito ao superadmin." }, { status: 403 });
  }
  const users = await listAdminUsers();
  return NextResponse.json({ ok: true, users });
}

export async function POST(req: NextRequest) {
  const session = await requireRole(["superadmin"]);
  if (!session) {
    return NextResponse.json({ ok: false, error: "Acesso restrito ao superadmin." }, { status: 403 });
  }

  const body = (await req.json().catch(() => null)) as
    | { name?: unknown; email?: unknown; password?: unknown; role?: unknown; mustChangePassword?: unknown }
    | null;

  const name = typeof body?.name === "string" ? body.name.trim() : "";
  const email = typeof body?.email === "string" ? body.email.trim().toLowerCase() : "";
  const password = typeof body?.password === "string" ? body.password : "";
  const role = body?.role === "superadmin" ? "superadmin" : body?.role === "admin" ? "admin" : null;
  // Default true: toda conta nova nasce com senha temporária, a menos que quem está
  // criando desmarque explicitamente (ex.: recriando acesso combinado por outro canal).
  const mustChangePassword = body?.mustChangePassword !== false;

  const errors: string[] = [];
  if (!name) errors.push("Nome é obrigatório.");
  if (!EMAIL_RE.test(email)) errors.push("E-mail inválido.");
  if (!isPasswordStrongEnough(password)) errors.push(`Senha precisa ter pelo menos ${MIN_PASSWORD_LENGTH} caracteres.`);
  if (!role) errors.push("Papel inválido (use superadmin ou admin).");
  if (errors.length) {
    return NextResponse.json({ ok: false, error: errors.join(" ") }, { status: 400 });
  }

  const existing = await getAdminUserByEmail(email);
  if (existing) {
    return NextResponse.json({ ok: false, error: "Já existe uma conta com esse e-mail." }, { status: 409 });
  }

  const passwordHash = await hashPassword(password);
  const id = await createAdminUser({
    name,
    email,
    passwordHash,
    role: role as AdminRole,
    mustChangePassword,
  });

  return NextResponse.json({ ok: true, id });
}
