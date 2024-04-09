import { mainDomSet } from '..';

describe.skip('set.test.ts', () => {
  describe('mainDomSet', () => {
    test('getDomRect empty', () => {
      expect(mainDomSet.getDomRect()).toEqual({
        top: 0,
        left: 0,
        width: 0,
        height: 0,
      });
    });
    test('getDomRect', () => {
      const canvas = {
        parentElement: {
          clientWidth: 218,
          clientHeight: 218,
          getBoundingClientRect() {
            return {
              top: 100,
              left: 100,
              width: 200,
              height: 200,
            };
          },
        },
      } as HTMLCanvasElement;
      mainDomSet.merge({
        canvas,
      });
      expect(mainDomSet.getDomRect()).toEqual({
        top: 100,
        left: 100,
        width: 200,
        height: 200,
      });
    });
  });
});
