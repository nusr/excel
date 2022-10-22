import { itBlock, getToken, BlockType } from './util';
import { TokenType } from '../../../types';

describe('cell ranges', function () {
  describe('A1 style', function () {
    const list: Array<BlockType> = [
      ['A1', [getToken(TokenType.RELATIVE_CELL, 'A1')]],
      ['$A$1', [getToken(TokenType.ABSOLUTE_CELL, '$A$1')]],
      ['A$1', [getToken(TokenType.MIXED_CELL, 'A$1')]],
      ['$A1', [getToken(TokenType.MIXED_CELL, '$A1')]],
      [
        'A10:A20',
        [
          getToken(TokenType.RELATIVE_CELL, 'A10'),
          getToken(TokenType.COLON, ':'),
          getToken(TokenType.RELATIVE_CELL, 'A20'),
        ],
      ],
      [
        'A1:C1',
        [
          getToken(TokenType.RELATIVE_CELL, 'A1'),
          getToken(TokenType.COLON, ':'),
          getToken(TokenType.RELATIVE_CELL, 'C1'),
        ],
      ],
      [
        '5:5',
        [
          getToken(TokenType.NUMBER, '5'),
          getToken(TokenType.COLON, ':'),
          getToken(TokenType.NUMBER, '5'),
        ],
      ],
      [
        '5:10',
        [
          getToken(TokenType.NUMBER, '5'),
          getToken(TokenType.COLON, ':'),
          getToken(TokenType.NUMBER, '10'),
        ],
      ],
      [
        'H:H',
        [
          getToken(TokenType.IDENTIFIER, 'H'),
          getToken(TokenType.COLON, ':'),
          getToken(TokenType.IDENTIFIER, 'H'),
        ],
      ],
      [
        'H:J',
        [
          getToken(TokenType.IDENTIFIER, 'H'),
          getToken(TokenType.COLON, ':'),
          getToken(TokenType.IDENTIFIER, 'J'),
        ],
      ],
      [
        'A10:E20',
        [
          getToken(TokenType.RELATIVE_CELL, 'A10'),
          getToken(TokenType.COLON, ':'),
          getToken(TokenType.RELATIVE_CELL, 'E20'),
        ],
      ],
    ];
    itBlock(list);
  });

  // describe('R1C1 style', function () {
  // const list: Array<BlockType> = [
  // ['R1C1', [['R1C1', 'operand', 'range']]],
  // ['R[-2]C', [['R[-2]C', 'operand', 'range']]],
  // ['RC[3]', [['RC[3]', 'operand', 'range']]],
  // ['R[2]C[2]', [['R[2]C[2]', 'operand', 'range']]],
  // ['R[-1]', [['R[-1]', 'operand', 'range']]],
  // ['C[-1]', [['C[-1]', 'operand', 'range']]],
  // ["R", [["R", "operand", "range"]]],
  // ["C", [["C", "operand", "range"]]],
  // ];
  // itBlock(list);
  // });
});
