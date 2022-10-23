import { itBlock, getToken, BlockType } from './util';
import { TokenType } from '../../../types';

describe('functions', function () {
  const list: Array<BlockType> = [
    [
      'TODAY()',
      [
        getToken(TokenType.IDENTIFIER, 'TODAY'),
        getToken(TokenType.LEFT_BRACKET, '('),
        getToken(TokenType.RIGHT_BRACKET, ')'),
      ],
    ],
    [
      'SUM(1)',
      [
        getToken(TokenType.IDENTIFIER, 'SUM'),
        getToken(TokenType.LEFT_BRACKET, '('),
        getToken(TokenType.NUMBER, '1'),
        getToken(TokenType.RIGHT_BRACKET, ')'),
      ],
    ],
    [
      'SUM(1,2)',
      [
        getToken(TokenType.IDENTIFIER, 'SUM'),
        getToken(TokenType.LEFT_BRACKET, '('),
        getToken(TokenType.NUMBER, '1'),
        getToken(TokenType.COMMA, ','),
        getToken(TokenType.NUMBER, '2'),
        getToken(TokenType.RIGHT_BRACKET, ')'),
      ],
    ],
    [
      'SUM(1,SUM(2,3))',
      [
        getToken(TokenType.IDENTIFIER, 'SUM'),
        getToken(TokenType.LEFT_BRACKET, '('),
        getToken(TokenType.NUMBER, '1'),
        getToken(TokenType.COMMA, ','),
        getToken(TokenType.IDENTIFIER, 'SUM'),
        getToken(TokenType.LEFT_BRACKET, '('),
        getToken(TokenType.NUMBER, '2'),
        getToken(TokenType.COMMA, ','),
        getToken(TokenType.NUMBER, '3'),
        getToken(TokenType.RIGHT_BRACKET, ')'),
        getToken(TokenType.RIGHT_BRACKET, ')'),
      ],
    ],
  ];
  itBlock(list);
});
