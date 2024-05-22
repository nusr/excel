import { itBlock, getToken, BlockType } from './util';
import { TokenType } from '../../../types';

describe('comparison expressions', () => {
  const list: BlockType[] = [
    [
      '1>2',
      [
        getToken(TokenType.INTEGER, '1'),
        getToken(TokenType.GREATER, '>'),
        getToken(TokenType.INTEGER, '2'),
      ],
    ],
    [
      '1>=2',
      [
        getToken(TokenType.INTEGER, '1'),
        getToken(TokenType.GREATER_EQUAL, '>='),
        getToken(TokenType.INTEGER, '2'),
      ],
    ],
    [
      '1=2',
      [
        getToken(TokenType.INTEGER, '1'),
        getToken(TokenType.EQUAL, '='),
        getToken(TokenType.INTEGER, '2'),
      ],
    ],
    [
      '1<>2',
      [
        getToken(TokenType.INTEGER, '1'),
        getToken(TokenType.NOT_EQUAL, '<>'),
        getToken(TokenType.INTEGER, '2'),
      ],
    ],
  ];
  itBlock(list);
});
