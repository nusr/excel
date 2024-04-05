import { computeElementSize, ResizePosition } from '../FloatElement/util';

describe('FloatElement.test.ts', () => {
  describe('computeElementSize', () => {
    for (const item of [
      ResizePosition.topRight,
      ResizePosition.topLeft,
      ResizePosition.top,
    ]) {
      test(item, () => {
        expect(computeElementSize(0, 10, item)).toEqual({
          height: -10,
          width: 0,
          left: 0,
          top: 10,
        });
      });
    }
    for (const item of [
      ResizePosition.bottomRight,
      ResizePosition.bottom,
      ResizePosition.bottomLeft,
    ]) {
      test(item, () => {
        expect(computeElementSize(0, 20, item)).toEqual({
          height: 20,
          width: 0,
          left: 0,
          top: 0,
        });
      });
    }

    for (const item of [
      ResizePosition.topLeft,
      ResizePosition.bottomLeft,
      ResizePosition.left,
    ]) {
      test(item, () => {
        expect(computeElementSize(10, 0, item)).toEqual({
          height: 0,
          width: -10,
          left: 10,
          top: 0,
        });
      });
    }
    for (const item of [
      ResizePosition.topRight,
      ResizePosition.bottomRight,
      ResizePosition.right,
    ]) {
      test(item, () => {
        expect(computeElementSize(10, 0, item)).toEqual({
          height: 0,
          width: 10,
          left: 0,
          top: 0,
        });
      });
    }
  });
});
