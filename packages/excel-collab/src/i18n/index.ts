import locales, { type TranslationKeys } from './locales';
import type { LanguageType } from '../types';
import { LANGUAGE_LIST } from '../util';

let languageKey = 'excel-language';

function i18nConfig() {
  const defaultLanguage = 'en-US';
  let _currentLanguage: LanguageType = defaultLanguage;

  function getLanguage(lang?: LanguageType): LanguageType {
    const selectedLang = lang || navigator?.language || defaultLanguage;

    if (LANGUAGE_LIST.includes(selectedLang as LanguageType)) {
      return selectedLang as LanguageType;
    }

    const t = LANGUAGE_LIST.find((v) => v.includes(selectedLang));
    if (t) {
      return t;
    }

    return defaultLanguage;
  }

  return {
    changeLanguage: (lang: LanguageType) => {
      if (lang === _currentLanguage) {
        return;
      }
      const temp = getLanguage(lang);
      _currentLanguage = temp;
      localStorage.setItem(languageKey, temp);
    },
    init: () => {
      _currentLanguage = getLanguage(localStorage.getItem(languageKey) as any);
    },
    t: (
      key: TranslationKeys,
      options: Record<string, string | number> = {},
    ) => {
      const template = locales[_currentLanguage][key];

      // @ts-ignore
      return template.replace(/{([a-z]+)}/gi, (_, key) => {
        if (key in options) {
          return options[key];
        }
        throw new Error(`i18n.t not found key: "${key}"`);
      });
    },
    get current() {
      return _currentLanguage;
    },
  };
}

const i18n = i18nConfig();

export default i18n;
