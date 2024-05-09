import { convertColorToHex } from '../color';

describe('color.test.ts', () => {
  describe('convertColorToHex', () => {
    test('invalid', () => {
      expect(convertColorToHex('#g00')).toEqual('');
      expect(convertColorToHex('')).toEqual('');
    });
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
    it('convert rgba to Hex', () => {
      expect(convertColorToHex('rgba(255,0,255,0.4)')).toEqual('#FF00FF66');
    });
    it('convert HSLA to Hex', () => {
      expect(convertColorToHex('hsla(0, 0%, 0%,1.5)')).toEqual('');

      expect(convertColorToHex('hsla(0, 0%, 10%,1)')).toEqual('#070707FF');

      expect(convertColorToHex('hsl(0, 0%, 0%)')).toEqual('#000000FF');
      expect(convertColorToHex('hsla(0, 51.61%, 36.47%, 0.58)')).toEqual(
        '#1E161694',
      );
    });
  });
});
