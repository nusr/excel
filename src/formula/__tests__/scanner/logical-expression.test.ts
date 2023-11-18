import { itBlock, getToken, BlockType } from './util';
import { TokenType } from '../../../types';

describe('logical expressions', () => {
  const list: BlockType[] = [
    ['TRUE', [getToken(TokenType.TRUE, 'TRUE')]],
    ['true', [getToken(TokenType.TRUE, 'TRUE')]],
    ['FALSE', [getToken(TokenType.FALSE, 'FALSE')]],
    ['false', [getToken(TokenType.FALSE, 'FALSE')]],
  ];
  itBlock(list);
});
