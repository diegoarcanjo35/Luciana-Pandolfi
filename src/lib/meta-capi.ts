import { getCloudflareContext } from "@opennextjs/cloudflare";
import { META_PIXEL_ID } from "@/lib/site-config";

async function sha256Hex(text: string): Promise<string> {
  const data = new TextEncoder().encode(text.trim().toLowerCase());
  const hashBuffer = await crypto.subtle.digest("SHA-256", data);
  return Array.from(new Uint8Array(hashBuffer))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
}

function normalizePhoneForHash(whatsapp: string): string {
  const digits = whatsapp.replace(/\D/g, "");
  // Garante prefixo de país (55) — os formulários só coletam números do Brasil.
  return digits.startsWith("55") ? digits : `55${digits}`;
}

export interface LeadEventInput {
  eventId: string;
  eventSourceUrl: string;
  nome: string;
  whatsapp: string;
  email?: string | null;
  clientIp?: string | null;
  clientUserAgent?: string | null;
  campaign?: string | null;
}

/**
 * Dispara o evento "Lead" para a API de Conversões da Meta (server-side).
 * Não lança erro para o chamador — falha de tracking nunca deve derrubar a
 * gravação do lead. Loga no console em caso de erro pra dar pra investigar.
 */
export async function sendLeadEventServerSide(input: LeadEventInput): Promise<void> {
  let token: string | undefined;
  let testEventCode: string | undefined;
  try {
    const { env } = await getCloudflareContext({ async: true });
    token = env.META_CAPI_TOKEN;
    testEventCode = env.META_CAPI_TEST_EVENT_CODE;
  } catch {
    return;
  }

  if (!token) {
    console.log("[meta-capi:bypass] META_CAPI_TOKEN não configurado — evento Lead não enviado.");
    return;
  }

  const [hashedPhone, hashedEmail] = await Promise.all([
    sha256Hex(normalizePhoneForHash(input.whatsapp)),
    input.email ? sha256Hex(input.email) : Promise.resolve(undefined),
  ]);

  const payload = {
    data: [
      {
        event_name: "Lead",
        event_time: Math.floor(Date.now() / 1000),
        event_id: input.eventId,
        action_source: "website",
        event_source_url: input.eventSourceUrl,
        user_data: {
          ph: [hashedPhone],
          ...(hashedEmail ? { em: [hashedEmail] } : {}),
          ...(input.clientIp ? { client_ip_address: input.clientIp } : {}),
          ...(input.clientUserAgent ? { client_user_agent: input.clientUserAgent } : {}),
        },
        custom_data: input.campaign ? { campaign: input.campaign } : undefined,
      },
    ],
    ...(testEventCode ? { test_event_code: testEventCode } : {}),
  };

  try {
    const res = await fetch(
      `https://graph.facebook.com/v21.0/${META_PIXEL_ID}/events?access_token=${token}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      }
    );
    if (!res.ok) {
      const text = await res.text();
      console.error("[meta-capi] Falha ao enviar evento Lead", res.status, text);
    }
  } catch (err) {
    console.error("[meta-capi] Erro de rede ao enviar evento Lead", err);
  }
}
