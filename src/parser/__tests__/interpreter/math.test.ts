import { parseFormula } from '../..';

describe('parseFormula math', () => {
  it('operator +', () => {
    expect(parseFormula('10+10')).toEqual({ error: null, result: 20 });
    expect(parseFormula('10 + 10')).toEqual({ error: null, result: 20 });
    expect(parseFormula('10 + 11 + 23 + 11 + 2')).toEqual({
      error: null,
      result: 57,
    });
    expect(parseFormula('1.4425 + 4.333')).toEqual({
      error: null,
      result: 5.7755,
    });
    expect(parseFormula('"foo" + 4.333')).toEqual({
      error: '#VALUE!',
      result: null,
    });
  });

  it('operator -', () => {
    expect(parseFormula('10-10')).toEqual({ error: null, result: 0 });
    expect(parseFormula('10 - 10')).toEqual({ error: null, result: 0 });
    expect(parseFormula('10 - 10 - 2')).toEqual({
      error: null,
      result: -2,
    });
    expect(parseFormula('10 - 11 - 23 - 11 - 2')).toEqual({
      error: null,
      result: -37,
    });
    expect(parseFormula('"foo" - 4.333')).toEqual({
      error: '#VALUE!',
      result: null,
    });
  });

  it('operator /', () => {
    expect(parseFormula('2 / 1')).toEqual({ error: null, result: 2 });
    expect(parseFormula('64 / 2 / 4')).toEqual({
      error: null,
      result: 8,
    });
    expect(parseFormula('2 / 0')).toEqual({
      error: '#DIV/0!',
      result: null,
    });
    expect(parseFormula('"foo" / 4.333')).toEqual({
      error: '#VALUE!',
      result: null,
    });
  });

  it('operator *', () => {
    expect(parseFormula('0 * 0 * 0 * 0 * 0')).toEqual({
      error: null,
      result: 0,
    });
    expect(parseFormula('2 * 1')).toEqual({ error: null, result: 2 });
    expect(parseFormula('64 * 2 * 4')).toEqual({
      error: null,
      result: 512,
    });
    expect(parseFormula('"foo" * 4.333')).toEqual({
      error: '#VALUE!',
      result: null,
    });
  });

  it('operator ^', () => {
    expect(parseFormula('2^5')).toEqual({ error: null, result: 32 });
    expect(parseFormula('"foo" ^ 4')).toEqual({
      error: '#VALUE!',
      result: null,
    });
    expect(parseFormula('2^3^4')).toEqual({
      error: null,
      result: 4096,
    });
    expect(parseFormula('(2^3)^4')).toEqual({
      error: null,
      result: 4096,
    });
  });

  it('operator &', () => {
    expect(parseFormula('2&5')).toEqual({ error: null, result: '25' });
    expect(parseFormula('(2 & 5)')).toEqual({
      error: null,
      result: '25',
    });
    expect(parseFormula('("" & "")')).toEqual({
      error: null,
      result: '',
    });
    expect(parseFormula('"" & ""')).toEqual({ error: null, result: '' });
    expect(parseFormula('("Hello" & " world") & "!"')).toEqual({
      error: null,
      result: 'Hello world!',
    });
  });

  it('mixed operators', () => {
    expect(parseFormula('1 + 10 - 20 * 3/2')).toEqual({
      error: null,
      result: -19,
    });
    expect(parseFormula('((1 + 10 - 20 * 3 / 2) + 20) * 10')).toEqual({
      error: null,
      result: 10,
    });
    expect(parseFormula('(((1 + 10 - 20 * 3/2) + 20) * 10) / 5.12')).toEqual({
      error: null,
      result: 1.953125,
    });
    expect(parseFormula('(((1 + "foo" - 20 * 3/2) + 20) * 10) / 5.12')).toEqual(
      { error: '#VALUE!', result: null },
    );
  });
  it('operator %', () => {
    expect(parseFormula('1%')).toEqual({ error: null, result: 0.01 });
    expect(parseFormula('(1+2)%')).toEqual({ error: null, result: 0.03 });
  });
});
