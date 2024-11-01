import { itBlock, getToken, BlockType } from './util';
import { TokenType } from '../../../types';

describe('comparison expressions', () => {
  const list: BlockType[] = [
    [
      '1>2',
      [
        getToken(TokenType.NUMBER, '1'),
        getToken(TokenType.GREATER, '>'),
        getToken(TokenType.NUMBER, '2'),
      ],
    ],
    [
      '1>=2',
      [
        getToken(TokenType.NUMBER, '1'),
        getToken(TokenType.GREATER_EQUAL, '>='),
        getToken(TokenType.NUMBER, '2'),
      ],
    ],
    [
      '1=2',
      [
        getToken(TokenType.NUMBER, '1'),
        getToken(TokenType.EQUAL, '='),
        getToken(TokenType.NUMBER, '2'),
      ],
    ],
    [
      '1<>2',
      [
        getToken(TokenType.NUMBER, '1'),
        getToken(TokenType.NOT_EQUAL, '<>'),
        getToken(TokenType.NUMBER, '2'),
      ],
    ],
  ];
  itBlock(list);
});
