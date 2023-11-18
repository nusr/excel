import { itBlock, getToken, BlockType } from './util';
import { TokenType } from '../../../types';

describe('arithmetic expressions', function () {
  const list: Array<BlockType> = [
    ['1', [getToken(TokenType.NUMBER, '1')]],
    ['1.5', [getToken(TokenType.NUMBER, '1.5')]],
    ['11.55', [getToken(TokenType.NUMBER, '11.55')]],
    ['1E-1', [getToken(TokenType.NUMBER, '1E-1')]],
    ['1E1', [getToken(TokenType.NUMBER, '1E1')]],
    ['1E10', [getToken(TokenType.NUMBER, '1E10')]],
    ['1.5E-10', [getToken(TokenType.NUMBER, '1.5E-10')]],
    ['1.55E+100', [getToken(TokenType.NUMBER, '1.55E+100')]],
    [
      '1+2',
      [
        getToken(TokenType.NUMBER, '1'),
        getToken(TokenType.PLUS, '+'),
        getToken(TokenType.NUMBER, '2'),
      ],
    ],
    [
      '1+2',
      [
        getToken(TokenType.NUMBER, '1'),
        getToken(TokenType.PLUS, '+'),
        getToken(TokenType.NUMBER, '2'),
      ],
    ],
    [
      '1.1+2.2',
      [
        getToken(TokenType.NUMBER, '1.1'),
        getToken(TokenType.PLUS, '+'),
        getToken(TokenType.NUMBER, '2.2'),
      ],
    ],
    [
      '(1+2)-3',
      [
        getToken(TokenType.LEFT_BRACKET, '('),
        getToken(TokenType.NUMBER, '1'),
        getToken(TokenType.PLUS, '+'),
        getToken(TokenType.NUMBER, '2'),
        getToken(TokenType.RIGHT_BRACKET, ')'),
        getToken(TokenType.MINUS, '-'),
        getToken(TokenType.NUMBER, '3'),
      ],
    ],
    [
      '=(1.1+2)-3',
      [
        getToken(TokenType.LEFT_BRACKET, '('),
        getToken(TokenType.NUMBER, '1.1'),
        getToken(TokenType.PLUS, '+'),
        getToken(TokenType.NUMBER, '2'),
        getToken(TokenType.RIGHT_BRACKET, ')'),
        getToken(TokenType.MINUS, '-'),
        getToken(TokenType.NUMBER, '3'),
      ],
    ],
    [
      '=1+2*3',
      [
        getToken(TokenType.NUMBER, '1'),
        getToken(TokenType.PLUS, '+'),
        getToken(TokenType.NUMBER, '2'),
        getToken(TokenType.STAR, '*'),
        getToken(TokenType.NUMBER, '3'),
      ],
    ],
    [
      '=1+2*3',
      [
        getToken(TokenType.NUMBER, '1'),
        getToken(TokenType.PLUS, '+'),
        getToken(TokenType.NUMBER, '2'),
        getToken(TokenType.STAR, '*'),
        getToken(TokenType.NUMBER, '3'),
      ],
    ],
    ['-1', [getToken(TokenType.MINUS, '-'), getToken(TokenType.NUMBER, '1')]],
    ['+1', [getToken(TokenType.PLUS, '+'), getToken(TokenType.NUMBER, '1')]],
    ['1%', [getToken(TokenType.NUMBER, '1'), getToken(TokenType.PERCENT, '%')]],
    [
      '-(1+2)',
      [
        getToken(TokenType.MINUS, '-'),
        getToken(TokenType.LEFT_BRACKET, '('),
        getToken(TokenType.NUMBER, '1'),
        getToken(TokenType.PLUS, '+'),
        getToken(TokenType.NUMBER, '2'),
        getToken(TokenType.RIGHT_BRACKET, ')'),
      ],
    ],
    [
      '(1+2)%',
      [
        getToken(TokenType.LEFT_BRACKET, '('),
        getToken(TokenType.NUMBER, '1'),
        getToken(TokenType.PLUS, '+'),
        getToken(TokenType.NUMBER, '2'),
        getToken(TokenType.RIGHT_BRACKET, ')'),
        getToken(TokenType.PERCENT, '%'),
      ],
    ],
  ];

  itBlock(list);
});
