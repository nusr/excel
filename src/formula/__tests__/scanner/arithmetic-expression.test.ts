import { itBlock, getToken, BlockType } from './util';
import { TokenType } from '../../../types';

describe('arithmetic expressions', () => {
  const list: BlockType[] = [
    ['1', [getToken(TokenType.INTEGER, '1')]],
    ['1.5', [getToken(TokenType.FLOAT, '1.5')]],
    ['11.55', [getToken(TokenType.FLOAT, '11.55')]],
    ['1E-1', [getToken(TokenType.INTEGER, '1E-1')]],
    ['1E1', [getToken(TokenType.INTEGER, '1E1')]],
    ['1E10', [getToken(TokenType.INTEGER, '1E10')]],
    ['1.5E-10', [getToken(TokenType.FLOAT, '1.5E-10')]],
    ['1.55E+100', [getToken(TokenType.FLOAT, '1.55E+100')]],
    [
      '1+2',
      [
        getToken(TokenType.INTEGER, '1'),
        getToken(TokenType.PLUS, '+'),
        getToken(TokenType.INTEGER, '2'),
      ],
    ],
    [
      '1+2',
      [
        getToken(TokenType.INTEGER, '1'),
        getToken(TokenType.PLUS, '+'),
        getToken(TokenType.INTEGER, '2'),
      ],
    ],
    [
      '1.1+2.2',
      [
        getToken(TokenType.FLOAT, '1.1'),
        getToken(TokenType.PLUS, '+'),
        getToken(TokenType.FLOAT, '2.2'),
      ],
    ],
    [
      '(1+2)-3',
      [
        getToken(TokenType.LEFT_BRACKET, '('),
        getToken(TokenType.INTEGER, '1'),
        getToken(TokenType.PLUS, '+'),
        getToken(TokenType.INTEGER, '2'),
        getToken(TokenType.RIGHT_BRACKET, ')'),
        getToken(TokenType.MINUS, '-'),
        getToken(TokenType.INTEGER, '3'),
      ],
    ],
    [
      '=(1.1+2)-3',
      [
        getToken(TokenType.LEFT_BRACKET, '('),
        getToken(TokenType.FLOAT, '1.1'),
        getToken(TokenType.PLUS, '+'),
        getToken(TokenType.INTEGER, '2'),
        getToken(TokenType.RIGHT_BRACKET, ')'),
        getToken(TokenType.MINUS, '-'),
        getToken(TokenType.INTEGER, '3'),
      ],
    ],
    [
      '=1+2*3',
      [
        getToken(TokenType.INTEGER, '1'),
        getToken(TokenType.PLUS, '+'),
        getToken(TokenType.INTEGER, '2'),
        getToken(TokenType.STAR, '*'),
        getToken(TokenType.INTEGER, '3'),
      ],
    ],
    [
      '=1+2*3',
      [
        getToken(TokenType.INTEGER, '1'),
        getToken(TokenType.PLUS, '+'),
        getToken(TokenType.INTEGER, '2'),
        getToken(TokenType.STAR, '*'),
        getToken(TokenType.INTEGER, '3'),
      ],
    ],
    ['-1', [getToken(TokenType.MINUS, '-'), getToken(TokenType.INTEGER, '1')]],
    ['+1', [getToken(TokenType.PLUS, '+'), getToken(TokenType.INTEGER, '1')]],
    ['1%', [getToken(TokenType.INTEGER, '1'), getToken(TokenType.PERCENT, '%')]],
    [
      '-(1+2)',
      [
        getToken(TokenType.MINUS, '-'),
        getToken(TokenType.LEFT_BRACKET, '('),
        getToken(TokenType.INTEGER, '1'),
        getToken(TokenType.PLUS, '+'),
        getToken(TokenType.INTEGER, '2'),
        getToken(TokenType.RIGHT_BRACKET, ')'),
      ],
    ],
    [
      '(1+2)%',
      [
        getToken(TokenType.LEFT_BRACKET, '('),
        getToken(TokenType.INTEGER, '1'),
        getToken(TokenType.PLUS, '+'),
        getToken(TokenType.INTEGER, '2'),
        getToken(TokenType.RIGHT_BRACKET, ')'),
        getToken(TokenType.PERCENT, '%'),
      ],
    ],
  ];

  itBlock(list);
});
