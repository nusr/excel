import { vi } from 'vitest';
import { Debug } from '../debug';

describe('debug.test.ts', () => {
  afterEach(() => {
    global.localStorage.clear();
    vi.clearAllMocks();
  });
  describe('Debug', () => {
    test('not enable', () => {
      const consoleLog = vi
        .spyOn(console, 'log')
        .mockImplementation(vi.fn());
      const debug = new Debug('test');
      debug.log('test');
      expect(consoleLog).not.toHaveBeenCalled();
    });
    test('ok', () => {
      const consoleLog = vi
        .spyOn(console, 'log')
        .mockImplementation(vi.fn());
      global.localStorage.setItem('debug', '*');
      const debug = new Debug('test');
      debug.log('test');
      expect(consoleLog).toHaveBeenCalled();
    });
  });
});
