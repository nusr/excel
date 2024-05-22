import { itBlock, getToken, BlockType } from './util';
import { TokenType } from '../../../types';
import { Scanner } from '../../scanner';

describe('r1c1.test.ts', () => {
  describe('ok', () => {
    const list: BlockType[] = [
      ['R1C1', [getToken(TokenType.R1C1, 'R1C1')]],
      ['R[-2]C', [getToken(TokenType.R1C1, 'R[-2]C')]],
      ['RC[3]', [getToken(TokenType.R1C1, 'RC[3]')]],
      ['R2C', [getToken(TokenType.R1C1, 'R2C')]],
      ['RC2', [getToken(TokenType.R1C1, 'RC2')]],
      ['R[2]C[2]', [getToken(TokenType.R1C1, 'R[2]C[2]')]],
      ['R[2]C[2]', [getToken(TokenType.R1C1, 'R[2]C[2]')]],
    ];
    itBlock(list);
  });
  describe('error', () => {
    const throwList: string[] = ['R[1C1', 'R[]C', 'R1C[]', 'R1C['];

    for (const item of throwList) {
      test(item, () => {
        expect(() => new Scanner(item).scan()).toThrow();
      });
    }

    const list: BlockType[] = [
      ['RA', [getToken(TokenType.IDENTIFIER, 'RA')]],
      ['R1A', [getToken(TokenType.IDENTIFIER, 'R1A')]],
    ];
    itBlock(list);
  });
});
