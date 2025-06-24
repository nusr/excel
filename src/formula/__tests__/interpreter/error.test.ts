import { XLSX_MAX_COL_COUNT, XLSX_MAX_ROW_COUNT } from '../../../util';
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
import { TokenType } from '../../../types';
import { expectFormula } from './util';

function interpret(list: Expression[]) {
  return new Interpreter(
    list,
    { row: 0, col: 0, sheetId: '' },
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
            new LiteralExpression(new Token(TokenType.NUMBER, '1')),
            new Token(TokenType.COLON, ':'),
            new LiteralExpression(new Token(TokenType.NUMBER, '1')),
          ),
        ]);
      }).toThrow();
    });

    test('LiteralExpression', () => {
      expect(() => {
        interpret([new LiteralExpression(new Token(TokenType.NUMBER, 'aa'))]);
      }).toThrow();

      expect(() => {
        interpret([new LiteralExpression(new Token(TokenType.COLUMN, 'aa'))]);
      }).toThrow();
    });

    test('UnaryExpression', () => {
      expect(() => {
        interpret([
          new UnaryExpression(
            new Token(TokenType.COLON, ':'),
            new LiteralExpression(new Token(TokenType.NUMBER, '1')),
          ),
        ]);
      }).toThrow();
    });

    test('CellRangeExpression error operator', () => {
      expect(() => {
        interpret([
          new CellRangeExpression(
            new CellExpression(new Token(TokenType.NUMBER, '1'), undefined),
            new Token(TokenType.COLUMN, 'aa'),
            new CellExpression(new Token(TokenType.NUMBER, '1'), undefined),
          ),
        ]);
      }).toThrow();
    });
    test('CellRangeExpression can not merge range', () => {
      expect(() => {
        interpret([
          new CellRangeExpression(
            new CellExpression(
              new Token(TokenType.COLUMN, 'F'),

              undefined,
            ),
            new Token(TokenType.COLON, ':'),
            new CellExpression(
              new Token(TokenType.NUMBER, '1'),

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
            new Token(TokenType.COLUMN, 'aa'),
            new LiteralExpression(new Token(TokenType.NUMBER, '1')),
          ),
        ]);
      }).toThrow();
    });
    test('CellExpression', () => {
      expect(() => {
        interpret([
          new CellExpression(
            new Token(TokenType.DEFINED_NAME, 'FFFFFFFFFFF1'),

            undefined,
          ),
        ]);
      }).toThrow();
      expect(() => {
        interpret([
          new CellExpression(
            new Token(TokenType.CELL, 'A1'),

            new Token(TokenType.COLUMN, 'fe'),
          ),
        ]);
      }).toThrow();
    });
  });
  describe('R1C1', () => {
    it('row overflow', () => {
      expectFormula(`=R${XLSX_MAX_ROW_COUNT + 10}C`, ['#REF!']);
    });
    it('col overflow', () => {
      expectFormula(`=RC${XLSX_MAX_COL_COUNT + 10}`, ['#REF!']);
    });
    it('all overflow', () => {
      expectFormula(`=R${XLSX_MAX_ROW_COUNT + 10}C${XLSX_MAX_COL_COUNT + 10}`, [
        '#REF!',
      ]);
    });
  });
  describe('A1', () => {
    it('col overflow', () => {
      expectFormula(`=XFF1`, ['#REF!']);
    });
    it('row overflow', () => {
      expectFormula(`=A${XLSX_MAX_ROW_COUNT + 10}`, ['#REF!']);
    });
    it('all overflow', () => {
      expectFormula(`=XFF${XLSX_MAX_ROW_COUNT + 10}`, ['#REF!']);
    });
  });
});
