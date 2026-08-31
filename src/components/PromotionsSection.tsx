interface PublicPromotion {
  slug: string;
  operator_name: string;
  title: string;
  short_description: string;
  benefit_value: string | null;
  eligible_products: string | null;
  eligible_audience: string | null;
  eligible_locations: string | null;
  starts_at: string;
  ends_at: string | null;
  is_featured: boolean;
  public_cta_label: string;
  public_cta_target: string;
}

function formatDateBR(iso: string): string {
  const [y, m, d] = iso.split("-");
  return `${d}/${m}/${y}`;
}

/** A query string precisa vir ANTES do fragmento (#) numa URL — nunca depois. */
function buildPromoCtaHref(target: string, slug: string): string {
  const hashIndex = target.indexOf("#");
  const base = hashIndex === -1 ? target : target.slice(0, hashIndex);
  const hash = hashIndex === -1 ? "" : target.slice(hashIndex);
  const separator = base.includes("?") ? "&" : "?";
  return `${base}${separator}promo=${encodeURIComponent(slug)}${hash}`;
}

// Seção pública — só renderiza se houver ao menos uma promoção efetivamente ativa
// (calculado no servidor, em America/Sao_Paulo). Nunca mostra nota interna, fonte
// administrativa, nome de quem cadastrou ou qualquer remuneração de corretor.
export default function PromotionsSection({ promotions }: { promotions: PublicPromotion[] }) {
  if (promotions.length === 0) return null;

  return (
    <section className="bg-white px-4 py-16 sm:px-6">
      <div className="mx-auto max-w-4xl">
        <p className="eyebrow text-center">Condições comerciais vigentes</p>
        <h2 className="headline-editorial mt-2 text-center text-2xl text-navy sm:text-3xl">
          Campanhas disponíveis agora
        </h2>
        <p className="mx-auto mt-3 max-w-xl text-center text-sm leading-relaxed text-navy/55">
          Campanhas disponibilizadas pelas operadoras para produtos, perfis e regiões
          específicos. A elegibilidade e as condições são confirmadas individualmente durante a
          análise.
        </p>

        <div className="mt-10 flex flex-col divide-y divide-navy/10 border-y border-navy/10">
          {promotions.map((promo) => (
            <div key={promo.slug} className="flex flex-col gap-2 py-6 sm:flex-row sm:items-start sm:gap-8">
              <div className="sm:w-40 sm:shrink-0">
                <p className="text-xs font-semibold uppercase tracking-widest text-gold-dark">
                  {promo.operator_name}
                </p>
                {promo.is_featured && (
                  <span className="mt-1 inline-block text-[0.65rem] font-semibold uppercase tracking-wide text-navy/40">
                    Destaque
                  </span>
                )}
              </div>
              <div className="flex-1">
                <p className="font-serif-display text-lg text-navy">{promo.title}</p>
                <p className="mt-1 text-sm leading-relaxed text-navy/60">{promo.short_description}</p>
                <dl className="mt-3 flex flex-wrap gap-x-6 gap-y-1 text-xs text-navy/45">
                  {promo.eligible_audience && (
                    <div>
                      <dt className="inline font-medium">Público: </dt>
                      <dd className="inline">{promo.eligible_audience}</dd>
                    </div>
                  )}
                  {promo.eligible_locations && (
                    <div>
                      <dt className="inline font-medium">Região: </dt>
                      <dd className="inline">{promo.eligible_locations}</dd>
                    </div>
                  )}
                  <div>
                    <dt className="inline font-medium">Vigência: </dt>
                    <dd className="inline">
                      {formatDateBR(promo.starts_at)}
                      {promo.ends_at ? ` a ${formatDateBR(promo.ends_at)}` : " — sem data de encerramento definida"}
                    </dd>
                  </div>
                </dl>
              </div>
              <div className="sm:shrink-0">
                <a
                  href={buildPromoCtaHref(promo.public_cta_target, promo.slug)}
                  className="inline-block rounded-full bg-gold px-5 py-2.5 text-sm font-semibold text-navy transition-colors hover:bg-gold-light"
                >
                  {promo.public_cta_label}
                </a>
              </div>
            </div>
          ))}
        </div>

        <p className="mt-6 text-center text-xs leading-relaxed text-navy/45">
          Condições sujeitas às regras da operadora, elegibilidade, disponibilidade regional e
          vigência da campanha. A confirmação é realizada durante a análise.
        </p>
      </div>
    </section>
  );
}
