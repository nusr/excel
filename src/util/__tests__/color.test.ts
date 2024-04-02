import { convertColorToHex } from '../color';

describe('color.test.ts', () => {
  describe('convertColorToHex', () => {
    it('convert white to Hex', () => {
      expect(convertColorToHex('black')).toEqual('#000000FF');
      expect(convertColorToHex('white')).toEqual('#FFFFFFFF');
    });
    it('convert Hex to Hex', () => {
      expect(convertColorToHex('#000')).toEqual('#000000FF');
      expect(convertColorToHex('#123')).toEqual('#112233FF');
    });
    it('convert rgb to Hex', () => {
      expect(convertColorToHex('rgb(255,0,255)')).toEqual('#FF00FFFF');
    });
    it('convert HSLA to Hex', () => {
      expect(convertColorToHex('hsl(0, 0%, 0%)')).toEqual('#000000FF');
    });
  });
});
