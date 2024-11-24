import { itBlock, getToken, BlockType } from './util';
import { TokenType } from '@excel/shared';

describe('range operators', () => {
  const list: BlockType[] = [
    [
      'A1:C1,A2:C2',
      [
        getToken(TokenType.CELL, 'A1'),
        getToken(TokenType.COLON, ':'),
        getToken(TokenType.CELL, 'C1'),
        getToken(TokenType.COMMA, ','),
        getToken(TokenType.CELL, 'A2'),
        getToken(TokenType.COLON, ':'),
        getToken(TokenType.CELL, 'C2'),
      ],
    ],
    [
      'A1:C1 A2:C2',
      [
        getToken(TokenType.CELL, 'A1'),
        getToken(TokenType.COLON, ':'),
        getToken(TokenType.CELL, 'C1'),
        // getToken(TokenType.EMPTY_CHAR, ' '),
        getToken(TokenType.CELL, 'A2'),
        getToken(TokenType.COLON, ':'),
        getToken(TokenType.CELL, 'C2'),
      ],
    ],
  ];
  itBlock(list);
});
