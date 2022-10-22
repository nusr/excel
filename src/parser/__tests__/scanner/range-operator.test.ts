import { itBlock, getToken, BlockType } from './util';
import { TokenType } from '../../../types';

describe('range operators', function () {
  const list: Array<BlockType> = [
    [
      'A1:C1,A2:C2',
      [
        getToken(TokenType.RELATIVE_CELL, 'A1'),
        getToken(TokenType.COLON, ':'),
        getToken(TokenType.RELATIVE_CELL, 'C1'),
        getToken(TokenType.COMMA, ','),
        getToken(TokenType.RELATIVE_CELL, 'A2'),
        getToken(TokenType.COLON, ':'),
        getToken(TokenType.RELATIVE_CELL, 'C2'),
      ],
    ],
    [
      'A1:C1 A2:C2',
      [
        getToken(TokenType.RELATIVE_CELL, 'A1'),
        getToken(TokenType.COLON, ':'),
        getToken(TokenType.RELATIVE_CELL, 'C1'),
        // getToken(TokenType.COMMA, ','),
        getToken(TokenType.RELATIVE_CELL, 'A2'),
        getToken(TokenType.COLON, ':'),
        getToken(TokenType.RELATIVE_CELL, 'C2'),
      ],
    ],
    // multiple spaces between ranges
    [
      'A1:C1  A2:C2',
      [
        getToken(TokenType.RELATIVE_CELL, 'A1'),
        getToken(TokenType.COLON, ':'),
        getToken(TokenType.RELATIVE_CELL, 'C1'),
        // getToken(TokenType.COMMA, ','),
        getToken(TokenType.RELATIVE_CELL, 'A2'),
        getToken(TokenType.COLON, ':'),
        getToken(TokenType.RELATIVE_CELL, 'C2'),
      ],
    ],
  ];
  itBlock(list);
});
