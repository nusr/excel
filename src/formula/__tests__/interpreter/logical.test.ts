import { expectFormula } from './util';

describe('parseFormula logical', () => {
  it('operator: =', () => {
    expectFormula('10 = 10', [true]);
    expectFormula('10 = 11', [false]);
  });

  it('operator: >', () => {
    expectFormula('11 > 10', [true]);

    expectFormula('10 > 1.1', [true]);
    expectFormula('10 >- 10', [true]);

    expectFormula('10 > 11', [false]);
    expectFormula('10 > 11.1', [false]);
    expectFormula('10 > 10.00001', [false]);
  });

  it('operator: <', () => {
    expectFormula('10 < 11', [true]);
    expectFormula('10 < 11.1', [true]);
    expectFormula('10 < 10.00001', [true]);

    expectFormula('11 < 10', [false]);
    expectFormula('10 < 1.1', [false]);
    expectFormula('10 <- 10', [false]);
  });

  it('operator: >=', () => {
    expectFormula('11 >= 10', [true]);
    expectFormula('11 >= 11', [true]);
    expectFormula('10 >= 10', [true]);
    expectFormula('10 >= -10', [true]);

    expectFormula('10 >= 11', [false]);
    expectFormula('10 >= 11.1', [false]);
    expectFormula('10 >= 10.00001', [false]);
  });

  it('operator: <=', () => {
    expectFormula('10 <= 10', [true]);
    expectFormula('1.1 <= 10', [true]);
    expectFormula('-10 <= 10', [true]);

    expectFormula('11 <= 10', [false]);
    expectFormula('11.1 <= 10', [false]);
    expectFormula('10.00001 <= 10', [false]);
  });

  it('operator: <>', () => {
    expectFormula('10 <> 11', [true]);
    expectFormula('1.1 <> 10', [true]);
    expectFormula('-10 <> 10', [true]);
    expectFormula('10<>10', [false]);
    expectFormula('11.1 <> 11.1', [false]);
    expectFormula('10.00001 <> 10.00001', [false]);
  });
});
