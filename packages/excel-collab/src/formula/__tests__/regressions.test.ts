import { vi } from 'vitest';
import {
  CellDataMapImpl,
  computeFormulas,
  parseFormula,
  renameFormulaSheetReferences,
} from '../eval';
import { Scanner } from '../scanner';
import { Parser } from '../parser';
import { getFunction, parseReference, iterateRange, convertToReference } from '../../util';
import type { InterpreterResult, RequestFormulas, ResponseFormulas } from '../../types';

const sheets = [
  { sheetId: 'one', name: 'Sheet1', rowCount: 10, colCount: 5, sort: 1, isHide: false },
  { sheetId: 'two', name: "Bob's ! Sheet", rowCount: 10, colCount: 5, sort: 2, isHide: false },
];
function data() {
  const map = new CellDataMapImpl();
  map.setSheetList(sheets);
  map.set({ sheetId: 'one', row: 0, col: 0, rowCount: 2, colCount: 2 }, [
    [1, 2],
    [3, 4],
  ]);
  map.set({ sheetId: 'two', row: 0, col: 0, rowCount: 2, colCount: 2 }, [
    [10, 20],
    [30, 40],
  ]);
  return map;
}
function evaluate(source: string, map = data(), sheetId = 'one') {
  return parseFormula(source, { sheetId, row: 5, col: 4 }, map).result;
}

describe('sheet-reference renaming', () => {
  test('preserves formatting, absolute references, ranges and string literals', () => {
    const formula = '=SUM( Sheet1!$A$1:B2, sheet1!C$3, "Sheet1!A1", \'Other\'!A1 )';
    expect(renameFormulaSheetReferences(formula, 'SHEET1', "Bob's ! Sheet")).toBe(
      "=SUM( 'Bob''s ! Sheet'!$A$1:B2, 'Bob''s ! Sheet'!C$3, \"Sheet1!A1\", 'Other'!A1 )",
    );
  });
  test('decodes quoted names and preserves escaped quotes inside string literals', () => {
    const formula = '=CONCAT("say ""Bob\'s ! Sheet!A1""",\'Bob\'\'s ! Sheet\'!A1)';
    expect(renameFormulaSheetReferences(formula, "Bob's ! Sheet", 'NewSheet')).toBe(
      '=CONCAT("say ""Bob\'s ! Sheet!A1""",NewSheet!A1)',
    );
  });
  test('uses UTF-16 offsets correctly after emoji and inside Unicode sheet names', () => {
    const formula = "=\"😊\"&'表😊'!$A1&'表😊'!B$2";
    expect(renameFormulaSheetReferences(formula, '表😊', 'Sheet2')).toBe(
      '="😊"&Sheet2!$A1&Sheet2!B$2',
    );
    const scanner = new Scanner(formula);
    scanner.scan();
    expect(scanner.sheetReferences.map(({ start, end }) => formula.slice(start, end))).toEqual([
      "'表😊'",
      "'表😊'",
    ]);
  });
  test('does not rename partial names or text that INDIRECT may interpret later', () => {
    const formula = '=Sheet10!A1+INDIRECT("Sheet1!A1")+\'Sheet1\'!A1';
    expect(renameFormulaSheetReferences(formula, 'Sheet1', 'Sheet2')).toBe(
      '=Sheet10!A1+INDIRECT("Sheet1!A1")+Sheet2!A1',
    );
  });
  test('leaves unscannable formulas unchanged rather than partially rewriting them', () => {
    const formula = '=Sheet1!A1+"unterminated';
    expect(renameFormulaSheetReferences(formula, 'Sheet1', 'Sheet2')).toBe(formula);
  });
});

