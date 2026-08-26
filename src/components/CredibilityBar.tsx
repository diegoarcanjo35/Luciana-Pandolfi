// Barra de credibilidade — bloco 2 da Home no briefing.
// "+X famílias e empresas atendidas" fica FORA por enquanto: é um número que a
// cliente ainda não confirmou, e o briefing proíbe inventar estatística. Assim que
// ela confirmar o valor, adicionar como novo item no array abaixo.
const ITEMS = [
  "6 anos de mercado",
  "Todas as principais operadoras do mercado analisadas",
  "Consultoria sem custo para o cliente",
];

export default function CredibilityBar() {
  return (
    <div className="bg-navy">
      <div className="mx-auto flex max-w-5xl flex-wrap items-center justify-center gap-x-10 gap-y-3 px-4 py-5 text-center text-sm font-medium text-cream/90 sm:px-6">
        {ITEMS.map((item) => (
          <span key={item} className="flex items-center gap-2">
            <span aria-hidden className="h-1.5 w-1.5 rounded-full bg-gold" />
            {item}
          </span>
        ))}
      </div>
    </div>
  );
}
