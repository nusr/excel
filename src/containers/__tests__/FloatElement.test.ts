import { roundPosition } from '../FloatElement/util';
import { canvasSizeSet } from '../../util';

describe('FloatElement.test.ts', () => {
  beforeAll(() => {
    const spy = jest.spyOn(canvasSizeSet, 'get');
    spy.mockReturnValue({ top: 144, left: 0, width: 1300, height: 500 });
  });
  describe('roundPosition', () => {
    test('< header height', () => {
      expect(roundPosition(10, 76)).toEqual({ top: 22, left: 76 });
    });
    test('> canvas height', () => {
      expect(roundPosition(600, 76)).toEqual({ top: 500, left: 76 });
    });
    test('< header width', () => {
      expect(roundPosition(30, 10)).toEqual({ top: 30, left: 38 });
    });
    test('> canvas width', () => {
      expect(roundPosition(30, 1400)).toEqual({ top: 30, left: 1300 });
    });
  });
});
