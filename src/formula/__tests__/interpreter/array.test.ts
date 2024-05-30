import { expectFormula } from './util';

describe('array.test.ts', () => {
  describe('invalid', () => {
    test('{1,2,3]', () => {
      expectFormula('{1,2,3]', ['#VALUE!']);
    });
    test('{,,}', () => {
      expectFormula('{,,}', ['#VALUE!']);
    });
  });
  describe('number', () => {
    test('{1,2,3}', () => {
      expectFormula('{1,2,3}', [1, 2, 3]);
    });
    test('{1,2,3}*2', () => {
      expectFormula('{1,2,3}*2', [2]);
    });
  });
  describe('string', () => {
    test('{"test","a"}', () => {
      expectFormula('{"test","a"}', ['test', 'a']);
    });
  });
  describe('bool', () => {
    test('{TRUE, FALSE}', () => {
      expectFormula('{TRUE, FALSE}', [true, false]);
    });
  });
  describe('string + number', () => {
    test('{"test",1}', () => {
      expectFormula('{"test",1}', ['test', 1]);
    });
  });
});
