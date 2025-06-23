import { assert } from '../assert';

describe('assert.test.ts', () => {
  describe('assert', () => {
    it("should throw 'assert error' error", () => {
      function testFunc() {
        assert(false, 'assert error');
      }
      expect(testFunc).toThrow(new Error('assert error'));
    });

    it('should throw error', () => {
      function testFunc() {
        assert(false, 'test');
      }
      expect(testFunc).toThrow(new Error('test'));
    });
    it('should not throw error', () => {
      function testFunc() {
        assert(true, 'test');
      }
      expect(testFunc).not.toThrow(new Error('test'));
    });
  });
});
