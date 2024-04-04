import { MUST_FONT_FAMILY } from './constant';
import { OptionItem } from '@/types';
import { FONT_FAMILY_LIST, LOCAL_FONT_KEY, QUERY_ALL_LOCAL_FONT } from './font';

export function SupportFontFamilyFactory() {
  // a font will be compared against all the three default fonts.
  // and if it doesn't match all 3 then that font is not available.
  const baseFonts = ['monospace', MUST_FONT_FAMILY, 'serif'];

  //we use m or w because these two characters take up the maximum width.
  // And we use a LLi so that the same matching fonts can get separated
  const testString = 'mmmmmmmmmmlli';

  //we test using 72px font size, we may use any size. I guess larger the better.
  const testSize = '72px';

  const body = document.body;

  // create a SPAN in the document to get the width of the text we use to test
  const s = document.createElement('span');
  s.style.fontSize = testSize;
  s.innerHTML = testString;
  const defaultWidth: Record<string, number> = {};
  const defaultHeight: Record<string, number> = {};
  for (const item of baseFonts) {
    //get the default width for the three base fonts
    s.style.fontFamily = item;
    body.appendChild(s);
    defaultWidth[item] = s.offsetWidth; //width for the default font
    defaultHeight[item] = s.offsetHeight; //height for the defualt font
    body.removeChild(s);
  }

  function detect(font: string) {
    let detected = false;
    for (const item of baseFonts) {
      s.style.fontFamily = font + ',' + item; // name of the font along with the base font for fallback.
      body.appendChild(s);
      const matched =
        s.offsetWidth != defaultWidth[item] ||
        s.offsetHeight != defaultHeight[item];
      body.removeChild(s);
      detected = detected || matched;
    }
    return detected;
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
  const list = fontList
    .map((v) => ({
      label: v,
      value: v,
      disabled: !isSupportFontFamily(v),
    }))
    .filter((v) => !v.disabled);
  if (typeof window.queryLocalFonts === 'function') {
    list.push({
      value: QUERY_ALL_LOCAL_FONT,
      label: '--> get all local installed fonts',
      disabled: false,
    });
  }
  return list;
}
