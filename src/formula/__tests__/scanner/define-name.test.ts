import { itBlock, getToken, BlockType } from './util';
import { TokenType } from '../../../types';

describe('define name expression', () => {
  const list: BlockType[] = [['foo', [getToken(TokenType.COLUMN, 'foo')]]];
  itBlock(list);
});
