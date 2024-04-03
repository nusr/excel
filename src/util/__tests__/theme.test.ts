import { setTheme, getTheme, convertColorToDark } from '../theme';

describe('theme.test.ts', () => {
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
