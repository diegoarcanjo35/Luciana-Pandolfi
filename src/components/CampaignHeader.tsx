import Link from "next/link";

/** Header enxuto para landing pages de campanha — marca L&J, identificação
 * discreta da campanha, CTA único, link discreto de volta pra Home. Sem
 * navegação institucional: cada landing existe só pra atender ao tráfego
 * daquele anúncio específico, e links extras vazam atenção da conversão. */
export default function CampaignHeader({
  ctaHref,
  ctaLabel,
  campaignLabel,
  accentClass,
}: {
  ctaHref: string;
  ctaLabel: string;
  campaignLabel: string;
  accentClass: string;
}) {
  return (
    <header className="sticky top-0 z-40 border-b border-navy/10 bg-cream/95 backdrop-blur">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3 sm:px-6">
        <div className="flex items-center gap-2.5">
          <span
            aria-hidden
            className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-gold/70 bg-navy font-serif-display text-sm text-gold-light"
          >
            L&J
          </span>
          <div className="flex flex-col leading-tight">
            <span className="font-serif-display text-base font-semibold text-navy sm:text-lg">
              L&amp;J Consultoria
            </span>
            <span className={`text-[0.68rem] font-semibold uppercase tracking-wide ${accentClass}`}>
              {campaignLabel}
            </span>
          </div>
        </div>
        <div className="flex items-center gap-4">
          <Link
            href="/"
            className="hidden text-xs font-medium text-navy/45 underline decoration-navy/20 underline-offset-4 hover:text-navy/70 sm:inline"
          >
            Voltar à Home
          </Link>
          <a
            href={ctaHref}
            className="rounded-full bg-gold px-4 py-2 text-sm font-semibold text-navy transition-colors hover:bg-gold-light"
          >
            {ctaLabel}
          </a>
        </div>
      </div>
    </header>
  );
}
