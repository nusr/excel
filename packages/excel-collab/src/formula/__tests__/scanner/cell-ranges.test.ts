import { itBlock, getToken, BlockType } from './util';
import { TokenType } from '../../../types';

describe('cell ranges', () => {
  describe('A1 style', () => {
    const list: BlockType[] = [
      ['A1', [getToken(TokenType.CELL, 'A1')]],
      ['$A$1', [getToken(TokenType.CELL, '$A$1')]],
      ['A$1', [getToken(TokenType.CELL, 'A$1')]],
      ['$A1', [getToken(TokenType.CELL, '$A1')]],
      [
        'A10:A20',
        [
          getToken(TokenType.CELL, 'A10'),
          getToken(TokenType.COLON, ':'),
          getToken(TokenType.CELL, 'A20'),
        ],
      ],
      [
        'A1:C1',
        [
          getToken(TokenType.CELL, 'A1'),
          getToken(TokenType.COLON, ':'),
          getToken(TokenType.CELL, 'C1'),
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
          getToken(TokenType.COLUMN, 'H'),
          getToken(TokenType.COLON, ':'),
          getToken(TokenType.COLUMN, 'H'),
        ],
      ],
      [
        'H:J',
        [
          getToken(TokenType.COLUMN, 'H'),
          getToken(TokenType.COLON, ':'),
          getToken(TokenType.COLUMN, 'J'),
        ],
      ],
      [
        'A10:E20',
        [
          getToken(TokenType.CELL, 'A10'),
          getToken(TokenType.COLON, ':'),
          getToken(TokenType.CELL, 'E20'),
        ],
      ],
    ];
    itBlock(list);
  });
});
