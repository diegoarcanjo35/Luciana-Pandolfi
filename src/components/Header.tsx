import Link from "next/link";

export default function Header({ ctaHref = "#simulacao" }: { ctaHref?: string }) {
  return (
    <header className="sticky top-0 z-40 border-b border-navy/10 bg-cream/90 backdrop-blur">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3 sm:px-6">
        <Link href="/" className="flex items-center gap-2.5">
          <span
            aria-hidden
            className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-gold/70 bg-navy font-serif-display text-sm text-gold-light"
          >
            L&J
          </span>
          <span className="font-serif-display text-lg font-semibold text-navy sm:text-xl">
            Luciana Pandolfi
            <span className="ml-2 hidden text-sm font-normal text-navy/50 sm:inline">
              Planos de Saúde
            </span>
          </span>
        </Link>
        <a
          href={ctaHref}
          className="rounded-full bg-gold px-4 py-2 text-sm font-semibold text-navy transition-colors hover:bg-gold-light"
        >
          Simulação gratuita
        </a>
      </div>
    </header>
  );
}
