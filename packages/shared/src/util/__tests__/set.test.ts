import { canvasSizeSet } from '..';

describe('set.test.ts', () => {
  describe('canvasSizeSet', () => {
    test('get', () => {
      expect(canvasSizeSet.get()).toEqual({
        top: 0,
        left: 0,
        width: 0,
        height: 0,
      });
    });
    test('set', () => {
      canvasSizeSet.set({ top: 10, left: 20, width: 30, height: 40 });
      expect(canvasSizeSet.get()).toEqual({
        top: 10,
        left: 20,
        width: 30,
        height: 40,
      });
    });
  });
});
