import { splitToWords } from '../split';
describe('split.test.ts', () => {
  describe('splitToWords', () => {
    test('empty', () => {
      expect(splitToWords('')).toEqual([]);
    });
    test('should splitToWords', () => {
      expect(splitToWords('😊👨‍👨‍👧‍👧👦🏾')).toEqual(['😊', '👨‍👨‍👧‍👧', '👦🏾']);
    });
    test('invalid', () => {
      // @ts-ignore
      delete global.Intl.Segmenter;
      // @ts-ignore
      global.Intl.Segmenter = null;
      expect(splitToWords('😊👨‍👨‍👧‍👧👦🏾').length).toBeGreaterThan(3);
    });
  });
});
