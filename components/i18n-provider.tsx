"use client"

import { createContext, useContext, useState, useEffect, type ReactNode } from "react"
import { type Locale, defaultLocale, supportedLocales, localeNames, t } from "@/lib/i18n"

interface I18nContextType {
  locale: Locale
  setLocale: (locale: Locale) => void
  t: (key: string) => string
  supportedLocales: Locale[]
  localeNames: Record<Locale, string>
}

const I18nContext = createContext<I18nContextType | undefined>(undefined)

export function I18nProvider({ children }: { children: ReactNode }) {
  const [locale, setLocaleState] = useState<Locale>(defaultLocale)

  useEffect(() => {
    const saved = localStorage.getItem("locale") as Locale
    if (saved && supportedLocales.includes(saved)) {
      setLocaleState(saved)
    }
  }, [])

  const setLocale = (newLocale: Locale) => {
    setLocaleState(newLocale)
    localStorage.setItem("locale", newLocale)
  }

  const translate = (key: string) => t(locale, key)

  return (
    <I18nContext.Provider
      value={{ locale, setLocale, t: translate, supportedLocales, localeNames }}
    >
      {children}
    </I18nContext.Provider>
  )
}

export function useI18n() {
  const context = useContext(I18nContext)
  if (!context) throw new Error("useI18n must be used within I18nProvider")
  return context
}
