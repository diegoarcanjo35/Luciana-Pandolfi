// Seção editorial sobre análise de rede hospitalar — pedido da cliente (dois áudios,
// resumidos no README). Só nomes, sem foto/logo (nenhum asset autorizado ainda) e sem
// prometer cobertura: a rede credenciada real depende de operadora/produto/categoria,
// confirmada individualmente durante a análise. Ver README para a íntegra da regra.
//
// Lista atualizada em 2026-09-01 com os hospitais que a Luciana confirmou por áudio
// como referência real de São Paulo (documento "Rede Medsenior Setembro 2026.pdf").
// Substitui a lista genérica anterior (Einstein, Sírio-Libanês, D'Or, Beneficência
// Portuguesa), que nunca foi confirmada por nenhuma operadora específica.
const HOSPITALS = [
  "Hospital São Camilo",
  "Hospital Samaritano",
  "Hospital Nove de Julho",
  "Hospital Santa Catarina",
  "Hospital Oswaldo Cruz",
];

export default function HospitalNetwork() {
  return (
    <section className="bg-cream-dark/40 px-4 py-16 sm:px-6">
      <div className="mx-auto grid max-w-4xl gap-10 sm:grid-cols-[1fr_1.1fr] sm:items-start">
        <div>
          <p className="eyebrow">Rede hospitalar</p>
          <h2 className="headline-editorial mt-2 text-2xl text-navy sm:text-3xl">
            Uma análise que começa pelos hospitais importantes para você.
          </h2>
          <p className="mt-4 text-sm leading-relaxed text-navy/60">
            A L&amp;J compara operadoras, produtos e categorias considerando seu perfil, sua
            região e a rede que você deseja utilizar.
          </p>
          <a
            href="#simulacao"
            className="mt-6 inline-block rounded-full bg-gold px-6 py-3 text-sm font-semibold text-navy transition-colors hover:bg-gold-light"
          >
            Analisar minha rede hospitalar
          </a>
        </div>

        <div>
          <p className="text-sm text-navy/50">
            Entre as instituições que podem ser consideradas em uma análise de rede em São Paulo
            estão:
          </p>
          <ul className="mt-4 flex flex-col divide-y divide-navy/10 border-y border-navy/10">
            {HOSPITALS.map((hospital, i) => (
              <li key={hospital} className="flex items-baseline gap-3 py-3">
                <span aria-hidden className="numeral w-7 shrink-0 text-lg">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <span className="text-sm font-medium text-navy sm:text-base">{hospital}</span>
              </li>
            ))}
          </ul>
          <p className="mt-4 text-xs leading-relaxed text-navy/45">
            A disponibilidade de cada hospital depende da operadora, do produto, da categoria
            contratada e da rede credenciada vigente. A inclusão é confirmada individualmente
            durante a análise.
          </p>
        </div>
      </div>
    </section>
  );
}
