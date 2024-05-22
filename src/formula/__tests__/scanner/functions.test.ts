import { itBlock, getToken, BlockType } from './util';
import { TokenType } from '../../../types';

describe('functions', () => {
  const list: BlockType[] = [
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
        getToken(TokenType.INTEGER, '1'),
        getToken(TokenType.RIGHT_BRACKET, ')'),
      ],
    ],
    [
      'SUM(1,2)',
      [
        getToken(TokenType.IDENTIFIER, 'SUM'),
        getToken(TokenType.LEFT_BRACKET, '('),
        getToken(TokenType.INTEGER, '1'),
        getToken(TokenType.COMMA, ','),
        getToken(TokenType.INTEGER, '2'),
        getToken(TokenType.RIGHT_BRACKET, ')'),
      ],
    ],
    [
      'SUM(1,SUM(2,3))',
      [
        getToken(TokenType.IDENTIFIER, 'SUM'),
        getToken(TokenType.LEFT_BRACKET, '('),
        getToken(TokenType.INTEGER, '1'),
        getToken(TokenType.COMMA, ','),
        getToken(TokenType.IDENTIFIER, 'SUM'),
        getToken(TokenType.LEFT_BRACKET, '('),
        getToken(TokenType.INTEGER, '2'),
        getToken(TokenType.COMMA, ','),
        getToken(TokenType.INTEGER, '3'),
        getToken(TokenType.RIGHT_BRACKET, ')'),
        getToken(TokenType.RIGHT_BRACKET, ')'),
      ],
    ],
  ];
  itBlock(list);
});
