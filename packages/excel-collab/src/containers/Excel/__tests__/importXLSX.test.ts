import { importExcel } from '../importExcel';
import fs from 'fs/promises';
import path from 'path';

describe('importXLSX.test.ts', () => {
  test('imports cells, formulas, number formats and merges from a real xlsx', async () => {
    const filePath = path.join(
      __dirname,
      '../../../../../../scripts/origin.xlsx',
    );
    const fileData = await fs.readFile(filePath);
    const model = await importExcel(fileData);

    const names = Object.values(model.workbook)
      .map((v) => v.name)
      .sort();
    expect(names).toEqual(['Sheet1', 'Sheet2', 'Sheet3', 'Sheet4', 'Sheet5']);

    const cells = Object.values(model.worksheets);
    expect(cells.some((c) => c.formula === '=SUM(A1,B1)')).toBe(true);
    expect(cells.some((c) => c.numberFormat === '0.00%')).toBe(true);

    const mergeKeys = Object.keys(model.mergeCells);
    expect(mergeKeys.some((k) => k.startsWith('Sheet5!'))).toBe(true);
    expect(
      Object.values(model.mergeCells).some(
        (m) =>
          m.row === 1 && m.col === 1 && m.rowCount === 2 && m.colCount === 2,
      ),
    ).toBe(true);
  });
});
