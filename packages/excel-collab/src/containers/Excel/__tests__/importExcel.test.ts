import * as XLSX from 'xlsx';
import { importExcel } from '../importExcel';
import { getWorksheetKey } from '../../../util';

function makeXlsxArrayBuffer(): ArrayBuffer {
  const worksheet = XLSX.utils.aoa_to_sheet([['hello', 1]]);
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, 'Sheet1');
  // this xlsx build returns an ArrayBuffer for type: 'array'
  return XLSX.write(workbook, {
    bookType: 'xlsx',
    type: 'array',
  }) as unknown as ArrayBuffer;
}

function makeXlsxBytes(): Uint8Array {
  return new Uint8Array(makeXlsxArrayBuffer());
}

describe('importExcel.test.ts', () => {
  test('imports from a Uint8Array (ArrayLike branch)', async () => {
    const model = await importExcel(makeXlsxBytes());
    expect(model.worksheets[getWorksheetKey('1', 0, 0)].value).toBe('hello');
  });

  test('imports from a raw ArrayBuffer', async () => {
    const model = await importExcel(makeXlsxArrayBuffer());
    expect(model.worksheets[getWorksheetKey('1', 0, 0)].value).toBe('hello');
  });

  test('imports from a Blob-like object via arrayBuffer()', async () => {
    const buffer = makeXlsxArrayBuffer();
    const blobLike = {
      arrayBuffer: async () => buffer,
    } as unknown as Blob;
    const model = await importExcel(blobLike);
    expect(model.worksheets[getWorksheetKey('1', 0, 0)].value).toBe('hello');
  });

  test('imports a CSV file as text with the field separator', async () => {
    const file = new File(['name,age\nAlice,30'], 'people.csv', {
      type: 'text/csv',
    });
    const model = await importExcel(file);
    expect(model.worksheets[getWorksheetKey('1', 0, 0)].value).toBe('name');
    expect(model.worksheets[getWorksheetKey('1', 1, 1)].value).toBe(30);
  });

  test('detects csv by extension even without a csv mime type', async () => {
    const file = new File(['a,b\n1,2'], 'data.CSV', {
      type: 'application/octet-stream',
    });
    const model = await importExcel(file);
    expect(model.worksheets[getWorksheetKey('1', 0, 0)].value).toBe('a');
  });
});
