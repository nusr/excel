import { initFontFamilyList } from '../isSupportFontFamily';

describe('isSupportFontFamily.test.ts', () => {
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
      expect(initFontFamilyList()).toHaveLength(1);
    });
  });
});
