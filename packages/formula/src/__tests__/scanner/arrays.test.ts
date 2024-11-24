import { itBlock, getToken, BlockType } from './util';
import { TokenType } from '@excel/shared';

describe('arrays', () => {
  const list: BlockType[] = [
    [
      '{1,2,3}',
      [
        getToken(TokenType.lEFT_BRACE, '{'),
        getToken(TokenType.NUMBER, '1'),
        getToken(TokenType.COMMA, ','),
        getToken(TokenType.NUMBER, '2'),
        getToken(TokenType.COMMA, ','),
        getToken(TokenType.NUMBER, '3'),
        getToken(TokenType.RIGHT_BRACE, '}'),
      ],
    ],
    [
      '{1;2;3}',
      [
        getToken(TokenType.lEFT_BRACE, '{'),
        getToken(TokenType.NUMBER, '1'),
        getToken(TokenType.SEMICOLON, ';'),
        getToken(TokenType.NUMBER, '2'),
        getToken(TokenType.SEMICOLON, ';'),
        getToken(TokenType.NUMBER, '3'),
        getToken(TokenType.RIGHT_BRACE, '}'),
      ],
    ],
  ];

  itBlock(list);
});
