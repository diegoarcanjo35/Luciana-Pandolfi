// Lista real das operadoras analisadas, confirmada pelo cliente — substancia a
// alegação "todas as principais operadoras" já usada na CredibilityBar.
const OPERATORS = [
  "Alice",
  "Amil",
  "Bradesco",
  "Care Plus",
  "Hapvida",
  "MedSênior",
  "Omint",
  "Porto Seguro",
  "São Camilo",
  "Proasa",
  "Sami",
  "São Cristóvão",
  "Bluemed",
  "SulAmérica",
  "Seguros Unimed",
  "Trasmontano",
  "Unimed Guarulhos",
];

export default function OperatorsList() {
  return (
    <section className="border-b border-navy/10 bg-cream-dark/40 px-4 py-10 sm:px-6">
      <div className="mx-auto max-w-4xl text-center">
        <p className="text-xs font-semibold uppercase tracking-widest text-navy/40">
          Operadoras que já analisamos
        </p>
        <div className="mt-4 flex flex-wrap items-center justify-center gap-x-2 gap-y-2 text-sm text-navy/60">
          {OPERATORS.map((operator, i) => (
            <span key={operator}>
              {operator}
              {i < OPERATORS.length - 1 && <span className="text-navy/25"> · </span>}
            </span>
          ))}
        </div>
      </div>
    </section>
  );
}
