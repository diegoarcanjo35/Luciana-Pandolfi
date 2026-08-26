// Bloco 6 do briefing (prova social). Conteúdo real (depoimentos, prints, fotos de
// visita a operadora/hospital) ainda não existe — a cliente foi acionada pra enviar.
// Por instrução explícita: não deixar o bloco ausente enquanto isso não chega, então
// ele fica montado com um estado "em breve" honesto, pronto pra receber o conteúdo
// real assim que a Luciana/Jhonatan mandarem. Trocar os `<PLACEHOLDER>` abaixo pelos
// depoimentos reais (nome, resultado concreto, foto) — nunca inventar um.
const SLOTS = [
  { label: "Empresa (CNPJ)" },
  { label: "Família" },
  { label: "Sênior" },
];

export default function SocialProofPending() {
  return (
    <section className="bg-white px-4 py-16 sm:px-6">
      <div className="mx-auto max-w-5xl">
        <p className="eyebrow text-center">Prova social</p>
        <h2 className="mt-2 text-center font-serif-display text-2xl font-semibold text-navy sm:text-3xl">
          O que quem já passou pela consultoria diz
        </h2>
        <div className="mt-10 grid gap-6 sm:grid-cols-3">
          {SLOTS.map((slot) => (
            <div
              key={slot.label}
              className="flex flex-col items-center gap-3 rounded-2xl border border-dashed border-gold/50 bg-cream/50 p-6 text-center"
            >
              <span aria-hidden className="font-serif-display text-3xl text-gold/70">
                &ldquo;
              </span>
              <p className="text-sm font-medium text-navy/50">
                Depoimento verificado — {slot.label}
              </p>
              <p className="text-xs text-navy/35">Em breve</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
