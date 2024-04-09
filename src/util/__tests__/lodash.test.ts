import { throttle,camelCase } from '../lodash';

describe('lodash.test.ts', () => {
  describe('throttle', () => {
    beforeAll(() => {
      jest.useFakeTimers();
    });
    test('ok', () => {
      const mockFunction = jest.fn();

      const throttledFunction = throttle(mockFunction, 100);

      throttledFunction('arg1', 'arg2');

      expect(mockFunction).toHaveBeenCalledTimes(1);

      throttledFunction('arg3', 'arg4');

      jest.advanceTimersByTime(100);

      expect(mockFunction).toHaveBeenCalledTimes(2);
    });
  });
  describe('camelCase', ()=> {
    test('ok', ()=> {
      expect(camelCase('TEST_a')).toEqual('testA')
      expect(camelCase('test.a')).toEqual('testA')
      expect(camelCase('test-a')).toEqual('testA')
    })
  })
});
