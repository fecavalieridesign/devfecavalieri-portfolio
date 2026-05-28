"use client";

import { createContext, useContext, useState, useCallback, useMemo, useEffect, ReactNode } from "react";
import { content, Lang } from "@/data/content";

type CtxType = {
  lang: Lang;
  t: typeof content["pt"];
  toggleLang: () => void;
};

const Ctx = createContext<CtxType | null>(null);

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [lang, setLang] = useState<Lang>("pt");

  // Memoize toggle function to prevent re-creation
  const toggleLang = useCallback(() => {
    setLang((l) => (l === "pt" ? "en" : "pt"));
  }, []);

  // Memoize translations
  const t = useMemo(() => content[lang], [lang]);

  // Memoize context value
  const value = useMemo(
    () => ({ lang, t, toggleLang }),
    [lang, t, toggleLang ]
  );

  useEffect(() => {
    document.documentElement.lang = lang;
  }, [lang]);

  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export const useLanguage = () => {
  const ctx = useContext(Ctx);
  if (!ctx) throw new Error("useLanguage must be used within LanguageProvider");
  return ctx;
};
