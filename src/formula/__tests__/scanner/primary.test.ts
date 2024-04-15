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
      ['\r \t \n 1', [getToken(TokenType.NUMBER, '1')]],
    ];
    itBlock(list);
  });
  describe('string', () => {
    test('invalid', () => {
      expect(() => new Scanner('"1').scan()).toThrow();
    });
    const list: BlockType[] = [
      ['\r \t \n "test"', [getToken(TokenType.STRING, 'test')]],
    ];
    itBlock(list);
  });
});
