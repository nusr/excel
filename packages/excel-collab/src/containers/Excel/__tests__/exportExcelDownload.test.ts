import {
  exportExcel,
  EXPORT_EXTENSIONS,
  EXPORT_FORMATS,
  type ExportExtension,
} from '../exportExcel';
import { initController } from '../../../controller';

const mockSaveAs = jest.fn();
jest.mock('../../../util', () => {
  const actual =
    jest.requireActual<typeof import('../../../util')>('../../../util');
  return {
    __esModule: true,
    ...actual,
    saveAs: (...args: unknown[]) => mockSaveAs(...args),
  };
});

function makeController() {
  const controller = initController();
  controller.addSheet();
  controller.setCell([['hi', 1]], [[{}, {}]], {
    row: 0,
    col: 0,
    rowCount: 1,
    colCount: 1,
    sheetId: controller.getCurrentSheetId(),
  });
  return controller;
}

describe('exportExcel.download.test.ts', () => {
  beforeEach(() => {
    mockSaveAs.mockReset();
  });

  test('csv export uses the display-formatted text path', () => {
    exportExcel('book', makeController(), 'csv');
    expect(mockSaveAs).toHaveBeenCalledTimes(1);
    const [blob, name] = mockSaveAs.mock.calls[0];
    expect(name).toBe('book.csv');
    expect((blob as Blob).type).toContain('text/csv');
  });

  test('binary export writes the whole workbook', () => {
    exportExcel('book', makeController(), 'xlsx');
    const [blob, name] = mockSaveAs.mock.calls[0];
    expect(name).toBe('book.xlsx');
    expect((blob as Blob).type).toBe(EXPORT_FORMATS.xlsx.mime);
  });

  test('unknown extension falls back to xlsx format', () => {
    exportExcel('book', makeController(), 'unknown' as ExportExtension);
    const [blob, name] = mockSaveAs.mock.calls[0];
    // extension in the filename is preserved, format defaults to xlsx
    expect(name).toBe('book.unknown');
    expect((blob as Blob).type).toBe(EXPORT_FORMATS.xlsx.mime);
  });

  test('every supported extension triggers a download', () => {
    for (const ext of EXPORT_EXTENSIONS) {
      mockSaveAs.mockReset();
      exportExcel('book', makeController(), ext);
      expect(mockSaveAs).toHaveBeenCalledTimes(1);
      expect(mockSaveAs.mock.calls[0][1]).toBe(`book.${ext}`);
    }
  });
});
