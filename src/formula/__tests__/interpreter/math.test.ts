import { parseFormula } from '../..';

describe('parseFormula math', () => {
  it('operator +', () => {
    expect(parseFormula('10+10')).toEqual({ error: null, result: 20, expressionStr: '10+10' });

    expect(parseFormula('1e2 + 1e1')).toEqual({ error: null, result: 110, expressionStr: '1e2+1e1' });
    expect(parseFormula('1e-2 + 1e1')).toEqual({ error: null, result: 10.01, expressionStr: '1e-2+1e1' });

    expect(parseFormula('10 + 10')).toEqual({ error: null, result: 20, expressionStr: '10+10' });
    expect(parseFormula('10 + 11 + 23 + 11 + 2')).toEqual({
      error: null,
      result: 57,
      expressionStr: '10+11+23+11+2',
    });
    expect(parseFormula('1.4425 + 4.333')).toEqual({
      error: null,
      result: 5.7755,
      expressionStr: '1.4425+4.333',
    });
    expect(parseFormula('"foo" + 4.333')).toEqual({
      error: '#VALUE!',
      result: null,
      expressionStr: '',
    });
  });

  it('operator -', () => {
    expect(parseFormula('10-10')).toEqual({ error: null, result: 0, expressionStr: '10-10' });
    expect(parseFormula('10 - 10')).toEqual({ error: null, result: 0, expressionStr: '10-10' });
    expect(parseFormula('10 - 10 - 2')).toEqual({
      error: null,
      result: -2,
      expressionStr: '10-10-2',
    });
    expect(parseFormula('10 - 11 - 23 - 11 - 2 ')).toEqual({
      error: null,
      result: -37,
      expressionStr: '10-11-23-11-2',
    });
    expect(parseFormula('"foo" - 4.333')).toEqual({
      error: '#VALUE!',
      result: null,
      expressionStr: '',
    });
  });

  it('operator /', () => {
    expect(parseFormula('2 / 1')).toEqual({ error: null, result: 2, expressionStr: '2/1' });
    expect(parseFormula('64 / 2 / 4')).toEqual({
      error: null,
      result: 8,
      expressionStr: '64/2/4',
    });
    expect(parseFormula('2 / 0')).toEqual({
      error: '#DIV/0!',
      result: null,
      expressionStr: '',
    });
    expect(parseFormula('"foo" / 4.333')).toEqual({
      error: '#VALUE!',
      result: null,
      expressionStr: '',
    });
  });

  it('operator *', () => {
    expect(parseFormula('0 * 0 * 0 * 0 * 0')).toEqual({
      error: null,
      result: 0,
      expressionStr: '0*0*0*0*0',
    });
    expect(parseFormula('2 * 1')).toEqual({ error: null, result: 2, expressionStr: '2*1' });
    expect(parseFormula('64 * 2 * 4')).toEqual({
      error: null,
      result: 512,
      expressionStr: '64*2*4',
    });
    expect(parseFormula('"foo" * 4.333')).toEqual({
      error: '#VALUE!',
      result: null,
      expressionStr: '',
    });
  });

  it('operator ^', () => {
    expect(parseFormula('2 ^ 5')).toEqual({ error: null, result: 32, expressionStr: '2^5' });
    expect(parseFormula('"foo" ^ 4')).toEqual({
      error: '#VALUE!',
      result: null,
      expressionStr: '',
    });
    expect(parseFormula('2^ 3^ 4')).toEqual({
      error: null,
      result: 4096,
      expressionStr: '2^3^4',
    });
    expect(parseFormula('(2^3) ^4 ')).toEqual({
      error: null,
      result: 4096,
      expressionStr: '(2^3)^4',
    });
  });

  it('operator &', () => {
    expect(parseFormula('2&5')).toEqual({ error: null, result: '25', expressionStr: '2&5' });
    expect(parseFormula('(2 & 5)')).toEqual({
      error: null,
      result: '25',
      expressionStr: '(2&5)',
    });
    expect(parseFormula('("" & "")')).toEqual({
      error: null,
      result: '',
      expressionStr: '(""&"")',
    });
    expect(parseFormula('"" & ""')).toEqual({ error: null, result: '', expressionStr: '""&""' });
    expect(parseFormula('("Hello" & " world") & "!"')).toEqual({
      error: null,
      result: 'Hello world!',
      expressionStr: '("Hello"&" world")&"!"',
    });
  });

  it('mixed operators', () => {
    expect(parseFormula('1 + 10 - 20 * 3/2')).toEqual({
      error: null,
      result: -19,
      expressionStr: '1+10-20*3/2',
    });
    expect(parseFormula('((1 + 10 - 20 * 3 / 2) + 20) * 10')).toEqual({
      error: null,
      result: 10,
      expressionStr: '((1+10-20*3/2)+20)*10',
    });
    expect(parseFormula('(((1 + 10 - 20 * 3/2) + 20) * 10) / 5.12')).toEqual({
      error: null,
      result: 1.953125,
      expressionStr: '(((1+10-20*3/2)+20)*10)/5.12',
    });
    expect(parseFormula('(((1 + "foo" - 20 * 3/2) + 20) * 10) / 5.12')).toEqual({
      error: '#VALUE!',
      result: null,
      expressionStr: '',
    });
  });
  it('operator %', () => {
    expect(parseFormula('1%')).toEqual({ error: null, result: 0.01, expressionStr: '1%' });
    expect(parseFormula('(1+2)%')).toEqual({ error: null, result: 0.03, expressionStr: '(1+2)%' });
  });
});
