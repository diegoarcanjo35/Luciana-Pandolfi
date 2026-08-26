const FAQ_ITEMS = [
  {
    q: "A consultoria tem algum custo para mim?",
    a: "Não. A remuneração vem da operadora quando o contrato é fechado — o preço para você é o mesmo que seria contratando direto.",
  },
  {
    q: "Por que não contratar direto com a operadora?",
    a: "Porque a operadora só mostra os planos dela. A consultoria compara o mercado inteiro e acompanha você depois da assinatura, na hora em que surge um problema.",
  },
  {
    q: "Vocês atendem fora de São Paulo?",
    a: "Sim — atendimento em todo o Brasil, com especialização na rede hospitalar de São Paulo.",
  },
  {
    q: "Consigo manter meus médicos e hospitais?",
    a: "Depende da rede credenciada de cada opção. Isso é exatamente o que a análise verifica antes de qualquer recomendação.",
  },
  {
    q: "Quanto tempo leva?",
    a: "A análise fica pronta em até 24 horas úteis. A contratação varia conforme operadora e tipo de contrato.",
  },
  {
    q: "E se eu já tenho plano?",
    a: "Casos de revisão de contrato existente são frequentes — inclusive migração e portabilidade de carência.",
  },
  {
    q: "Meus dados ficam seguros?",
    a: "Uso apenas para a análise e o contato. Não são vendidos nem compartilhados. Política de privacidade disponível no rodapé.",
  },
];

export default function FAQAccordion() {
  return (
    <div className="mx-auto flex max-w-3xl flex-col divide-y divide-slate-200 rounded-2xl border border-slate-200 bg-white">
      {FAQ_ITEMS.map((item) => (
        <details key={item.q} className="group p-5 open:bg-slate-50/60">
          <summary className="flex cursor-pointer list-none items-center justify-between gap-4 font-medium text-[#0b2436]">
            {item.q}
            <span className="shrink-0 text-teal-600 transition-transform group-open:rotate-45">
              +
            </span>
          </summary>
          <p className="mt-3 text-sm leading-relaxed text-slate-600">{item.a}</p>
        </details>
      ))}
    </div>
  );
}
