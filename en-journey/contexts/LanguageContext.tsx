'use client'
import { createContext, useContext, useState, useEffect, ReactNode } from 'react'
import { Lang, tr as trFn } from '@/lib/i18n'

interface LangCtx {
  lang: Lang
  setLang: (l: Lang) => void
  tr: (key: string) => string
}

const Ctx = createContext<LangCtx>({ lang: 'ja', setLang: () => {}, tr: (k) => k })

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [lang, setLangState] = useState<Lang>('ja')

  useEffect(() => {
    const saved = localStorage.getItem('ej_lang') as Lang | null
    if (saved) setLangState(saved)
  }, [])

  const setLang = (l: Lang) => {
    setLangState(l)
    localStorage.setItem('ej_lang', l)
  }

  const tr = (key: string) => trFn(lang, key)

  return <Ctx.Provider value={{ lang, setLang, tr }}>{children}</Ctx.Provider>
}

export const useLang = () => useContext(Ctx)
