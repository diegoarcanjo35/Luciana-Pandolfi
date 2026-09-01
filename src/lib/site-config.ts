// Configuração central do site. Números e textos "PENDENTE" precisam ser
// confirmados com a cliente antes do go-live — ver CLAUDE.md / README para a lista completa.

export const WHATSAPP_NUMBER = "5511956098194"; // formato E.164 sem "+"
export const WHATSAPP_DISPLAY = "(11) 95609-8194";

export function whatsappLink(message: string) {
  return `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;
}

/** Link do WhatsApp DO LEAD (não o nosso) — usado no painel admin pra equipe
 * chamar o lead direto, já com uma mensagem de abordagem padrão preenchida. */
export function leadWhatsappLink(whatsapp: string, nome: string) {
  const digits = whatsapp.replace(/\D/g, "");
  const primeiroNome = nome.trim().split(/\s+/)[0] || "";
  const mensagem = `Olá${primeiroNome ? `, ${primeiroNome}` : ""}! Aqui é da L&J Consultoria 😊 Vi que você solicitou uma análise gratuita de plano de saúde no nosso site. Posso te ajudar agora?`;
  return `https://wa.me/55${digits}?text=${encodeURIComponent(mensagem)}`;
}

export const WHATSAPP_MESSAGES = {
  home: "Olá! Vim pelo site e quero fazer minha simulação gratuita de plano de saúde.",
  empresarial:
    "Olá! Vim do anúncio da Alice Empresarial e quero saber mais sobre plano de saúde para minha empresa/CNPJ.",
  familiar:
    "Olá! Vim do anúncio da MedSênior e quero saber mais sobre como economizar no meu plano de saúde.",
  obrigado: "Olá! Acabei de preencher o formulário no site e gostaria de adiantar minha análise.",
} as const;

// Números de credibilidade — PENDENTE. A cliente ainda não passou estes dados.
// Não inventar. Enquanto não vierem, o bloco exibe um estado de placeholder visível só em admin/staging.
export const CREDIBILITY_STATS = {
  anosDeMercado: null as number | null,
  familiasEEmpresasAtendidas: null as number | null,
};

// Pixel da Meta — não é segredo (fica exposto no HTML do navegador de qualquer forma).
// O token da API de Conversões é diferente: NUNCA colocar aqui, só como secret do Worker
// (variável de ambiente META_CAPI_TOKEN), lido só no servidor. Ver src/lib/meta-capi.ts.
export const META_PIXEL_ID = "1009645534315662";

export const SITE_NAME = "L&J Consultoria | Planos de Saúde";
export const SITE_DESCRIPTION =
  "Consultoria gratuita e independente em planos de saúde em São Paulo. Comparação de mercado, acesso a hospitais de referência e simulação sem custo.";

// Domínio definitivo ainda não existe (registro é responsabilidade da cliente — ver README).
// Usamos a URL real de staging no Cloudflare Workers como base de metadados/OG por enquanto;
// trocar assim que o domínio próprio estiver registrado e apontado.
export const SITE_URL = "https://luciana-pandolfi.criativoselevados.workers.dev";
