import { initFontFamilyList } from '../isSupportFontFamily';

describe('isSupportFontFamily.test.ts', () => {
  afterEach(() => localStorage.clear());
  test.each(['{invalid', '{}', '[null]', '42'])('ignores invalid cached fonts: %s', (cache) => {
    localStorage.setItem('LOCAL_FONT_KEY', cache);
    expect(initFontFamilyList(() => true, ['Arial'])).toEqual([
      { label: 'Arial', value: 'Arial', disabled: false },
    ]);
  });
  describe('initFontFamilyList', () => {
    test('mock check', () => {
      const check = () => true;
      expect(initFontFamilyList(check).length).toBeGreaterThanOrEqual(2);
    });
    test('support', () => {
      Object.defineProperty(window, 'queryLocalFonts', {
        writable: true,
        value: async () => {
          return [];
        },
      });
      expect(initFontFamilyList()).toHaveLength(17);
    });
  });
});
