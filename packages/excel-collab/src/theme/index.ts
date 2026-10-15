import { ThemeType } from '../types';
import { lightColor, darkColor } from './color';

const themeKey = 'data-theme' as const;

export function setTheme(value: ThemeType) {
  sessionStorage.setItem(themeKey, value);
  document.documentElement.setAttribute(themeKey, value);
}
export function getTheme(): ThemeType {
  if (typeof sessionStorage !== 'undefined') {
    const l = sessionStorage.getItem(themeKey);
    if (l && (l === 'dark' || l === 'light')) {
      return l as ThemeType;
    }
  }
  if (typeof matchMedia === 'function') {
    const result = matchMedia('(prefers-color-scheme: dark)').matches
      ? 'dark'
      : 'light';
    return result;
  }
  return 'light';
}

type ColorType = keyof typeof lightColor;

export function getThemeColor(key: ColorType, type?: ThemeType) {
  if (type === 'dark' || getTheme() === 'dark') {
    return darkColor[key];
  } else {
    return lightColor[key];
  }
}
export { darkColor, lightColor };
