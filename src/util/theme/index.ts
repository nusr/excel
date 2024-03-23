import { ThemeType } from '@/types';
import size from './size';
import zIndex from './zIndex';

import { lightColor, darkColor } from './color';
export const sizeConfig = {
  ...size,
  ...zIndex,
};

export { darkColor, lightColor };
const themeKey = 'data-theme' as const;

export function setTheme(value: ThemeType) {
  sessionStorage.setItem(themeKey, value);
  document.documentElement.setAttribute(themeKey, value);
}
export function getTheme(): ThemeType {
  const l = sessionStorage.getItem(themeKey);
  if (l && (l === 'dark' || l === 'light')) {
    return l as ThemeType;
  }
  if (window.matchMedia && typeof window.matchMedia === 'function') {
    return window.matchMedia('(prefers-color-scheme: dark)').matches
      ? 'dark'
      : 'light';
  }
  return 'light';
}

export function getThemeColor(key: keyof typeof lightColor) {
  if (getTheme() === 'dark') {
    return darkColor[key];
  } else {
    return lightColor[key];
  }
}
