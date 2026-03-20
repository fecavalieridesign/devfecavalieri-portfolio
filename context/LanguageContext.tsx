"use client";

import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { content, Lang } from "@/data/content";

type CtxType = {
  lang: Lang;
  t: typeof content["pt"];
  toggleLang: () => void;
};

const Ctx = createContext<CtxType>({ lang: "pt", t: content.pt, toggleLang: () => {} });

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [lang, setLang] = useState<Lang>("pt");
  const toggleLang = () => setLang((l) => (l === "pt" ? "en" : "pt"));

  useEffect(() => {
    document.documentElement.lang = lang;
  }, [lang]);

  return <Ctx.Provider value={{ lang, t: content[lang], toggleLang }}>{children}</Ctx.Provider>;
}

export const useLanguage = () => useContext(Ctx);
