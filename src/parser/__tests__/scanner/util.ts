import { Token } from '../../token';
import { Scanner } from '../../scanner';
import type { TokenType } from '../../../types';

export type BlockType = [string, Token[]];
export function itBlock(list: Array<BlockType>) {
  for (const item of list) {
    const [formula, expected] = item;
    it(formula, () => {
      const result = new Scanner(formula).scan();
      result.pop();
      expect(result).toEqual(expected);
    });
  }
}

export function getToken(type: TokenType, value: string) {
  return new Token(type, value);
}
