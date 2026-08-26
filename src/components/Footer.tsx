import Link from "next/link";

export default function Footer({ showHomeLink = true }: { showHomeLink?: boolean }) {
  return (
    <footer className="bg-navy py-10 text-cream/70">
      <div className="mx-auto flex max-w-6xl flex-col items-center gap-3 px-4 text-center text-sm sm:px-6">
        <span
          aria-hidden
          className="flex h-10 w-10 items-center justify-center rounded-full border border-gold/60 font-serif-display text-sm text-gold-light"
        >
          L&J
        </span>
        <p className="font-serif-display text-base text-cream">L&amp;J Consultoria | Planos de Saúde</p>
        <p className="text-xs text-cream/50">Luciana Pandolfi &amp; Jhonatan</p>
        <p>
          Consultoria gratuita e independente em planos de saúde · São Paulo/SP e todo o Brasil
        </p>
        <p className="text-xs text-cream/40">
          L&amp;J Consultoria e Negócios Ltda · Registro profissional (SUSEP): a confirmar com a cliente
        </p>
        <div className="flex flex-wrap items-center justify-center gap-x-4 gap-y-1">
          <Link href="/quem-somos" className="underline decoration-gold/40 hover:text-cream">
            Quem somos
          </Link>
          <Link href="/politica-de-privacidade" className="underline decoration-gold/40 hover:text-cream">
            Política de Privacidade
          </Link>
          {showHomeLink && (
            <Link href="/" className="underline decoration-gold/40 hover:text-cream">
              Página inicial
            </Link>
          )}
        </div>
        <p className="text-xs text-cream/40">
          © {new Date().getFullYear()} L&amp;J Consultoria | Planos de Saúde. Todos os direitos reservados.
        </p>
      </div>
    </footer>
  );
}
