// Configuração central do site. Números e textos "PENDENTE" precisam ser
// confirmados com a cliente antes do go-live — ver CLAUDE.md / README para a lista completa.

export const WHATSAPP_NUMBER = "5511956098194"; // formato E.164 sem "+"
export const WHATSAPP_DISPLAY = "(11) 95609-8194";

export function whatsappLink(message: string) {
  return `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;
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
