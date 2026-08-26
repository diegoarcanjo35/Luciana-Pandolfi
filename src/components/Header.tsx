"use client";

import { useState } from "react";
import Link from "next/link";

const NAV_ITEMS = [
  { href: "/", label: "Início" },
  { href: "/quem-somos", label: "Quem somos" },
  { href: "/plano-familiar", label: "Família" },
  { href: "/plano-empresarial", label: "Empresas" },
];

/** Header institucional completo — usado só na Home e em Quem somos. Landing
 * pages de campanha usam CampaignHeader (mais enxuto, sem navegação). */
export default function Header({ ctaHref = "#simulacao" }: { ctaHref?: string }) {
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-40 border-b border-navy/10 bg-cream/95 backdrop-blur">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3 sm:px-6">
        <Link href="/" className="flex items-center gap-2.5">
          <span
            aria-hidden
            className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-gold/70 bg-navy font-serif-display text-sm text-gold-light"
          >
            L&J
          </span>
          <span className="font-serif-display text-lg font-semibold text-navy sm:text-xl">
            L&amp;J Consultoria
            <span className="ml-2 hidden text-sm font-normal text-navy/50 sm:inline">
              Planos de Saúde
            </span>
          </span>
        </Link>

        <nav className="hidden items-center gap-6 md:flex">
          {NAV_ITEMS.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="text-sm font-medium text-navy/70 hover:text-navy"
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          <a
            href={ctaHref}
            className="hidden rounded-full bg-gold px-4 py-2 text-sm font-semibold text-navy transition-colors hover:bg-gold-light sm:inline-block"
          >
            Simulação gratuita
          </a>
          <button
            type="button"
            aria-expanded={open}
            aria-controls="mobile-menu"
            aria-label={open ? "Fechar menu" : "Abrir menu"}
            onClick={() => setOpen((v) => !v)}
            className="flex h-10 w-10 items-center justify-center rounded-full border border-navy/15 text-navy md:hidden"
          >
            <span aria-hidden className="relative block h-3.5 w-4">
              <span
                className={`absolute left-0 top-0 h-px w-4 bg-navy transition-transform ${open ? "translate-y-[7px] rotate-45" : ""}`}
              />
              <span
                className={`absolute left-0 top-[7px] h-px w-4 bg-navy transition-opacity ${open ? "opacity-0" : ""}`}
              />
              <span
                className={`absolute left-0 top-[14px] h-px w-4 bg-navy transition-transform ${open ? "-translate-y-[7px] -rotate-45" : ""}`}
              />
            </span>
          </button>
        </div>
      </div>

      {open && (
        <nav
          id="mobile-menu"
          className="flex flex-col gap-1 border-t border-navy/10 bg-cream px-4 py-3 md:hidden"
        >
          {NAV_ITEMS.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              onClick={() => setOpen(false)}
              className="rounded-lg px-2 py-2.5 text-base font-medium text-navy/80 hover:bg-navy/5"
            >
              {item.label}
            </Link>
          ))}
          <a
            href={ctaHref}
            onClick={() => setOpen(false)}
            className="mt-2 rounded-full bg-gold px-4 py-3 text-center text-sm font-semibold text-navy"
          >
            Simulação gratuita
          </a>
        </nav>
      )}
    </header>
  );
}
