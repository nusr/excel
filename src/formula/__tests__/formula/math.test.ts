import { SUM, SIN } from '../../formula/math';

describe('math.test.ts', () => {
  describe('SUM', () => {
    test('normal', () => {
      expect(SUM(1, 2, 'a')).toEqual(3);
    });
  });
  describe('SIN', () => {
    test('normal', () => {
      expect(SIN(90)).toEqual(Math.sin(90));
    });
  });
});
