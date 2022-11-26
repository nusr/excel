import { assert } from './assert';
import { MUST_FONT_FAMILY } from './style';
import { isTestEnv } from './util';

function SupportFontFamilyFactory(defaultFont = MUST_FONT_FAMILY) {
  if (isTestEnv()) {
    return {
      isSupportFontFamily: () => true,
    };
  }
  const canvas = document.createElement('canvas');
  const ctx = canvas.getContext('2d');
  assert(ctx !== null);
  const getImageData = function (font: string) {
    const width = 50;
    canvas.width = width;
    canvas.height = width;
    ctx.textAlign = 'center';
    ctx.fillStyle = 'black';
    ctx.textBaseline = 'middle';
    ctx.clearRect(0, 0, width, width);
    ctx.font = `${width}px ${font},${defaultFont}`;
    ctx.fillText('宋a', width / 2, width / 2);
    const imageData = ctx.getImageData(0, 0, width, width, {
      colorSpace: 'srgb',
    }).data;
    return imageData.join('');
  };
  const defaultImageData = getImageData(defaultFont);
  const isSupportFontFamily = (fontFamily: string) => {
    if (typeof fontFamily != 'string') {
      return false;
    }
    if (fontFamily.toLowerCase() == defaultFont.toLowerCase()) {
      return true;
    }
    return defaultImageData !== getImageData(fontFamily);
  };
  return {
    isSupportFontFamily,
  };
}

const { isSupportFontFamily } = SupportFontFamilyFactory();

export { isSupportFontFamily };
