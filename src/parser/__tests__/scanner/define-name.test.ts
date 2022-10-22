import { itBlock, getToken, BlockType } from './util';
import { TokenType } from '../../../types';

describe('define name expression', function () {
  const list: Array<BlockType> = [
    ['foo', [getToken(TokenType.IDENTIFIER, 'foo')]],
  ];
  itBlock(list);
});
