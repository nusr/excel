import { itBlock, getToken, BlockType } from './util';
import { TokenType } from '@excel/shared';

describe('functions', () => {
  const list: BlockType[] = [
    [
      'TODAY()',
      [
        getToken(TokenType.EXCEL_FUNCTION, 'TODAY'),
        getToken(TokenType.RIGHT_BRACKET, ')'),
      ],
    ],
    [
      'SUM(1)',
      [
        getToken(TokenType.EXCEL_FUNCTION, 'SUM'),
        getToken(TokenType.NUMBER, '1'),
        getToken(TokenType.RIGHT_BRACKET, ')'),
      ],
    ],
    [
      'SUM(1,2)',
      [
        getToken(TokenType.EXCEL_FUNCTION, 'SUM'),
        getToken(TokenType.NUMBER, '1'),
        getToken(TokenType.COMMA, ','),
        getToken(TokenType.NUMBER, '2'),
        getToken(TokenType.RIGHT_BRACKET, ')'),
      ],
    ],
    [
      'SUM(1,SUM(2,3))',
      [
        getToken(TokenType.EXCEL_FUNCTION, 'SUM'),
        getToken(TokenType.NUMBER, '1'),
        getToken(TokenType.COMMA, ','),
        getToken(TokenType.EXCEL_FUNCTION, 'SUM'),
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
