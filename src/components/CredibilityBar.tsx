// Barra de credibilidade — bloco 2 da Home no briefing.
// "+X anos de mercado" e "+X famílias e empresas atendidas" ficam FORA por enquanto:
// são números que a cliente ainda não passou, e o briefing proíbe inventar estatística.
// Assim que ela confirmar os valores, adicionar como novos itens no array abaixo.
const ITEMS = [
  "Todas as principais operadoras do mercado analisadas",
  "Consultoria sem custo para o cliente",
];

export default function CredibilityBar() {
  return (
    <div className="border-y border-slate-200 bg-white">
      <div className="mx-auto flex max-w-5xl flex-wrap items-center justify-center gap-x-10 gap-y-3 px-4 py-5 text-center text-sm font-medium text-slate-600 sm:px-6">
        {ITEMS.map((item) => (
          <span key={item} className="flex items-center gap-2">
            <span aria-hidden className="h-1.5 w-1.5 rounded-full bg-teal-600" />
            {item}
          </span>
        ))}
      </div>
    </div>
  );
}
