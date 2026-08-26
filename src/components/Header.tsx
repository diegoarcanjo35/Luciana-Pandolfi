import Link from "next/link";

export default function Header({ ctaHref = "#simulacao" }: { ctaHref?: string }) {
  return (
    <header className="sticky top-0 z-40 border-b border-slate-200/70 bg-white/90 backdrop-blur">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3 sm:px-6">
        <Link href="/" className="font-serif-display text-lg font-semibold text-[#0b2436] sm:text-xl">
          Luciana Pandolfi
          <span className="ml-2 hidden text-sm font-normal text-slate-500 sm:inline">
            Planos de Saúde
          </span>
        </Link>
        <a
          href={ctaHref}
          className="rounded-full bg-teal-600 px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-teal-700"
        >
          Simulação gratuita
        </a>
      </div>
    </header>
  );
}
