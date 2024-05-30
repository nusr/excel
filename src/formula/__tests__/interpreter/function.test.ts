import { expectFormula } from './util';

describe('parseFormula function', () => {
  it('not defined function', () => {
    expectFormula('foo()', ['#NAME?']);
  });
  it('not support function', () => {
    expectFormula('BAHTTEXT()', ['#NAME?']);
  });
  it('function SUM', () => {
    expectFormula('SUM(1,2)', [3]);
    expectFormula('SUM(1,)', [1]);
    expectFormula('sUM(1,2)', [3]);
    expectFormula('sum(1,2)', [3]);
    expectFormula('SUM(1,SUM(2,3))', [6]);
  });
  it('@SUM', () => {
    expectFormula('@SUM(1)', ['#NAME?']);
  });
  it('function ABS', () => {
    expectFormula('ABS()', ['#VALUE!']);
    expectFormula('ABS("ff")', ['#VALUE!']);

    expectFormula('ABS(1)', [1]);
    expectFormula('ABS(-1)', [1]);
  });
  it('function CONCAT', () => {
    expectFormula('CONCAT("😊", "👨‍👨‍👧‍👧", "👦🏾")', ['😊👨‍👨‍👧‍👧👦🏾']);
  });
});
