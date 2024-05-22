import { itBlock, getToken, BlockType } from './util';
import { TokenType } from '../../../types';

describe('cell ranges', () => {
  describe('A1 style', () => {
    const list: BlockType[] = [
      ['A1', [getToken(TokenType.IDENTIFIER, 'A1')]],
      ['$A$1', [getToken(TokenType.ABSOLUTE_CELL, '$A$1')]],
      ['A$1', [getToken(TokenType.MIXED_CELL, 'A$1')]],
      ['$A1', [getToken(TokenType.MIXED_CELL, '$A1')]],
      [
        'A10:A20',
        [
          getToken(TokenType.IDENTIFIER, 'A10'),
          getToken(TokenType.COLON, ':'),
          getToken(TokenType.IDENTIFIER, 'A20'),
        ],
      ],
      [
        'A1:C1',
        [
          getToken(TokenType.IDENTIFIER, 'A1'),
          getToken(TokenType.COLON, ':'),
          getToken(TokenType.IDENTIFIER, 'C1'),
        ],
      ],
      [
        '5:5',
        [
          getToken(TokenType.INTEGER, '5'),
          getToken(TokenType.COLON, ':'),
          getToken(TokenType.INTEGER, '5'),
        ],
      ],
      [
        '5:10',
        [
          getToken(TokenType.INTEGER, '5'),
          getToken(TokenType.COLON, ':'),
          getToken(TokenType.INTEGER, '10'),
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
          getToken(TokenType.IDENTIFIER, 'A10'),
          getToken(TokenType.COLON, ':'),
          getToken(TokenType.IDENTIFIER, 'E20'),
        ],
      ],
    ];
    itBlock(list);
  });

  describe('R1C1 style', function () {
    const list: BlockType[] = [
      ['R1C1', [getToken(TokenType.R1C1, 'R1C1')]],
      ['R[-2]C', [getToken(TokenType.R1C1, 'R[-2]C')]],
      ['RC[3]', [getToken(TokenType.R1C1, 'RC[3]')]],
      ['R2C', [getToken(TokenType.R1C1, 'R2C')]],
      ['RC2', [getToken(TokenType.R1C1, 'RC2')]],
      ['R[2]C[2]', [getToken(TokenType.R1C1, 'R[2]C[2]')]],
      ['R[2]C[2]', [getToken(TokenType.R1C1, 'R[2]C[2]')]],
      // ['R[-1]', [getToken(TokenType.R1C1, 'R[-1]')]],
      // ['C[-1]', [getToken(TokenType.R1C1, 'C[-1]')]],
      // ['R', [getToken(TokenType.R1C1, 'R')]],
      // ['C', [getToken(TokenType.R1C1, 'C')]],
    ];
    itBlock(list);
  });
});
