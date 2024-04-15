import { expectResult } from './util';
import { parseFormula } from '../..';

describe('parseFormula function', () => {
  it('not defined function', () => {
    expectResult('foo()', '#NAME?');
  });
  it('not support function', () => {
    expectResult('BAHTTEXT()', '#NAME?');
  });
  it('function SUM', () => {
    expectResult('SUM(1,2)', 3, 'SUM(1,2)');
    expectResult('SUM(1,)', 1, 'SUM(1)');
    expectResult('sUM(1,2)', 3, 'SUM(1,2)');
    expectResult('sum(1,2)', 3, 'SUM(1,2)');
    expectResult('SUM(1,SUM(2,3))', 6, 'SUM(1,SUM(2,3))');
  });
  it('@SUM', () => {
    expectResult('@SUM(1)', '#NAME?');
  });
  it('function ABS', () => {
    expect(parseFormula('ABS()')).toEqual({
      result: "#VALUE!",
      isError: true,
      expressionStr: '',
    });
    expect(parseFormula('ABS("ff")')).toEqual({
      result: '#VALUE!',
      isError: true,
      expressionStr: '',
    });

    expectResult('ABS(1)', 1, 'ABS(1)');
    expectResult('ABS(-1)', 1, 'ABS(-1)');
  });
  it('function CONCAT', () => {
    expectResult('CONCAT("😊", "👨‍👨‍👧‍👧", "👦🏾")', '😊👨‍👨‍👧‍👧👦🏾', 'CONCAT(😊,👨‍👨‍👧‍👧,👦🏾)');
  });
});
