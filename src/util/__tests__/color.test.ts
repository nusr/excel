import { convertColorToHex } from '../color';

describe('color.test.ts', () => {
  describe('convertColorToHex', () => {
    it('convert Hex to Hex', () => {
      expect(convertColorToHex('#000')).toEqual('#000000FF');
      expect(convertColorToHex('#123')).toEqual('#112233FF');
    });
    it('convert rgb to Hex', () => {
      expect(convertColorToHex('rgb(255,0,255)')).toEqual('#FF00FFFF');
    });
  });
});
