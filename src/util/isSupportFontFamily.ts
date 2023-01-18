import { MUST_FONT_FAMILY } from './style';

function SupportFontFamilyFactory(body = document.body) {
  const monoFont = 'monospace';
  const serifFont = 'serif';
  const container = document.createElement('span');
  container.innerHTML = '测试a11';
  container.style.cssText = [
    'position:absolute',
    'width:auto',
    'font-size:128px',
    'left:-99999px',
  ].join(' !important;');

  const getWidth = function (fontFamily: string) {
    container.style.fontFamily = fontFamily;
    body.appendChild(container);
    const width = container.clientWidth;
    body.removeChild(container);
    return width;
  };

  const monoWidth = getWidth(monoFont);
  const serifWidth = getWidth(serifFont);
  const sansWidth = getWidth(MUST_FONT_FAMILY);

  const isSupportFontFamily = function (fontFamily: string) {
    return (
      monoWidth !== getWidth(`${fontFamily},${monoFont}`) ||
      sansWidth !== getWidth(`${fontFamily},${MUST_FONT_FAMILY}`) ||
      serifWidth !== getWidth(`${fontFamily},${serifFont}`)
    );
  };
  return isSupportFontFamily;
}
const isSupportFontFamily = SupportFontFamilyFactory();
export { isSupportFontFamily };
