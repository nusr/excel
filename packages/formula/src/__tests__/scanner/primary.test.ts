import { Scanner } from '../../scanner';
import { itBlock, getToken, BlockType } from './util';
import { TokenType } from '@excel/shared';

describe('primary', () => {
  describe('number', () => {
    test('invalid', () => {
      expect(() => new Scanner('1e').scan()).toThrow();
      expect(() => new Scanner('1E').scan()).toThrow();
    });
    const list: BlockType[] = [
      ['\r \t \n 1', [getToken(TokenType.NUMBER, '1')]],
      ['1.1', [getToken(TokenType.NUMBER, '1.1')]],
      ['1.1E+1', [getToken(TokenType.NUMBER, '1.1E+1')]],
      ['1.1E-1', [getToken(TokenType.NUMBER, '1.1E-1')]],
      ['1.1E1', [getToken(TokenType.NUMBER, '1.1E1')]],
      ['1E+1', [getToken(TokenType.NUMBER, '1E+1')]],
      ['1E-1', [getToken(TokenType.NUMBER, '1E-1')]],
      ['1E1', [getToken(TokenType.NUMBER, '1E1')]],
    ];
    itBlock(list);
  });
  describe('string', () => {
    test('invalid', () => {
      expect(() => new Scanner('"1').scan()).toThrow();
    });
    const list: BlockType[] = [
      ['\r \t \n "test"', [getToken(TokenType.STRING, 'test')]],
      ["'test'", [getToken(TokenType.STRING, 'test')]],
    ];
    itBlock(list);
  });
  describe('boolean', () => {
    const list: BlockType[] = [
      ['true', [getToken(TokenType.BOOL, 'TRUE')]],
      ['tRue', [getToken(TokenType.BOOL, 'TRUE')]],
      ['TRUE', [getToken(TokenType.BOOL, 'TRUE')]],
      ['false', [getToken(TokenType.BOOL, 'FALSE')]],
      ['False', [getToken(TokenType.BOOL, 'FALSE')]],
      ['FALSE', [getToken(TokenType.BOOL, 'FALSE')]],
    ];
    itBlock(list);
  });
});
