import {
  bindFormulaReferences,
  renderFormulaReferences,
  type BindFormulaOptions,
  type BoundFormula,
} from '../bindings';
import type { IRange } from '../../types';

const sheets = new Map([
  ['sheet1', 'one'],
  ["bob's ! sheet", 'two'],
  ['表😊', 'three'],
]);
const origin = { row: 5, col: 4 };

function bind(source: string, overrides: Partial<BindFormulaOptions<IRange>> = {}) {
  return bindFormulaReferences(source, {
    sheetId: 'one',
    ...origin,
    resolveSheet: (name) => sheets.get(name.toLowerCase()),
    isDefinedName: (name) => ['foo', 'myrange', 'a1name'].includes(name.toLowerCase()),
    bindRange: (range) => ({ ...range }),
    ...overrides,
  });
}

function render(
  binding: BoundFormula<IRange>,
  resolveRange: (range: IRange) => IRange | undefined = (range) => range,
  options: {
    row?: number;
    col?: number;
    getSheetName?: (sheetId: string) => string | undefined;
  } = {},
) {
  return renderFormulaReferences(binding, { ...origin, resolveRange, ...options });
}

describe('stable formula-reference bindings', () => {
  test('captures references once, excluding numeric literals and function names', () => {
    const binding = bind('=SUM(A1:B2, C$3, $D4, $E$5, 100, .5, 1E3, LOG10(100))');
    expect(binding.references.map(({ range }) => range)).toEqual([
      { sheetId: 'one', row: 0, col: 0, rowCount: 2, colCount: 2 },
      { sheetId: 'one', row: 2, col: 2, rowCount: 1, colCount: 1 },
      { sheetId: 'one', row: 3, col: 3, rowCount: 1, colCount: 1 },
      { sheetId: 'one', row: 4, col: 4, rowCount: 1, colCount: 1 },
    ]);
    expect(render(binding)).toBe(binding.source);
  });

  test('retains absolute/mixed flags and untouched source formatting', () => {
    const binding = bind('=SUM( A1 : B2, C$3, $D4, $E$5 ) + "A1:B2"');
    expect(render(binding, (range) => ({ ...range, row: range.row + 1, col: range.col + 1 }))).toBe(
      '=SUM( B2 : C3, D$4, $E5, $F$6 ) + "A1:B2"',
    );
  });

  test('retains reversed and mixed-orientation range endpoints', () => {
    const binding = bind('=SUM($B$5:A2, A5:$B$2)');
    expect(render(binding, (range) => ({ ...range, rowCount: range.rowCount - 1 }))).toBe(
      '=SUM($B$4:A2, A4:$B$2)',
    );
  });

  test('shrinks ranges and replaces deleted direct references as complete spans', () => {
    const binding = bind("=SUM('Bob''s ! Sheet'!$A$1:$B$5)+Sheet1!C1");
    expect(
      render(binding, (range) => (range.col === 2 ? undefined : { ...range, rowCount: 3 })),
    ).toBe("=SUM('Bob''s ! Sheet'!$A$1:$B$3)+#REF!");
    expect(render(binding, () => undefined)).toBe('=SUM(#REF!)+#REF!');
  });

  test('binds whole rows and columns without bounding the other axis', () => {
    const binding = bind('=SUM($A:$C, $2:4)');
    expect(binding.references.map(({ range }) => range)).toEqual([
      { sheetId: 'one', row: 0, col: 0, rowCount: 0, colCount: 3 },
      { sheetId: 'one', row: 1, col: 0, rowCount: 3, colCount: 0 },
    ]);
    expect(
      render(binding, (range) =>
        range.rowCount === 0 ? { ...range, colCount: 2 } : { ...range, row: 2, rowCount: 2 },
      ),
    ).toBe('=SUM($A:$B, $3:4)');
  });

  test('resolves case-insensitive escaped sheet names and inherited range sheets', () => {
    const binding = bind("='bOb''s ! sHeEt'!A1:B2+Sheet1!C1");
    expect(binding.references.map(({ range }) => range.sheetId)).toEqual(['two', 'one']);
    expect(
      render(binding, (range) => range, {
        getSheetName: (sheetId) => (sheetId === 'two' ? "New's Sheet" : 'Sheet1'),
      }),
    ).toBe("='New''s Sheet'!A1:B2+Sheet1!C1");
  });

  test('preserves both explicit qualifiers of a same-sheet range', () => {
    const binding = bind('=SUM(Sheet1!A1 : sheet1!B3)');
    expect(binding.references).toHaveLength(1);
    expect(
      render(binding, (range) => ({ ...range, rowCount: 2 }), {
        getSheetName: () => 'Renamed',
      }),
    ).toBe('=SUM(Renamed!A1 : Renamed!B2)');
  });

  test('binds R1C1 relative/absolute components against the formula origin', () => {
    const binding = bind('=R[-2]C[1]+R2C3+RC+R2C[-1]');
    expect(binding.references.map(({ range }) => [range.row, range.col])).toEqual([
      [3, 5],
      [1, 2],
      [5, 4],
      [1, 3],
    ]);
    expect(
      render(binding, (range) => ({ ...range, row: range.row + 1, col: range.col + 2 }), {
        row: origin.row + 1,
        col: origin.col + 2,
      }),
    ).toBe('=R[-2]C[1]+R3C5+RC+R3C[-1]');
  });

  test('recomputes R1C1 offsets if only the formula origin moves', () => {
    const binding = bind('=RC+R[-2]C[1]+R2C3');
    expect(render(binding, (range) => range, { row: 6, col: 6 })).toBe(
      '=R[-1]C[-2]+R[-3]C[-1]+R2C3',
    );
  });

  test('shrinks R1C1 ranges without losing relative style', () => {
    const binding = bind('=SUM(R[-2]C:R[2]C)');
    expect(render(binding, (range) => ({ ...range, rowCount: 4 }))).toBe('=SUM(R[-2]C:R[1]C)');
  });

  test('leaves named references textual, including ambiguous column-like names', () => {
    const binding = bind('=SUM(FOO, MyRange, Sheet1!foo, A1Name)+A1');
    expect(binding.references).toHaveLength(1);
    expect(
      render(binding, (range) => ({ ...range, row: 1 }), {
        getSheetName: () => 'Renamed',
      }),
    ).toBe('=SUM(FOO, MyRange, Renamed!foo, A1Name)+A2');
  });

  test('does not rewrite strings, INDIRECT text, errors, or structured-reference text', () => {
    const source = '=INDIRECT("Sheet1!A1")+IFERROR(#N/A,Table1[A1])+A1+"say ""B2"""';
    const binding = bind(source);
    expect(binding.references).toHaveLength(1);
    expect(render(binding, (range) => ({ ...range, row: 1 }))).toBe(
      '=INDIRECT("Sheet1!A1")+IFERROR(#N/A,Table1[A1])+A2+"say ""B2"""',
    );
  });

  test('captures supported spans around unsupported syntax, without reading external books', () => {
    const binding = bind('=@A1+[Book]Sheet1!B2+Unknown!C3+SUM(A2:A4)');
    expect(binding.references.map(({ range }) => [range.row, range.col, range.rowCount])).toEqual([
      [0, 0, 1],
      [1, 0, 3],
    ]);
    expect(render(binding, (range) => ({ ...range, row: range.row + 1 }))).toBe(
      '=@A2+[Book]Sheet1!B2+Unknown!C3+SUM(A3:A5)',
    );
  });

  test('UTF-16 spans preserve emoji before and inside quoted qualifiers', () => {
    const binding = bind("=\"😊\"&'表😊'!A1+'表😊'!B2");
    expect(
      render(binding, (range) => ({ ...range, row: range.row + 1 }), {
        getSheetName: () => 'New',
      }),
    ).toBe('="😊"&New!A2+New!B3');
  });

  test('bindings survive JSON round trips and invalid projected targets become errors', () => {
    const binding: BoundFormula<IRange> = JSON.parse(JSON.stringify(bind('=A1+B2')));
    expect(render(binding, (range) => ({ ...range, row: -1 }))).toBe('=#REF!+#REF!');
    expect(render(binding, (range) => range)).toBe('=A1+B2');
  });
});
