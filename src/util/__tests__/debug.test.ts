import { Debug } from '../debug';

describe('debug.test.ts', () => {
  afterEach(() => {
    global.localStorage.clear();
    jest.clearAllMocks();
  });
  describe('Debug', () => {
    test('not enable', () => {
      const consoleLog = jest
        .spyOn(console, 'log')
        .mockImplementation(jest.fn());
      const debug = new Debug('test');
      debug.log('test');
      expect(consoleLog).not.toHaveBeenCalled();
    });
    test('ok', () => {
      const consoleLog = jest
        .spyOn(console, 'log')
        .mockImplementation(jest.fn());
      global.localStorage.setItem('debug', '*');
      const debug = new Debug('test');
      debug.log('test');
      expect(consoleLog).toHaveBeenCalled();
    });
  });
});
