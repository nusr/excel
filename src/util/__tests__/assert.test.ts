import { assert } from '../assert';

describe('assert.test.ts', () => {
  describe('dev assert', () => {
    it("should throw 'assert error' error", () => {
      function testFunc() {
        assert(false, 'assert error', 'dev');
      }
      expect(testFunc).toThrow(new Error('assert error'));
    });

    it('should throw error', () => {
      function testFunc() {
        assert(false, 'test', 'dev');
      }
      expect(testFunc).toThrow(new Error('test'));
    });
    it('should not throw error', () => {
      function testFunc() {
        assert(true, 'test', 'dev');
      }
      expect(testFunc).not.toThrow(new Error('test'));
    });
  });
  describe('production assert', () => {
    it('should not throw error', () => {
      function testFunc() {
        assert(true, 'test', 'production');
      }
      expect(testFunc).not.toThrow(new Error('test'));
    });
  });
  describe('assert', () => {
    it('should not throw error', () => {
      function testFunc() {
        assert(true, 'test', 'test');
      }
      expect(testFunc).not.toThrow(new Error('test'));
    });
  });
});
