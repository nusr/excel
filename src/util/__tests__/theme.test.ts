import { setTheme, getTheme, convertColorToDark } from '../theme';

describe('theme.test.ts', () => {
  afterEach(() => {
    sessionStorage.clear();
  });
  describe('setTheme', () => {
    test('dark', () => {
      setTheme('dark');
      expect(getTheme()).toEqual('dark');
      expect(document.documentElement.getAttribute('data-theme')).toEqual(
        'dark',
      );
    });
    test('light', () => {
      setTheme('light');
      expect(getTheme()).toEqual('light');
      expect(document.documentElement.getAttribute('data-theme')).toEqual(
        'light',
      );
    });
  });
  describe('getTheme', () => {
    test('light', () => {
      expect(getTheme()).toEqual('light');
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
      expect(convertColorToDark('rgba(198,198,198,0.3)')).toEqual(
        'rgba(0,0,0,0.3)',
      );
    });
    test('rgba', () => {
      expect(convertColorToDark('rgba(198,198,198)')).toEqual('#393939');
    });
  });
});