describe('Excel formula regressions', () => {
  test.each([
    ['=.5+.25', [0.75]],
    ['=123456789012345+1', [123456789012346]],
    ['=1%%', [0.0001]],
    ['="a""b"', ['a"b']],
    ['=SUM (1,2)', [3]],
    ['=NORM.DIST(0,0,1,TRUE)', [0.5]],
    ['=_xlfn.SUM(1,2)', [3]],
    ['=TRUE()', [true]],
    ['=DATE(2024,1,1)', [45292]],
    ['=YEAR(DATE(2024,1,1))', [2024]],
    ['=EOMONTH(DATE(2024,1,1),1)', [45351]],
    ['=1E+', ['#VALUE!']],
    ['=1E999', ['#NUM!']],
    ['=10^1000', ['#NUM!']],
    ['=(-1)^.5', ['#NUM!']],
    ['=1 2', ['#VALUE!']],
    ['="a" "b"', ['#VALUE!']],
    ['=', ['#VALUE!']],
    ['={}', ['#VALUE!']],
    ['=SUM({1,2;3,4})', [10]],
    ['={1,2;3,4}', [1, 2, 3, 4]],
    ['=SUM({1,2;3})', ['#VALUE!']],
    ['=D1+1', [1]],
    ['=D1&"x"', ['x']],
    ['=D1', [0]],
    ['="HELLO"="hello"', [true]],
    ['=1="1"', [false]],
    ['=1<"a"', [true]],
    ['="a"<TRUE', [true]],
    ['=TRUE&FALSE', ['TRUEFALSE']],
    ['=#DIV/0!', ['#DIV/0!']],
    ['=#N/A', ['#N/A']],
    ['=IF(TRUE,42,1/0)', [42]],
    ['=IF(FALSE,1/0,42)', [42]],
    ['=IF(TRUE,42,#REF!)', [42]],
    ['=IF(FALSE,42)', [false]],
    ['=IF(2,42,0)', [42]],
    ['=IF("invalid",1,2)', ['#VALUE!']],
    ['=IF(TRUE)', ['#VALUE!']],
    ['=IF(TRUE,,42)', [0]],
    ['=IFERROR(1/0,42)', [42]],
    ['=IFNA(#N/A,42)', [42]],
    ['=IFNA(1/0,42)', ['#DIV/0!']],
    ['=IFERROR("ok",1/0)', ['ok']],
    ['=IFERROR(CONCAT("#N/A"),42)', ['#N/A']],
    ['=CHOOSE(2,1/0,42)', [42]],
    ['=CHOOSE(0,1,2)', ['#VALUE!']],
    ['=IFERROR(SUM(1/0),42)', [42]],
    ['=unknownFunction()', ['#NAME?']],
    ['=SUMIF(A1:A2,">1",B1:B2)', [4]],
    ['=VLOOKUP(3,A1:B2,2,FALSE)', [4]],
    ['=SUM(A:B)', [10]],
    ['=SUM(1:2)', [10]],
    ['=SUM(Sheet1!1:2)', [10]],
    ["=SUM('Bob''s ! Sheet'!1:2)", [100]],
    ['=SUM(IFERROR(A1:A2,0))', [4]],
    ['=SUM(IFNA(A1:A2,0))', [4]],
    ['=ISERROR(1/0)', [true]],
    ['=ISERROR("#N/A")', [false]],
    ['=ISERR(#N/A)', [false]],
    ['=ISERR(1/0)', [true]],
    ['=ISNA(#N/A)', [true]],
    ['=ISNA(1/0)', [false]],
    ['=ISBLANK(D1)', [true]],
    ['=ISNUMBER(A1)', [true]],
    ['=ISNUMBER(#REF!)', [false]],
    ['=ISTEXT(A1)', [false]],
    ['=ISLOGICAL(IF(TRUE,TRUE,FALSE))', [true]],
    ['=ISNONTEXT(D1)', [true]],
    ['=ISERROR()', ['#VALUE!']],
    ['=ISERROR(1,2)', ['#VALUE!']],
    ['=AVERAGE(A1:A3)', [2]],
    ['=COUNT(A1:A3)', [2]],
    ['=ROUND(A1,2)', [1]],
    ['=SQRT(-1)', ['#NUM!']],
    ['=-2^2', [4]],
    ['=2^3^2', [64]],
    ['=SUM(IF(TRUE,A1:A2,B1:B2))', [4]],
    ['=INDEX(A1:B2,2,2)', [4]],
    ['=SUM(INDEX(A1:B2,0,2))', [6]],
    ['=INDEX({1,2;3,4},2,2)', [4]],
    ['=INDEX({1,2,3},2)', [2]],
    ['=INDEX({1;2;3},2)', [2]],
    ['=INDEX(A1:B2,3,1)', ['#REF!']],
    ['=INDEX(A1:B2,-1,1)', ['#REF!']],
    ['=INDEX(A1:B2,1,1,2)', ['#REF!']],
    ['=INDEX(A1:B2)', ['#VALUE!']],
    ['=SUM(A1:INDEX(A1:B2,2,2))', [10]],
    ['=SUM(A1:INDEX(A1:B2,0,2))', [10]],
    ['=SUM(INDEX(A1:B2,0,2):A1)', [10]],
    ['=SUM(INDEX(A1:B2,2,0):A1)', [10]],
    ['=OFFSET(A1,1,1)', [4]],
    ['=SUM(OFFSET(A1,0,0,2,2))', [10]],
    ['=OFFSET(A1,-1,0)', ['#REF!']],
    ['=OFFSET(A1,1,1,,)', [4]],
    ['=OFFSET(A1,1,1,0)', ['#REF!']],
    ['=OFFSET(A1,100,0)', ['#REF!']],
    ['=OFFSET(1,0,0)', ['#VALUE!']],
    ['=INDIRECT("B2")', [4]],
    ['=INDIRECT("R[-4]C[-3]",FALSE)', [4]],
    ['=INDIRECT("R2C2")', ['#REF!']],
    ['=INDIRECT("R2C2",FALSE)', [4]],
    ['=SUM(INDIRECT("A1:B2"))', [10]],
    ['=INDIRECT("1+1")', ['#REF!']],
    ['=INDIRECT("A1",FALSE)', ['#REF!']],
    ['=INDIRECT("A1:bad reference")', ['#REF!']],
    ["=SUM('Bob''s ! Sheet'!A1:B2)", [100]],
    ["='bob''s ! sheet'!A1", [10]],
    ["=SUM('Bob''s ! Sheet'!A1:Sheet1!B2)", ['#REF!']],
  ])('%s', (formula, expected) => {
    expect(evaluate(formula)).toEqual(expected);
  });

  test('cache keys include coordinates and data source, not just formula text', () => {
    const map = data();
    const cache = new Map<string, InterpreterResult>();
    expect(parseFormula('=RC[-1]', { sheetId: 'one', row: 0, col: 1 }, map, cache).result).toEqual([
      1,
    ]);
    expect(parseFormula('=RC[-1]', { sheetId: 'one', row: 1, col: 1 }, map, cache).result).toEqual([
      3,
    ]);
    expect(parseFormula('=A1', { sheetId: 'two', row: 5, col: 4 }, map, cache).result).toEqual([
      10,
    ]);
    expect(parseFormula('=A1', { sheetId: 'one', row: 5, col: 4 }, map, cache).result).toEqual([1]);
    const other = data();
    other.set({ sheetId: 'one', row: 0, col: 0, rowCount: 1, colCount: 1 }, [[99]]);
    expect(parseFormula('=A1', { sheetId: 'one', row: 5, col: 4 }, other, cache).result).toEqual([
      99,
    ]);
  });

  test('nested formulas resolve unqualified references in their own sheet', () => {
    const map = data();
    map.set({ sheetId: 'two', row: 0, col: 1, rowCount: 1, colCount: 1 }, [['=A1+1']]);
    expect(evaluate("='Bob''s ! Sheet'!B1", map)).toEqual([11]);
  });

  test('cycles report a reference error instead of fabricating zero', () => {
    const map = data();
    map.set({ sheetId: 'one', row: 0, col: 0, rowCount: 1, colCount: 2 }, [['=B1+1', '=A1+1']]);
    expect(evaluate('=A1', map)).toEqual(['#REF!']);
    expect(evaluate('=IFERROR(A1,42)', map)).toEqual([42]);
  });

  test('dependency errors propagate and cell handlers are restored after evaluation', () => {
    const map = data();
    const handle = map.handleCell;
    map.set({ sheetId: 'one', row: 0, col: 0, rowCount: 1, colCount: 1 }, [['=1/0']]);
    expect(evaluate('=A1+1', map)).toEqual(['#DIV/0!']);
    expect(evaluate('=SUM(A1:A2)', map)).toEqual(['#DIV/0!']);
    expect(evaluate('=IFERROR(A1,42)', map)).toEqual([42]);
    expect(map.handleCell).toBe(handle);
  });

  test('named ranges are case insensitive and sheet qualification never mutates the stored range', () => {
    const map = data();
    map.setDefinedName('MyRange', { sheetId: 'one', row: 0, col: 0, rowCount: 1, colCount: 1 });
    expect(evaluate('=myrange', map)).toEqual([1]);
    expect(evaluate("='Bob''s ! Sheet'!MYRANGE", map)).toEqual([10]);
    expect(map.getDefinedName('MyRange')?.sheetId).toBe('one');
    expect(evaluate('=INDIRECT("myrange",FALSE)', map)).toEqual([1]);
    expect(evaluate("=SUM('Bob''s ! Sheet'!A1:MyRange)", map)).toEqual(['#REF!']);
    map.setDefinedName('R1C1Name', { sheetId: 'one', row: 0, col: 0, rowCount: 1, colCount: 1 });
    expect(evaluate('=R1C1Name', map)).toEqual([1]);
  });

  test('retained defined names with deleted anchors evaluate as reference errors', () => {
    const map = data();
    map.setDefinedName('DeletedName', {
      sheetId: 'one',
      row: -1,
      col: -1,
      rowCount: 1,
      colCount: 1,
    });
    expect(evaluate('=DeletedName', map)).toEqual(['#REF!']);
    expect(evaluate('=SUM(DeletedName)', map)).toEqual(['#REF!']);
    expect(evaluate('=IFERROR(DeletedName,42)', map)).toEqual([42]);
  });

  test.each(['="a""b"', '=CONCAT("a","b")', "='Bob''s ! Sheet'!A1", '=SUM({1,2;3,4})'])(
    'normalized expressions can be parsed again: %s',
    (source) => {
      const result = parseFormula(source, { sheetId: 'one', row: 5, col: 4 }, data());
      expect(result.expressionStr).toBeDefined();
      expect(evaluate(result.expressionStr!)).toEqual(result.result);
    },
  );

  test('Excel error values are parsed as expressions for lazy error handling', () => {
    expect(() => new Parser(new Scanner('IFERROR(#REF!,1)').scan()).parse()).not.toThrow();
  });

  test('reference helpers reject malformed ranges and preserve multi-column/row spans', () => {
    expect(parseReference('A1:garbage')).toBeUndefined();
    expect(parseReference('A1:B2:C3')).toBeUndefined();
    expect(parseReference('Sheet1!A1:Sheet2!B2')).toBeUndefined();
    const cells: string[] = [];
    iterateRange(parseReference('A:B')!, 3, 4, (row, col) => {
      cells.push(`${row},${col}`);
      return false;
    });
    expect(cells).toEqual(['0,0', '0,1', '1,0', '1,1', '2,0', '2,1']);
    cells.length = 0;
    iterateRange(parseReference('1:2')!, 3, 2, (row, col) => {
      cells.push(`${row},${col}`);
      return false;
    });
    expect(cells).toEqual(['0,0', '0,1', '1,0', '1,1']);
    expect(getFunction('NORM.DIST')(0, 0, 1, true)).toBe(0.5);
    expect(parseReference('Other!A1:B2', (name) => name || 'Current')?.sheetId).toBe('Other');
  });

  test.each([
    [{ row: 0, col: 0, rowCount: 2, colCount: 1, sheetId: '' }, 'A1:A2'],
    [{ row: 0, col: 0, rowCount: 1, colCount: 2, sheetId: '' }, 'A1:B1'],
    [{ row: 0, col: 0, rowCount: 0, colCount: 2, sheetId: '' }, 'A:B'],
    [{ row: 0, col: 0, rowCount: 2, colCount: 0, sheetId: '' }, '1:2'],
    [{ row: 0, col: 0, rowCount: 1, colCount: 1, sheetId: "Bob's ! Sheet" }, "'Bob''s ! Sheet'!A1"],
  ])('reference serialization round trips %s', (range, text) => {
    expect(convertToReference(range, 'relative', (name) => name)).toBe(text);
    expect(parseReference(text)?.toIRange()).toEqual(range);
  });

  test('IFERROR never hides programming/storage failures', () => {
    const map = data();
    const handle = map.handleCell;
    map.getCell = () => {
      throw new Error('storage unavailable');
    };
    expect(() => evaluate('=IFERROR(A1,42)', map)).toThrow('storage unavailable');
    expect(() => evaluate('=ISERROR(A1)', map)).toThrow('storage unavailable');
    expect(map.handleCell).toBe(handle);
  });

  test('worker computation evaluates all sheets using each formula cell context', () => {
    const request: RequestFormulas = {
      currentSheetId: 'one',
      workbook: sheets,
      definedNames: {},
      worksheets: {
        one_0_0: { value: 1 },
        one_1_0: { value: 3 },
        one_0_1: { value: '', formula: '=RC[-1]' },
        one_1_1: { value: '', formula: '=RC[-1]' },
        two_0_0: { value: 10 },
        two_0_1: { value: '', formula: '=A1+1' },
      },
    };
    const callback = vi.fn(() => true);
    expect(computeFormulas(request, callback)).toBe(true);
    expect(callback).toHaveBeenCalledWith({
      list: [
        { key: 'one_0_1', sheetId: 'one', newValue: 1 },
        { key: 'one_1_1', sheetId: 'one', newValue: 3 },
        { key: 'two_0_1', sheetId: 'two', newValue: 11 },
      ],
    });
  });

  test('worker computation preserves sheet IDs containing underscores', () => {
    const callback = vi.fn(() => true);
    computeFormulas(
      {
        currentSheetId: 'sheet_one',
        workbook: [{ ...sheets[0], sheetId: 'sheet_one' }],
        definedNames: {},
        worksheets: {
          sheet_one_0_0: { value: 7 },
          sheet_one_0_1: { value: '', formula: '=A1+1' },
        },
      },
      callback,
    );
    expect(callback).toHaveBeenCalledWith({
      list: [{ key: 'sheet_one_0_1', sheetId: 'sheet_one', newValue: 8 }],
    });
  });

  test('worker computation handles a 1000-cell dependency chain', () => {
    const worksheets: RequestFormulas['worksheets'] = {};
    for (let row = 1000; row > 0; row--) {
      worksheets[`one_${row}_0`] = { value: '', formula: `=A${row}+1` };
    }
    worksheets.one_0_0 = { value: 0 };
    const callback = vi.fn((_result: ResponseFormulas) => true);

    expect(() =>
      computeFormulas(
        {
          currentSheetId: 'one',
          workbook: [{ ...sheets[0], rowCount: 1001 }],
          definedNames: {},
          worksheets,
        },
        callback,
      ),
    ).not.toThrow();
    expect(callback.mock.calls[0]?.[0]?.list).toContainEqual({
      key: 'one_1000_0',
      sheetId: 'one',
      newValue: 1000,
    });
  });

  test('worker computation returns an error instead of overflowing on extreme dependency chains', () => {
    const worksheets: RequestFormulas['worksheets'] = {};
    for (let row = 10000; row > 0; row--) {
      worksheets[`one_${row}_0`] = { value: '', formula: `=A${row}+1` };
    }
    worksheets.one_0_0 = { value: 0 };
    const callback = vi.fn((_result: ResponseFormulas) => true);

    expect(() =>
      computeFormulas(
        {
          currentSheetId: 'one',
          workbook: [{ ...sheets[0], rowCount: 10001 }],
          definedNames: {},
          worksheets,
        },
        callback,
      ),
    ).not.toThrow();
    expect(callback.mock.calls[0]?.[0]?.list).toContainEqual({
      key: 'one_10000_0',
      sheetId: 'one',
      newValue: '#NUM!',
    });
  });
});
