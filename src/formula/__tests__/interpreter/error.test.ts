import { expectResult } from './util';
import { XLSX_MAX_COL_COUNT, XLSX_MAX_ROW_COUNT } from '@/util';
import { Interpreter } from '../../interpreter';
import { CellDataMapImpl, DefinedNamesMapImpl, parseFormula } from '../../eval';
import allFormulas from '../../formula';
import {
  BinaryExpression,
  LiteralExpression,
  UnaryExpression,
  CellRangeExpression,
  CellExpression,
  PostUnaryExpression,
} from '../../expression';
import { Token } from '../../token';
import { TokenType } from '@/types';

describe('error.test.ts', () => {
  describe('error', () => {
    test('not CustomError', () => {
      const cellData = new CellDataMapImpl();
      cellData.get = () => {
        throw new Error('test');
      };
      expect(() => {
        parseFormula('=A1', cellData);
      }).toThrow();
    });
    test('BinaryExpression', () => {
      expect(() => {
        new Interpreter(
          [
            new BinaryExpression(
              new LiteralExpression(new Token(TokenType.INTEGER, '1')),
              new Token(TokenType.COLON, ':'),
              new LiteralExpression(new Token(TokenType.INTEGER, '1')),
            ),
          ],
          new CellDataMapImpl(),
          new DefinedNamesMapImpl(),
          allFormulas,
        ).interpret();
      }).toThrow();
    });

    test('LiteralExpression', () => {
      expect(() => {
        new Interpreter(
          [new LiteralExpression(new Token(TokenType.INTEGER, 'aa'))],
          new CellDataMapImpl(),
          new DefinedNamesMapImpl(),
          allFormulas,
        ).interpret();
      }).toThrow();

      expect(() => {
        new Interpreter(
          [new LiteralExpression(new Token(TokenType.IDENTIFIER, 'aa'))],
          new CellDataMapImpl(),
          new DefinedNamesMapImpl(),
          allFormulas,
        ).interpret();
      }).toThrow();
    });

    test('UnaryExpression', () => {
      expect(() => {
        new Interpreter(
          [
            new UnaryExpression(
              new Token(TokenType.COLON, ':'),
              new LiteralExpression(new Token(TokenType.INTEGER, '1')),
            ),
          ],
          new CellDataMapImpl(),
          new DefinedNamesMapImpl(),
          allFormulas,
        ).interpret();
      }).toThrow();
    });

    test('CellRangeExpression error operator', () => {
      expect(() => {
        new Interpreter(
          [
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
          ],
          new CellDataMapImpl(),
          new DefinedNamesMapImpl(),
          allFormulas,
        ).interpret();
      }).toThrow();
    });
    test('CellRangeExpression can not merge range', () => {
      expect(() => {
        new Interpreter(
          [
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
          ],
          new CellDataMapImpl(),
          new DefinedNamesMapImpl(),
          allFormulas,
        ).interpret();
      }).toThrow();
    });
    test('PostUnaryExpression', () => {
      expect(() => {
        new Interpreter(
          [
            new PostUnaryExpression(
              new Token(TokenType.IDENTIFIER, 'aa'),
              new LiteralExpression(new Token(TokenType.INTEGER, '1')),
            ),
          ],
          new CellDataMapImpl(),
          new DefinedNamesMapImpl(),
          allFormulas,
        ).interpret();
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
