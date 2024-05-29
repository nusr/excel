import { expectResult } from './util';
import { XLSX_MAX_COL_COUNT, XLSX_MAX_ROW_COUNT } from '@/util';
import { Interpreter } from '../../interpreter';
import { CellDataMapImpl, parseFormula } from '../../eval';
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
        parseFormula('=A1', { row: 0, col: 0 }, cellData);
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
  });
  describe('R1C1', () => {
    it('row overflow', () => {
      expectResult(`=R${XLSX_MAX_ROW_COUNT + 10}C`, '#NAME?');
    });
    it('col overflow', () => {
      expectResult(`=RC${XLSX_MAX_COL_COUNT + 10}`, '#NAME?');
    });
    it('all overflow', () => {
      expectResult(
        `=R${XLSX_MAX_ROW_COUNT + 10}C${XLSX_MAX_COL_COUNT + 10}`,
        '#NAME?',
      );
    });
  });
  describe('A1', () => {
    it('col overflow', () => {
      expectResult(`=XFF1`, '#NAME?');
    });
    it('row overflow', () => {
      expectResult(`=A${XLSX_MAX_ROW_COUNT + 10}`, '#NAME?');
    });
    it('all overflow', () => {
      expectResult(`=XFF${XLSX_MAX_ROW_COUNT + 10}`, '#NAME?');
    });
  });
});
