import { setTheme, getTheme, getThemeColor, lightColor, darkColor } from '../';
import { convertColorToDark } from '../convert';

describe('theme.test.ts', () => {
  afterEach(() => {
    sessionStorage.clear();
  });
  describe('setTheme', () => {
    test('dark', () => {
      setTheme('dark');
      expect(getTheme()).toEqual('dark');
      expect(document.documentElement.getAttribute('data-theme')).toEqual('dark');
    });
    test('light', () => {
      setTheme('light');
      expect(getTheme()).toEqual('light');
      expect(document.documentElement.getAttribute('data-theme')).toEqual('light');
    });
  });
  describe('getTheme', () => {
    test('light', () => {
      expect(getTheme()).toEqual('light');
    });
    test('an explicit light palette overrides the current dark theme', () => {
      setTheme('dark');
      expect(getThemeColor('white', 'light')).toBe(lightColor.white);
      expect(getThemeColor('white')).toBe(darkColor.white);
    });
    test('mock matchMedia dark', () => {
      Object.defineProperty(global, 'matchMedia', {
        writable: true,
        value: () => {
          return {
            matches: true,
          };
        },
      });
      expect(getTheme()).toEqual('dark');
    });
    test('mock matchMedia light', () => {
      Object.defineProperty(global, 'matchMedia', {
        writable: true,
        value: () => {
          return {
            matches: false,
          };
        },
      });
      expect(getTheme()).toEqual('light');
    });
  });
  describe('convertColorToDark', () => {
    test('rgb', () => {
      expect(convertColorToDark('rgba(198,198,198,0.3)')).toEqual('rgba(57,57,57,0.3)');
    });
    test('translucent black becomes translucent white', () => {
      expect(convertColorToDark('rgba(0,0,0,0.1)')).toBe('rgba(255,255,255,0.1)');
    });
    test('translucent colors use the same RGB channels as opaque colors', () => {
      expect(convertColorToDark('rgba(200,150,100,0.5)')).toBe('rgba(150,105,60,0.5)');
    });
    test('rgba', () => {
      expect(convertColorToDark('rgba(198,198,198)')).toEqual('#393939');
    });
    test('r max', () => {
      expect(convertColorToDark('rgba(200,150,100)')).toEqual('#96693c');
    });
    test('g max', () => {
      expect(convertColorToDark('rgba(100,200,150)')).toEqual('#3c9669');
    });
    test('b max', () => {
      expect(convertColorToDark('rgba(100,150,200)')).toEqual('#3c6996');
    });
    test('h 60', () => {
      expect(convertColorToDark('#bfbf40')).toEqual('#b9b946');
    });
    test('h 120', () => {
      expect(convertColorToDark('#40bf40')).toEqual('#46b946');
    });
    test('h 180', () => {
      expect(convertColorToDark('#40bfbf')).toEqual('#46b9b9');
    });
    test('h 240', () => {
      expect(convertColorToDark('#4040bf')).toEqual('#4646b9');
    });
    test('h 300', () => {
      expect(convertColorToDark('#bf40bf')).toEqual('#b946b9');
    });
  });
});
