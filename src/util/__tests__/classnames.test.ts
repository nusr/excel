import { classnames } from '../classnames';

describe('classnames.test.ts', () => {
  describe('classnames', () => {
    it("should convert ('') to ''", () => {
      expect(classnames('')).toEqual('');
    });
    it("should convert ('','') to ''", () => {
      expect(classnames('', '')).toEqual('');
    });
    it("should convert ({}) to ''", () => {
      expect(classnames({})).toEqual('');
    });
    it("should convert ({}, {}) to ''", () => {
      expect(classnames({}, {})).toEqual('');
    });
    it("should convert ('',{}) to ''", () => {
      expect(classnames('')).toEqual('');
    });
    it("should convert ('test') to 'test'", () => {
      expect(classnames('test')).toEqual('test');
    });
    it("should convert ({ a: true, b: false, c: 0, d: null, e: undefined, f: 1 }) to 'a f'", () => {
      expect(classnames({ a: true, b: false, c: 0, d: null, e: undefined, f: 1 })).toEqual('a f');
    });
    it("should convert ({ a: true, b: false }) to 'test a'", () => {
      expect(classnames('test', { a: true, b: false })).toEqual('test a');
    });
  });
});
