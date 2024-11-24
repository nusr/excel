import { itBlock, getToken, BlockType } from './util';
import { TokenType } from '@excel/shared';

describe('define name expression', () => {
  const list: BlockType[] = [['foo', [getToken(TokenType.COLUMN, 'foo')]]];
  itBlock(list);
});
