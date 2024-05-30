import { XLSX_MAX_COL_COUNT, XLSX_MAX_ROW_COUNT } from '@/util';
import { Interpreter } from '../../interpreter';
import { CellDataMapImpl } from '../../eval';
import {
  Expression,
  BinaryExpression,
  LiteralExpression,
  UnaryExpression,
  CellRangeExpression,
  CellExpression,
  PostUnaryExpression,
} from '../../expression';
import { Token } from '../../token';
import { TokenType } from '@/types';
import { expectFormula } from './util';

function interpret(list: Expression[]) {
  return new Interpreter(
    list,
    { row: 0, col: 0 },
    new CellDataMapImpl(),
  ).interpret();
}

describe('error.test.ts', () => {
  describe('error', () => {
    test('not CustomError', () => {
      const cellData = new CellDataMapImpl();
      cellData.getCell = () => {
        throw new Error('test');
      };
      expect(() => {
        expectFormula('=A1', [], undefined, cellData);
      }).toThrow();
    });
    test('BinaryExpression', () => {
      expect(() => {
        interpret([
          new BinaryExpression(
            new LiteralExpression(new Token(TokenType.INTEGER, '1')),
            new Token(TokenType.COLON, ':'),
            new LiteralExpression(new Token(TokenType.INTEGER, '1')),
          ),
        ]);
      }).toThrow();
    });

    test('LiteralExpression', () => {
      expect(() => {
        interpret([new LiteralExpression(new Token(TokenType.INTEGER, 'aa'))]);
      }).toThrow();

      expect(() => {
        interpret([
          new LiteralExpression(new Token(TokenType.IDENTIFIER, 'aa')),
        ]);
      }).toThrow();
    });

    test('UnaryExpression', () => {
      expect(() => {
        interpret([
          new UnaryExpression(
            new Token(TokenType.COLON, ':'),
            new LiteralExpression(new Token(TokenType.INTEGER, '1')),
          ),
        ]);
      }).toThrow();
    });

    test('CellRangeExpression error operator', () => {
      expect(() => {
        interpret([
          new CellRangeExpression(
            new CellExpression(
              new Token(TokenType.INTEGER, '1'),
              'relative',
              undefined,
            ),
            new Token(TokenType.IDENTIFIER, 'aa'),
            new CellExpression(
              new Token(TokenType.INTEGER, '1'),
              'relative',
              undefined,
            ),
          ),
        ]);
      }).toThrow();
    });
    test('CellRangeExpression can not merge range', () => {
      expect(() => {
        interpret([
          new CellRangeExpression(
            new CellExpression(
              new Token(TokenType.IDENTIFIER, 'F'),
              'relative',
              undefined,
            ),
            new Token(TokenType.COLON, ':'),
            new CellExpression(
              new Token(TokenType.INTEGER, '1'),
              'relative',
              undefined,
            ),
          ),
        ]);
      }).toThrow();
    });
    test('PostUnaryExpression', () => {
      expect(() => {
        interpret([
          new PostUnaryExpression(
            new Token(TokenType.IDENTIFIER, 'aa'),
            new LiteralExpression(new Token(TokenType.INTEGER, '1')),
          ),
        ]);
      }).toThrow();
    });
    test('CellExpression', () => {
      expect(() => {
        interpret([
          new CellExpression(
            new Token(TokenType.IDENTIFIER, 'FFFFFFFFFFF1'),
            'relative',
            undefined,
          ),
        ]);
      }).toThrow();
      expect(() => {
        interpret([
          new CellExpression(
            new Token(TokenType.IDENTIFIER, 'A1'),
            'relative',
            new Token(TokenType.IDENTIFIER, 'fe'),
          ),
        ]);
      }).toThrow();
    });
  });
  describe('R1C1', () => {
    it('row overflow', () => {
      expectFormula(`=R${XLSX_MAX_ROW_COUNT + 10}C`, ['#NAME?']);
    });
    it('col overflow', () => {
      expectFormula(`=RC${XLSX_MAX_COL_COUNT + 10}`, ['#NAME?']);
    });
    it('all overflow', () => {
      expectFormula(
        `=R${XLSX_MAX_ROW_COUNT + 10}C${XLSX_MAX_COL_COUNT + 10}`,
        ['#NAME?'],
      );
    });
  });
  describe('A1', () => {
    it('col overflow', () => {
      expectFormula(`=XFF1`, ['#NAME?']);
    });
    it('row overflow', () => {
      expectFormula(`=A${XLSX_MAX_ROW_COUNT + 10}`, ['#NAME?']);
    });
    it('all overflow', () => {
      expectFormula(`=XFF${XLSX_MAX_ROW_COUNT + 10}`, ['#NAME?']);
    });
  });
});
