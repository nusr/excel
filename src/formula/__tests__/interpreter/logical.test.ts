import { parseFormula } from '../..';
import { expectResult } from './util';

describe('parseFormula logical', () => {
  it('operator: =', () => {
    expectResult('10 = 10', true, '10=10');
    expectResult('10 = 11', false, '10=11');
  });

  it('operator: >', () => {
    expectResult('11 > 10', true, '11>10');
    expect(parseFormula('10 > 1.1')).toEqual({
      isError: false,
      result: true,
      expressionStr: '10>1.1',
    });
    expect(parseFormula('10 >- 10')).toEqual({
      isError: false,
      result: true,
      expressionStr: '10>-10',
    });

    expect(parseFormula('10 > 11')).toEqual({
      isError: false,
      result: false,
      expressionStr: '10>11',
    });
    expect(parseFormula('10 > 11.1')).toEqual({
      isError: false,
      result: false,
      expressionStr: '10>11.1',
    });
    expect(parseFormula('10 > 10.00001')).toEqual({
      isError: false,
      result: false,
      expressionStr: '10>10.00001',
    });
  });

  it('operator: <', () => {
    expect(parseFormula('10 < 11')).toEqual({
      isError: false,
      result: true,
      expressionStr: '10<11',
    });
    expect(parseFormula('10 < 11.1')).toEqual({
      isError: false,
      result: true,
      expressionStr: '10<11.1',
    });
    expect(parseFormula('10 < 10.00001')).toEqual({
      isError: false,
      result: true,
      expressionStr: '10<10.00001',
    });

    expect(parseFormula('11 < 10')).toEqual({
      isError: false,
      result: false,
      expressionStr: '11<10',
    });
    expect(parseFormula('10 < 1.1')).toEqual({
      isError: false,
      result: false,
      expressionStr: '10<1.1',
    });
    expect(parseFormula('10 <- 10')).toEqual({
      isError: false,
      result: false,
      expressionStr: '10<-10',
    });
  });

  it('operator: >=', () => {
    expect(parseFormula('11 >= 10')).toEqual({
      isError: false,
      result: true,
      expressionStr: '11>=10',
    });
    expect(parseFormula('11 >= 11')).toEqual({
      isError: false,
      result: true,
      expressionStr: '11>=11',
    });
    expect(parseFormula('10 >= 10')).toEqual({
      isError: false,
      result: true,
      expressionStr: '10>=10',
    });
    expect(parseFormula('10 >= -10')).toEqual({
      isError: false,
      result: true,
      expressionStr: '10>=-10',
    });

    expect(parseFormula('10 >= 11')).toEqual({
      isError: false,
      result: false,
      expressionStr: '10>=11',
    });
    expect(parseFormula('10 >= 11.1')).toEqual({
      isError: false,
      result: false,
      expressionStr: '10>=11.1',
    });
    expect(parseFormula('10 >= 10.00001')).toEqual({
      isError: false,
      result: false,
      expressionStr: '10>=10.00001',
    });
  });

  it('operator: <=', () => {
    expect(parseFormula('10 <= 10')).toEqual({
      isError: false,
      result: true,
      expressionStr: '10<=10',
    });
    expect(parseFormula('1.1 <= 10')).toEqual({
      isError: false,
      result: true,
      expressionStr: '1.1<=10',
    });
    expect(parseFormula('-10 <= 10')).toEqual({
      isError: false,
      result: true,
      expressionStr: '-10<=10',
    });

    expect(parseFormula('11 <= 10')).toEqual({
      isError: false,
      result: false,
      expressionStr: '11<=10',
    });
    expect(parseFormula('11.1 <= 10')).toEqual({
      isError: false,
      result: false,
      expressionStr: '11.1<=10',
    });
    expect(parseFormula('10.00001 <= 10')).toEqual({
      isError: false,
      result: false,
      expressionStr: '10.00001<=10',
    });
  });

  it('operator: <>', () => {
    expect(parseFormula('10 <> 11')).toEqual({
      isError: false,
      result: true,
      expressionStr: '10<>11',
    });
    expect(parseFormula('1.1 <> 10')).toEqual({
      isError: false,
      result: true,
      expressionStr: '1.1<>10',
    });
    expect(parseFormula('-10 <> 10')).toEqual({
      isError: false,
      result: true,
      expressionStr: '-10<>10',
    });

    expect(parseFormula('10<>10')).toEqual({
      isError: false,
      result: false,
      expressionStr: '10<>10',
    });
    expect(parseFormula('11.1 <> 11.1')).toEqual({
      isError: false,
      result: false,
      expressionStr: '11.1<>11.1',
    });
    expect(parseFormula('10.00001 <> 10.00001')).toEqual({
      isError: false,
      result: false,
      expressionStr: '10.00001<>10.00001',
    });
  });
});
