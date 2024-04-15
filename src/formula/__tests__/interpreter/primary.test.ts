import { parseFormula } from '../..';

describe('primary', () => {
  describe('number', () => {
    test('invalid', () => {
      expect(parseFormula('+"a"')).toEqual({
        isError: true,
        result: '#VALUE!',
        expressionStr: '',
      });
      expect(parseFormula('-"a"')).toEqual({
        isError: true,
        result: '#VALUE!',
        expressionStr: '',
      });
    });
  });
});
