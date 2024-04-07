import { MUST_FONT_FAMILY } from './constant';
import { OptionItem } from '@/types';
import { FONT_FAMILY_LIST, LOCAL_FONT_KEY, QUERY_ALL_LOCAL_FONT } from './font';
import { $ } from '@/i18n';

function createElement(font: string) {
  const s = document.createElement('span');
  s.style.fontSize = '72px';
  s.innerHTML = 'mmmmmmmmmmlli';
  s.style.fontFamily = font;
  return s;
}

export function SupportFontFamilyFactory() {
  const baseFonts = [MUST_FONT_FAMILY, 'serif'];
  const defaultWidth: Record<string, number> = {};
  const defaultHeight: Record<string, number> = {};
  for (const item of baseFonts) {
    const s = createElement(item);
    document.body.appendChild(s);
    defaultWidth[item] = s.offsetWidth;
    defaultHeight[item] = s.offsetHeight;
    document.body.removeChild(s);
  }

  function detect(font: string): boolean {
    for (const item of baseFonts) {
      const s = createElement(font + ',' + item);
      document.body.appendChild(s);
      const matched =
        s.offsetWidth !== defaultWidth[item] ||
        s.offsetHeight !== defaultHeight[item];
      document.body.removeChild(s);
      if (matched) {
        return true;
      }
    }
    return false;
  }

  return detect;
}

const isSupportFontFamily = SupportFontFamilyFactory();
export { isSupportFontFamily };

export function initFontFamilyList(fontList = FONT_FAMILY_LIST): OptionItem[] {
  const cacheFont = localStorage.getItem(LOCAL_FONT_KEY);
  if (cacheFont) {
    const list = JSON.parse(cacheFont) as string[];
    if (list.length > 0) {
      return list.map((v) => ({ value: v, label: v, disabled: false }));
    }
  }
  const list: OptionItem[] = [];
  for (const item of fontList) {
    if (isSupportFontFamily(item)) {
      list.push({
        label: item,
        value: item,
        disabled: false,
      });
    }
  }

  if (typeof window.queryLocalFonts === 'function') {
    list.push({
      value: QUERY_ALL_LOCAL_FONT,
      label: '--- ' + $('get-all-installed-fonts') + ' ---',
      disabled: false,
    });
  }
  return list;
}
