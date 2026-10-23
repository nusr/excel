import { vi } from 'vitest';
import {
  exportExcel,
  EXPORT_EXTENSIONS,
  EXPORT_FORMATS,
  type ExportExtension,
} from '../exportExcel';
import { initController } from '../../../controller';

const { mockSaveAs } = vi.hoisted(() => ({ mockSaveAs: vi.fn() }));
vi.mock('../../../util', async (importOriginal) => {
  const actual = await importOriginal<typeof import('../../../util')>();
  return {
    ...actual,
    saveAs: (...args: unknown[]) => mockSaveAs(...args),
  };
});

function makeController() {
  const controller = initController();
  controller.addSheet();
  controller.setCell([['你好', 1]], [[{}, {}]], {
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

  test('csv export uses the display-formatted text path', async () => {
    await exportExcel('book', makeController(), 'csv');
    expect(mockSaveAs).toHaveBeenCalledTimes(1);
    const [blob, name] = mockSaveAs.mock.calls[0];
    expect(name).toBe('book.csv');
    expect((blob as Blob).type).toContain('text/csv');
    const data = new Uint8Array(await (blob as Blob).arrayBuffer());
    expect(Array.from(data.slice(0, 3))).toEqual([0xef, 0xbb, 0xbf]);
    expect(new TextDecoder().decode(data)).toContain('你好,1');
  });

  test('binary export writes the whole workbook', async () => {
    await exportExcel('book', makeController(), 'xlsx');
    const [blob, name] = mockSaveAs.mock.calls[0];
    expect(name).toBe('book.xlsx');
    expect((blob as Blob).type).toBe(EXPORT_FORMATS.xlsx.mime);
  });

  test('unknown extension is rejected without downloading a mislabeled file', async () => {
    await expect(
      exportExcel('book', makeController(), 'unknown' as ExportExtension),
    ).rejects.toThrow('Unsupported export format');
    expect(mockSaveAs).not.toHaveBeenCalled();
  });

  test('every supported extension triggers a download', async () => {
    for (const ext of EXPORT_EXTENSIONS) {
      mockSaveAs.mockReset();
      await exportExcel('book', makeController(), ext);
      expect(mockSaveAs).toHaveBeenCalledTimes(1);
      const [blob, name] = mockSaveAs.mock.calls[0];
      expect(name).toBe(`book.${ext}`);
      expect((blob as Blob).type).toBe(EXPORT_FORMATS[ext].mime.toLowerCase());
    }
  });
});
