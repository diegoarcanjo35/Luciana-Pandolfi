import Link from "next/link";

export default function Footer({ showHomeLink = true }: { showHomeLink?: boolean }) {
  return (
    <footer className="border-t border-slate-200 bg-white py-8">
      <div className="mx-auto flex max-w-6xl flex-col items-center gap-3 px-4 text-center text-sm text-slate-500 sm:px-6">
        <p className="font-serif-display text-base text-[#0b2436]">Luciana Pandolfi | Planos de Saúde</p>
        <p>
          Consultoria gratuita e independente em planos de saúde · São Paulo/SP e todo o Brasil
        </p>
        <p className="text-xs text-slate-400">
          L&amp;J Consultoria e Negócios Ltda · Registro profissional (SUSEP): a confirmar com a cliente
        </p>
        <div className="flex flex-wrap items-center justify-center gap-x-4 gap-y-1">
          <Link href="/politica-de-privacidade" className="underline hover:text-slate-700">
            Política de Privacidade
          </Link>
          {showHomeLink && (
            <Link href="/" className="underline hover:text-slate-700">
              Página inicial
            </Link>
          )}
        </div>
        <p className="text-xs text-slate-400">
          © {new Date().getFullYear()} Luciana Pandolfi | Planos de Saúde. Todos os direitos reservados.
        </p>
      </div>
    </footer>
  );
}
