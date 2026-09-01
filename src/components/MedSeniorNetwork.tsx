import Image from "next/image";

// Rede hospitalar confirmada especificamente para a MedSênior (áudio da Luciana,
// 2026-08-31/09-01, cruzado com "Rede Medsenior Setembro 2026.pdf"). Fotos reais das
// fachadas, fornecidas pela Luciana — não geradas por IA. Diferente do HospitalNetwork
// genérico da Home, esta seção é específica da campanha MedSênior porque a rede foi
// confirmada operadora por operadora, não é uma lista universal.
const HOSPITALS = [
  { name: "Hospital São Camilo", image: "/creatives/hospitais/sao-camilo.jpg" },
  { name: "Hospital Samaritano", image: "/creatives/hospitais/samaritano.jpg" },
  { name: "Hospital Nove de Julho", image: "/creatives/hospitais/nove-de-julho.jpg" },
  { name: "Hospital Santa Catarina", image: "/creatives/hospitais/santa-catarina.jpg" },
  { name: "Hospital Alemão Oswaldo Cruz", image: "/creatives/hospitais/oswaldo-cruz.jpg" },
];

export default function MedSeniorNetwork() {
  return (
    <section className="bg-white px-4 py-16 sm:px-6">
      <div className="mx-auto max-w-4xl">
        <p className="text-xs font-semibold uppercase tracking-widest text-medsenior">
          Rede hospitalar
        </p>
        <h2 className="headline-editorial mt-2 max-w-lg text-2xl text-navy sm:text-3xl">
          Hospitais de referência que podem estar no seu acesso
        </h2>
        <p className="mt-4 max-w-xl text-sm leading-relaxed text-navy/60">
          A disponibilidade de cada hospital depende da categoria contratada — a análise
          gratuita confirma exatamente o que o seu plano cobre antes de você decidir.
        </p>

        <div className="mt-8 grid gap-4 sm:grid-cols-3">
          {HOSPITALS.map((hospital) => (
            <div
              key={hospital.name}
              className="overflow-hidden rounded-sm border border-navy/10 bg-cream/40 shadow-sm"
            >
              <div className="relative aspect-[4/3]">
                <Image
                  src={hospital.image}
                  alt={hospital.name}
                  fill
                  sizes="(min-width: 640px) 33vw, 100vw"
                  className="object-cover"
                />
              </div>
              <p className="px-3 py-2.5 text-sm font-medium text-navy">{hospital.name}</p>
            </div>
          ))}
        </div>

        <p className="mt-6 text-xs leading-relaxed text-navy/45">
          A disponibilidade de cada hospital depende da categoria contratada e da rede
          credenciada vigente. A inclusão é confirmada individualmente durante a análise.
        </p>
      </div>
    </section>
  );
}
