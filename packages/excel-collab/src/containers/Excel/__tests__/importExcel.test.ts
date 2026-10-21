import { importExcel } from '../importExcel';
import { loadExcelize, checkExcelize } from '../excelize';
import { getWorksheetKey } from '../../../util';

async function makeXlsxBytes(): Promise<Uint8Array> {
  const api = await loadExcelize();
  const file = checkExcelize(api.NewFile());
  checkExcelize(file.SetCellValue('Sheet1', 'A1', 'hello'));
  checkExcelize(file.SetCellValue('Sheet1', 'B1', 1));
  const { buffer } = checkExcelize(file.WriteToBuffer());
  if (!ArrayBuffer.isView(buffer)) throw new Error('Expected a binary buffer');
  return Uint8Array.from(new Uint8Array(buffer.buffer, buffer.byteOffset, buffer.byteLength));
}

describe('importExcel', () => {
  test('imports a Uint8Array', async () => {
    const model = await importExcel(await makeXlsxBytes());
    expect(model.worksheets[getWorksheetKey('1', 0, 0)].value).toBe('hello');
  });

  test('imports an ArrayBuffer', async () => {
    const data = await makeXlsxBytes();
    const model = await importExcel(data.slice().buffer);
    expect(model.worksheets[getWorksheetKey('1', 0, 1)].value).toBe(1);
  });

  test('imports a File', async () => {
    const data = await makeXlsxBytes();
    const model = await importExcel(new File([data.slice().buffer], 'book.xlsx'));
    expect(model.worksheets[getWorksheetKey('1', 0, 0)].value).toBe('hello');
  });

  test('imports a Blob-like object via arrayBuffer()', async () => {
    const buffer = (await makeXlsxBytes()).slice().buffer;
    const model = await importExcel({ arrayBuffer: async () => buffer } as Blob);
    expect(model.worksheets[getWorksheetKey('1', 0, 0)].value).toBe('hello');
  });

  test.each(['people.csv', 'people.CSV'])('imports CSV %s', async (name) => {
    const model = await importExcel(new File(['name,age\r\nAlice,30'], name));
    expect(model.worksheets[getWorksheetKey('1', 0, 0)].value).toBe('name');
    expect(model.worksheets[getWorksheetKey('1', 1, 1)].value).toBe(30);
  });

  test('preserves quoted delimiters, escaped quotes, newlines and empty fields', async () => {
    const model = await importExcel(new File(['\uFEFF"a,b","a""b","line\nbreak",,TRUE\r\n,,1.5'], 'data.csv'));
    expect(model.worksheets[getWorksheetKey('1', 0, 0)].value).toBe('a,b');
    expect(model.worksheets[getWorksheetKey('1', 0, 1)].value).toBe('a"b');
    expect(model.worksheets[getWorksheetKey('1', 0, 2)].value).toBe('line\nbreak');
    expect(model.worksheets[getWorksheetKey('1', 0, 3)]).toBeUndefined();
    expect(model.worksheets[getWorksheetKey('1', 0, 4)].value).toBe(true);
    expect(model.worksheets[getWorksheetKey('1', 1, 2)].value).toBe(1.5);
  });

  test('rejects malformed CSV and unsupported formats', async () => {
    await expect(importExcel(new File(['"unclosed'], 'data.csv'))).rejects.toThrow('Unclosed');
    await expect(importExcel(new File(['old'], 'data.xls'))).rejects.toThrow('Unsupported');
  });

  test('rejects invalid workbook bytes', async () => {
    await expect(importExcel(new Uint8Array([1, 2, 3]))).rejects.toThrow();
  });
});
