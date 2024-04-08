import { ThemeType } from '@/types';
import size from './size';
import zIndex from './zIndex';
import { lightColor, darkColor } from './color';
import { convertColorToDark } from './convert';

export const sizeConfig = {
  ...size,
  ...zIndex,
};

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
  if (typeof window.matchMedia === 'function') {
    const result = window.matchMedia('(prefers-color-scheme: dark)').matches
      ? 'dark'
      : 'light';
    return result;
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
export { darkColor, lightColor, convertColorToDark };
