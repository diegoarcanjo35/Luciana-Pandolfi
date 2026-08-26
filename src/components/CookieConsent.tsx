"use client";

import { useEffect, useState } from "react";

const STORAGE_KEY = "lp_cookie_consent";

export default function CookieConsent() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    try {
      const consent = window.localStorage.getItem(STORAGE_KEY);
      if (!consent) setVisible(true);
    } catch {
      setVisible(true);
    }
  }, []);

  function accept() {
    try {
      window.localStorage.setItem(
        STORAGE_KEY,
        JSON.stringify({ accepted: true, at: new Date().toISOString() })
      );
    } catch {
      // segue sem persistir
    }
    setVisible(false);
  }

  if (!visible) return null;

  return (
    <div className="fixed inset-x-0 bottom-0 z-50 border-t border-slate-200 bg-white/95 p-4 shadow-[0_-4px_20px_rgba(0,0,0,0.06)] backdrop-blur">
      <div className="mx-auto flex max-w-4xl flex-col items-center gap-3 text-center sm:flex-row sm:justify-between sm:text-left">
        <p className="text-sm text-slate-600">
          Usamos cookies e dados de navegação para melhorar sua experiência e medir a origem dos
          nossos anúncios, conforme a{" "}
          <a href="/politica-de-privacidade" className="underline">
            Política de Privacidade
          </a>{" "}
          (LGPD).
        </p>
        <button
          onClick={accept}
          className="shrink-0 rounded-full bg-teal-600 px-5 py-2 text-sm font-semibold text-white transition-colors hover:bg-teal-700"
        >
          Entendi
        </button>
      </div>
    </div>
  );
}
