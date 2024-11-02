import {
  MUST_FONT_FAMILY,
  FONT_FAMILY_LIST,
  LOCAL_FONT_KEY,
  QUERY_ALL_LOCAL_FONT,
} from '@/util';
import { OptionItem } from '@/types';
import { $ } from '@/i18n';

function createElement(font: string) {
  const s = document.createElement('span');
  s.style.fontSize = '72px';
  s.innerHTML = 'mmmmmmmmmmlli';
  s.style.fontFamily = font;
  document.body.appendChild(s);
  const { offsetWidth, offsetHeight } = s;
  document.body.removeChild(s);
  return {
    offsetHeight,
    offsetWidth,
  };
}

function SupportFontFamilyFactory() {
  const baseFonts = [MUST_FONT_FAMILY, 'serif'];
  const defaultWidth: Record<string, number> = {};
  const defaultHeight: Record<string, number> = {};
  for (const item of baseFonts) {
    const { offsetWidth, offsetHeight } = createElement(item);
    defaultWidth[item] = offsetWidth;
    defaultHeight[item] = offsetHeight;
  }

  function detect(font: string): boolean {
    for (const item of baseFonts) {
      const { offsetWidth, offsetHeight } = createElement(font + ',' + item);
      if (
        offsetWidth !== defaultWidth[item] ||
        offsetHeight !== defaultHeight[item]
      ) {
        return true;
      }
    }
    return false;
  }

  return detect;
}

const isSupportFontFamily = SupportFontFamilyFactory();
export { isSupportFontFamily };

export function initFontFamilyList(
  check = isSupportFontFamily,
  fontList = FONT_FAMILY_LIST,
): OptionItem[] {
  const cacheFont = localStorage.getItem(LOCAL_FONT_KEY);
  if (cacheFont) {
    const list = JSON.parse(cacheFont) as string[];
    if (list.length > 0) {
      return list.map((v) => ({ value: v, label: v, disabled: false }));
    }
  }
  const list: OptionItem[] = [];
  for (const item of fontList) {
    if (check(item)) {
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
      label: $('get-all-installed-fonts'),
      disabled: false,
    });
  }
  return list;
}
