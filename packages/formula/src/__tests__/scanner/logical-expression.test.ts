import { itBlock, getToken, BlockType } from './util';
import { TokenType } from '@excel/shared';

describe('logical expressions', () => {
  const list: BlockType[] = [
    ['TRUE', [getToken(TokenType.BOOL, 'TRUE')]],
    ['true', [getToken(TokenType.BOOL, 'TRUE')]],
    ['FALSE', [getToken(TokenType.BOOL, 'FALSE')]],
    ['false', [getToken(TokenType.BOOL, 'FALSE')]],
  ];
  itBlock(list);
});
