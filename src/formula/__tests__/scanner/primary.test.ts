import { Scanner } from '../../scanner';
import { itBlock, getToken, BlockType } from './util';
import { TokenType } from '../../../types';

describe('primary', () => {
  describe('number', () => {
    test('invalid', () => {
      expect(() => new Scanner('1e').scan()).toThrow();
      expect(() => new Scanner('1E').scan()).toThrow();
    });
    const list: BlockType[] = [
      ['\r \t \n 1', [getToken(TokenType.INTEGER, '1')]],
      ['1.1', [getToken(TokenType.FLOAT, '1.1')]],
      ['1.1E+1', [getToken(TokenType.FLOAT, '1.1E+1')]],
      ['1.1E-1', [getToken(TokenType.FLOAT, '1.1E-1')]],
      ['1.1E1', [getToken(TokenType.FLOAT, '1.1E1')]],
      ['1E+1', [getToken(TokenType.INTEGER, '1E+1')]],
      ['1E-1', [getToken(TokenType.INTEGER, '1E-1')]],
      ['1E1', [getToken(TokenType.INTEGER, '1E1')]],
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
      ['true', [getToken(TokenType.TRUE, 'TRUE')]],
      ['tRue', [getToken(TokenType.TRUE, 'TRUE')]],
      ['TRUE', [getToken(TokenType.TRUE, 'TRUE')]],
      ['false', [getToken(TokenType.FALSE, 'FALSE')]],
      ['False', [getToken(TokenType.FALSE, 'FALSE')]],
      ['FALSE', [getToken(TokenType.FALSE, 'FALSE')]],
    ];
    itBlock(list);
  });
});
