import { itBlock, getToken, BlockType } from './util';
import { TokenType } from '../../../types';

describe('define name expression', () => {
  const list: BlockType[] = [['foo', [getToken(TokenType.IDENTIFIER, 'foo')]]];
  itBlock(list);
});
