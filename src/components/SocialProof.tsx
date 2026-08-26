// Depoimentos reais, verificados no perfil público do Google (L&J Seguros, mesmo
// telefone e responsável do site: (11) 95609-8194 / Luciana Pandolfi). Nenhum
// depoimento expõe condição de saúde do cliente — só a experiência com o atendimento.
const TESTIMONIALS = [
  {
    quote:
      "Ótima corretora. A Luciana me ajudou a escolher outro plano para sair do anterior que estava com problemas de descredenciamento em massa e atendimento quase inexistente.",
    author: "Rodolfo Rodrigues",
  },
  {
    quote:
      "A Luciana Pandolfi, agradeço pelo excelente atendimento e por toda a orientação prestada. Sua atenção e profissionalismo foram fundamentais para a melhor escolha do meu convênio.",
    author: "Andreia Ventura",
  },
];

export default function SocialProof() {
  return (
    <section className="bg-white px-4 py-16 sm:px-6">
      <div className="mx-auto max-w-4xl">
        <p className="eyebrow text-center">Prova social</p>
        <h2 className="mt-2 text-center headline-editorial text-2xl text-navy sm:text-3xl">
          O que quem já passou pela consultoria diz
        </h2>
        <p className="mt-3 text-center text-sm text-navy/45">
          Avaliações verificadas no perfil público do Google (L&amp;J Seguros)
        </p>
        <div className="mt-10 grid gap-6 sm:grid-cols-2">
          {TESTIMONIALS.map((t) => (
            <div key={t.author} className="border border-navy/10 bg-cream/40 p-7">
              <span aria-hidden className="font-serif-display text-3xl text-gold/70">
                &ldquo;
              </span>
              <p className="mt-1 text-sm leading-relaxed text-navy/70">{t.quote}</p>
              <div className="mt-5 flex items-center gap-2">
                <span aria-hidden className="text-gold">
                  ★★★★★
                </span>
                <p className="text-sm font-semibold text-navy">{t.author}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
