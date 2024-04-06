import { LanguageType } from '@/types';
import { LANGUAGE_LIST } from '@/util';
import en from './lang/en.json';
import zh from './lang/zh.json';

let languageKey = 'language';

export function getLanguage(): LanguageType {
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
  if (document.documentElement.getAttribute('lang') !== language) {
    document.documentElement.setAttribute('lang', language);
  }
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
