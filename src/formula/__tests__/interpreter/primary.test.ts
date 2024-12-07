import { expectFormula } from './util';

describe('primary', () => {
  describe('number', () => {
    test('invalid', () => {
      expectFormula('+"a"', ['#VALUE!']);
      expectFormula('-"a"', ['#VALUE!']);
    });
  });
});
