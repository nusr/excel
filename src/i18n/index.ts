import en from './lang/en.json';
import zh from './lang/zh.json';

let languageKey = 'language';

export const LANGUAGE_LIST = ['en', 'zh'] as const;

export type LanguageType = (typeof LANGUAGE_LIST)[number];

export function getLanguage(): LanguageType {
  if (typeof window === 'undefined') {
    return 'en';
  }
  let language: LanguageType = 'en';
  const l = localStorage.getItem(languageKey);
  if (l && LANGUAGE_LIST.some((v) => v === l)) {
    language = l as LanguageType;
  } else {
    const lang = navigator?.language || '';
    const item = LANGUAGE_LIST.find((v) => lang.includes(v));
    if (item) {
      language = item;
    }
  }
  document.documentElement.setAttribute('lang', language);
  return language;
}

export function setLanguage(lang: LanguageType) {
  localStorage.setItem(languageKey, lang);
}

export function $(key: keyof typeof en) {
  if (getLanguage() === 'en') {
    return en[key];
  } else {
    return zh[key];
  }
}
