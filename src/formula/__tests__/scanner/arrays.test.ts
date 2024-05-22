import { itBlock, getToken, BlockType } from './util';
import { TokenType } from '../../../types';

describe('arrays', () => {
  const list: BlockType[] = [
    [
      '{1,2,3}',
      [
        getToken(TokenType.lEFT_BRACE, '{'),
        getToken(TokenType.INTEGER, '1'),
        getToken(TokenType.COMMA, ','),
        getToken(TokenType.INTEGER, '2'),
        getToken(TokenType.COMMA, ','),
        getToken(TokenType.INTEGER, '3'),
        getToken(TokenType.RIGHT_BRACE, '}'),
      ],
    ],
    [
      '{1;2;3}',
      [
        getToken(TokenType.lEFT_BRACE, '{'),
        getToken(TokenType.INTEGER, '1'),
        getToken(TokenType.SEMICOLON, ';'),
        getToken(TokenType.INTEGER, '2'),
        getToken(TokenType.SEMICOLON, ';'),
        getToken(TokenType.INTEGER, '3'),
        getToken(TokenType.RIGHT_BRACE, '}'),
      ],
    ],
  ];

  itBlock(list);
});
