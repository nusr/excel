import { expectFormula } from './util';

describe('parseFormula math', () => {
  describe('operator +', () => {
    test('invalid', () => {
      expectFormula('"foo" + 4.333', ['#VALUE!']);
      expectFormula('4 + "foo" ', ['#VALUE!']);
    });
    test('ok', () => {
      expectFormula('10+10', [20]);

      expectFormula('1e2 + 1e1', [110]);
      expectFormula('1e-2 + 1e1', [10.01]);

      expectFormula('10 + 10', [20]);
      expectFormula('10 + 11 + 23 + 11 + 2', [57]);
      expectFormula('1.4425 + 4.333', [5.7755]);

      expectFormula('+ 10', [10]);
    });
  });

  it('operator -', () => {
    expectFormula('10-10', [0]);
    expectFormula('10 - 10', [0]);
    expectFormula('10 - 10 - 2', [-2]);
    expectFormula('10 - 11 - 23 - 11 - 2 ', [-37]);
    expectFormula('"foo" - 4.333', ['#VALUE!']);
    expectFormula('- 10', [-10]);
  });

  it('operator /', () => {
    expectFormula('2 / 1', [2]);
    expectFormula('64 / 2 / 4', [8]);
    expectFormula('2 / 0', ['#DIV/0!']);
    expectFormula('"foo" / 4.333', ['#VALUE!']);
  });

  it('operator *', () => {
    expectFormula('0 * 0 * 0 * 0 * 0', [0]);
    expectFormula('2 * 1', [2]);
    expectFormula('64 * 2 * 4', [512]);
    expectFormula('"foo" * 4.333', ['#VALUE!']);
  });

  it('operator ^', () => {
    expectFormula('2 ^ 5', [32]);
    expectFormula('"foo" ^ 4', ['#VALUE!']);
    expectFormula('2^ 3^ 4', [4096]);
    expectFormula('(2^3) ^4 ', [4096]);
  });

  it('operator &', () => {
    expectFormula('2&5', ['25']);
    expectFormula('(2 & 5)', ['25']);
    expectFormula('("" & "")', ['']);
    expectFormula('"" & ""', ['']);
    expectFormula('("Hello" & " world") & "!"', ['Hello world!']);
  });

  it('mixed operators', () => {
    expectFormula('1 + 10 - 20 * 3/2', [-19]);
    expectFormula('((1 + 10 - 20 * 3 / 2) + 20) * 10', [10]);
    expectFormula('(((1 + 10 - 20 * 3/2) + 20) * 10) / 5.12', [1.953125]);
    expectFormula('(((1 + "foo" - 20 * 3/2) + 20) * 10) / 5.12', ['#VALUE!']);
  });
  it('operator %', () => {
    expectFormula('1%', [0.01]);
    expectFormula('(1+2)%', [0.03]);
  });
});
