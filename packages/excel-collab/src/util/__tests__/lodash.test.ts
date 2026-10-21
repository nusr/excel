import { vi } from 'vitest';
import { throttle, camelCase } from '../lodash';

describe('lodash.test.ts', () => {
  describe('throttle', () => {
    beforeAll(() => {
      vi.useFakeTimers();
    });
    afterAll(() => {
      vi.useRealTimers();
    });
    test('suppresses intermediate calls and retains the latest arguments and receiver', () => {
      const fn = vi.fn(function (this: { id: string }, value: number) {
        return `${this.id}:${value}`;
      });
      const invoke = throttle(fn, 100);
      invoke.call({ id: 'first' }, 1);
      invoke.call({ id: 'second' }, 2);
      invoke.call({ id: 'latest' }, 3);
      expect(fn).toHaveBeenCalledTimes(1);
      vi.advanceTimersByTime(100);
      expect(fn).toHaveBeenCalledTimes(2);
      expect(fn.mock.results[1].value).toBe('latest:3');
      invoke.call({ id: 'next' }, 4);
      expect(fn).toHaveBeenCalledTimes(2);
      vi.advanceTimersByTime(100);
      expect(fn.mock.results[2].value).toBe('next:4');
      vi.advanceTimersByTime(200);
      expect(fn).toHaveBeenCalledTimes(3);
    });
    test('ok', () => {
      const mockFunction = vi.fn();

      const throttledFunction = throttle(mockFunction, 100);

      throttledFunction('arg1', 'arg2');

      expect(mockFunction).toHaveBeenCalledTimes(1);

      throttledFunction('arg3', 'arg4');

      vi.advanceTimersByTime(100);

      expect(mockFunction).toHaveBeenCalledTimes(2);
    });
  });
  describe('camelCase', () => {
    test('ok', () => {
      expect(camelCase('TEST_a')).toEqual('testA');
      expect(camelCase('test.a')).toEqual('testA');
      expect(camelCase('test-a')).toEqual('testA');
    });
  });
});
