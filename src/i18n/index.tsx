import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { en, type TranslationKey } from './en';
import { ru } from './ru';

export type Locale = 'ru' | 'en';

const STORAGE_KEY = 'locale';

function detectInitialLocale(): Locale {
  const saved = localStorage.getItem(STORAGE_KEY);
  if (saved === 'ru' || saved === 'en') return saved;

  const lang = (navigator.language || '').toLowerCase();
  if (lang.startsWith('ru')) return 'ru';
  return 'en';
}

type TranslateVars = Record<string, string | number>;

function interpolate(template: string, vars?: TranslateVars): string {
  if (!vars) return template;
  return template.replace(/\{(\w+)\}/g, (_match, key: string) => {
    const value = vars[key];
    return value === undefined || value === null ? `{${key}}` : String(value);
  });
}

function getDict(locale: Locale) {
  return locale === 'ru' ? ru : en;
}

function getRussianNounForm(count: number): 'one' | 'few' | 'many' | 'other' {
  // Правила: 1 → one; 2-4 → few; 5-0 → many; 11-14 → many
  const mod10 = count % 10;
  const mod100 = count % 100;
  if (mod10 === 1 && mod100 !== 11) return 'one';
  if (mod10 >= 2 && mod10 <= 4 && !(mod100 >= 12 && mod100 <= 14)) return 'few';
  if (mod10 === 0 || (mod10 >= 5 && mod10 <= 9) || (mod100 >= 11 && mod100 <= 14)) return 'many';
  return 'other';
}

export function getWishNoun(count: number, locale: Locale): string {
  if (locale === 'ru') {
    const form = getRussianNounForm(count);
    return ru[`desires.noun.${form}` as TranslationKey];
  }
  return count === 1 ? en['desires.noun.one'] : en['desires.noun.other'];
}

type I18nContextValue = {
  locale: Locale;
  setLocale: (next: Locale) => void;
  t: (key: TranslationKey, vars?: TranslateVars) => string;
};

const I18nContext = createContext<I18nContextValue | null>(null);

export function I18nProvider({ children }: { children: React.ReactNode }) {
  const [locale, setLocaleState] = useState<Locale>(() => detectInitialLocale());

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, locale);
  }, [locale]);

  const setLocale = useCallback((next: Locale) => {
    setLocaleState(next);
  }, []);

  const t = useCallback(
    (key: TranslationKey, vars?: TranslateVars) => {
      const dict = getDict(locale);
      const template = dict[key] ?? en[key];
      return interpolate(template, vars);
    },
    [locale]
  );

  const value = useMemo<I18nContextValue>(() => ({ locale, setLocale, t }), [locale, setLocale, t]);

  return <I18nContext.Provider value={value}>{children}</I18nContext.Provider>;
}

export function useI18n() {
  const ctx = useContext(I18nContext);
  if (!ctx) throw new Error('useI18n must be used within I18nProvider');
  return ctx;
}

