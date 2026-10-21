import { vi } from 'vitest';
import { act, renderHook, waitFor } from '@testing-library/react';
import type { ReactNode } from 'react';
import { applyUpdate, encodeStateAsUpdate } from 'yjs';
import { Awareness } from 'y-protocols/awareness';
import { initController } from '../controller';
import { StateContext, useCollaboration } from '../containers';
import type { IController, ResponseFormulas } from '../types';
import { getWorksheetKey, modelToChangeSet } from '../util';
import './global.mock';

const controllers: IController[] = [];
function controller(muteFormulas = true) {
  const value = initController();
  controllers.push(value);
  if (muteFormulas) vi.spyOn(value.model, 'computeFormulas').mockResolvedValue(false);
  return value;
}
function exchange(a: IController, b: IController) {
  const left = encodeStateAsUpdate(a.getHooks().doc);
  const right = encodeStateAsUpdate(b.getHooks().doc);
  applyUpdate(a.getHooks().doc, right);
  applyUpdate(b.getHooks().doc, left);
}
function pair() {
  const a = controller();
  const b = controller();
  a.addFirstSheet();
  exchange(a, b);
  const sheetId = a.getCurrentSheetId();
  return { a, b, sheetId };
}
function cell(sheetId: string, row = 0, col = 0) {
  return { sheetId, row, col, rowCount: 1, colCount: 1 };
}
afterEach(() => {
  for (const value of controllers.splice(0)) {
    value.destroy();
    value.getHooks().doc.destroy();
  }
  vi.restoreAllMocks();
});

test('concurrent first edits to different cells are both preserved', () => {
  const { a, b, sheetId } = pair();
  a.setCellValue('left', cell(sheetId));
  b.setCellValue('right', cell(sheetId, 0, 1));
  exchange(a, b);
  expect(a.getCell(cell(sheetId))?.value).toBe('left');
  expect(a.getCell(cell(sheetId, 0, 1))?.value).toBe('right');
  expect(a.toJSON().worksheets).toEqual(b.toJSON().worksheets);
});

test('concurrent sheet creation preserves both sheets with unique IDs', () => {
  const { a, b } = pair();
  const left = a.addSheet()!;
  const right = b.addSheet()!;
  expect(left.sheetId).not.toBe(right.sheetId);
  exchange(a, b);
  expect(a.getSheetList()).toHaveLength(3);
  expect(a.getSheetList()).toEqual(b.getSheetList());
  expect(new Set(a.getSheetList().map((sheet) => sheet.name.toLowerCase())).size).toBe(3);
  expect(Object.values(a.toJSON().workbook)).toEqual(a.getSheetList());
  for (const sheet of a.getSheetList()) expect(a.getSheetInfo(sheet.sheetId)).toEqual(sheet);
});

test.each(['rows', 'cols'] as const)('concurrent %s insertion preserves a remote edit on the moved cell', (axis) => {
  const { a, b, sheetId } = pair();
  const before = cell(sheetId, axis === 'rows' ? 1 : 0, axis === 'cols' ? 1 : 0);
  const after = cell(sheetId, axis === 'rows' ? 2 : 0, axis === 'cols' ? 2 : 0);
  a.setCellValue('before', before);
  exchange(a, b);
  if (axis === 'rows') a.addRow(0, 1, true);
  else a.addCol(0, 1);
  b.setCellValue('remote edit', before);
  exchange(a, b);
  expect(a.getCell(after)?.value).toBe('remote edit');
  expect(b.getCell(after)?.value).toBe('remote edit');
  expect(a.toJSON().worksheets[getWorksheetKey(sheetId, after.row, after.col)].value).toBe('remote edit');
});

test('concurrent row inserts add both rows and keep each newly inserted cell', () => {
  const { a, b, sheetId } = pair();
  const count = a.getSheetInfo()!.rowCount;
  a.addRow(0, 1, true);
  a.setCellValue('left', cell(sheetId));
  b.addRow(0, 1, true);
  b.setCellValue('right', cell(sheetId));
  exchange(a, b);
  expect(a.getSheetInfo()!.rowCount).toBe(count + 2);
  expect(new Set([a.getCell(cell(sheetId))?.value, a.getCell(cell(sheetId, 1))?.value]))
    .toEqual(new Set(['left', 'right']));
  expect(a.toJSON()).toEqual(b.toJSON());
});

test('structural edits validate coordinates and leave at least one row and column', () => {
  const { a } = pair();
  expect(() => a.deleteRow(-1, 1)).toThrow(RangeError);
  expect(() => a.addCol(0, 0.5)).toThrow(RangeError);
  a.deleteRow(0, 1000);
  a.deleteCol(0, 1000);
  expect(a.getSheetInfo()).toMatchObject({ rowCount: 1, colCount: 1 });
});

test('undoing a row deletion restores the concurrent remote edit', () => {
  const { a, b, sheetId } = pair();
  a.setCellValue('before', cell(sheetId, 1));
  exchange(a, b);
  a.clearHistory();
  a.deleteRow(1, 1);
  b.setCellValue('remote edit', cell(sheetId, 1));
  exchange(a, b);
  a.undo();
  exchange(a, b);
  expect(a.getCell(cell(sheetId, 1))?.value).toBe('remote edit');
});

test('custom sizes follow stable row and column identities across insertion', () => {
  const { a, b, sheetId } = pair();
  a.setRowHeight(1, 60);
  a.setColWidth(1, 120);
  exchange(a, b);
  a.addRow(0, 1, true);
  a.addCol(0, 1);
  exchange(a, b);
  expect(b.getRow(2).len).toBe(60);
  expect(b.getCol(2).len).toBe(120);
  expect(b.toJSON().customHeight[`${sheetId}_2`].len).toBe(60);
  expect(b.toJSON().customWidth[`${sheetId}_2`].len).toBe(120);
});

test('coordinate JSON round trips after structural edits, including out-of-grid custom sizes', () => {
  const { a, sheetId } = pair();
  a.setCellValue('moved', cell(sheetId, 1, 1));
  a.setColWidth(40, 123);
  a.addRow(0, 1, true);
  a.addCol(0, 1);
  a.setRowHeight(2, 60);
  const json = a.toJSON();
  const restored = controller();
  restored.fromJSON(json);
  expect(restored.toJSON()).toEqual(json);
  expect(restored.getCol(40).len).toBe(123);
  expect(restored.getRow(2).len).toBe(60);
  expect(restored.getCell(cell(sheetId, 2, 2))?.value).toBe('moved');
});

test('remote JSON replacement produces complete rendering changes without Awareness', () => {
  const { a, b, sheetId } = pair();
  a.setCellValue('before', cell(sheetId));
  exchange(a, b);
  const render = vi.fn();
  b.on('renderChange', render);
  let changes = new Set<string>();
  b.getHooks().doc.on('afterTransaction', (transaction) => {
    if (!transaction.local) changes = modelToChangeSet(transaction);
  });
  const json = a.toJSON();
  json.worksheets[getWorksheetKey(sheetId, 0, 0)].value = 'after';
  a.fromJSON(json);
  exchange(a, b);
  expect(b.getCell(cell(sheetId))?.value).toBe('after');
  expect(changes.has('workbook')).toBe(true);
  expect(changes.has('worksheets')).toBe(true);
  expect(render).toHaveBeenCalled();
});

test('joining a collaborative Doc waits for sync and never reapplies an HTTP snapshot', async () => {
  const { a, b, sheetId } = pair();
  a.setCellValue('saved', cell(sheetId));
  const snapshot = a.toJSON();
  a.setCellValue('live', cell(sheetId));
  exchange(a, b);
  let synced!: () => void;
  const whenSynced = new Promise<void>((resolve) => { synced = resolve; });
  const getDocument = vi.fn(async () => ({
    id: b.getHooks().doc.guid, name: 'test', content: JSON.stringify(snapshot), create_time: '',
  }));
  const wrapper = ({ children }: { children: ReactNode }) => (
    <StateContext.Provider value={{ controller: b, collaborative: true, whenSynced, provider: { getDocument } }}>
      {children}
    </StateContext.Provider>
  );
  const hook = renderHook(() => useCollaboration(), { wrapper });
  expect(hook.result.current.isLoading).toBe(true);
  expect(getDocument).not.toHaveBeenCalled();
  await act(async () => { synced(); });
  await waitFor(() => expect(hook.result.current.isLoading).toBe(false));
  exchange(a, b);
  expect(a.getCell(cell(sheetId))?.value).toBe('live');
});

test('Awareness and range listeners are removed when the collaboration hook unmounts', async () => {
  const { a } = pair();
  const awareness = new Awareness(a.getHooks().doc);
  const off = vi.spyOn(awareness, 'off');
  const wrapper = ({ children }: { children: ReactNode }) => (
    <StateContext.Provider value={{ controller: a, awareness }}>{children}</StateContext.Provider>
  );
  const hook = renderHook(() => useCollaboration(), { wrapper });
  await waitFor(() => expect(hook.result.current.isLoading).toBe(false));
  expect(a.getEventLength('rangeChange')).toBe(1);
  hook.unmount();
  expect(a.getEventLength('rangeChange')).toBe(0);
  expect(off).toHaveBeenCalledWith('update', expect.any(Function));
  expect(awareness.getLocalState()?.range).toBeNull();
});

test('destroying a controller removes its remote rendering listener without destroying the external Doc', () => {
  const { a, b, sheetId } = pair();
  const render = vi.fn();
  a.on('renderChange', render);
  a.destroy();
  b.setCellValue('remote', cell(sheetId));
  exchange(a, b);
  expect(render).not.toHaveBeenCalled();
  expect(a.getHooks().doc.isDestroyed).toBe(false);
});

test('a stale formula result cannot overwrite a newer remote plain value', () => {
  const a = controller(false);
  const b = controller();
  let callback: ((result: ResponseFormulas) => boolean) | undefined;
  vi.spyOn(a.getHooks().worker, 'computeFormulas').mockImplementation(async (_data, cb) => {
    callback = cb;
    return false;
  });
  a.addFirstSheet();
  const sheetId = a.getCurrentSheetId();
  a.setCellValue('=1+1', cell(sheetId));
  const stale = callback!;
  exchange(a, b);
  b.setCellValue(123, cell(sheetId));
  exchange(a, b);
  expect(stale({ list: [{ key: getWorksheetKey(sheetId, 0, 0), sheetId, newValue: 2 }] })).toBe(false);
  expect(a.getCell(cell(sheetId))?.value).toBe(123);
});

test('current formula callbacks apply multiple batches without adding undo history', () => {
  const a = controller(false);
  const callbacks: Array<(result: ResponseFormulas) => boolean> = [];
  vi.spyOn(a.getHooks().worker, 'computeFormulas').mockImplementation(async (_data, cb) => {
    callbacks.push(cb);
    return false;
  });
  a.addFirstSheet();
  const sheetId = a.getCurrentSheetId();
  a.setCellValue('=1', cell(sheetId));
  a.setCellValue('=2', cell(sheetId, 0, 1));
  a.clearHistory();
  const callback = callbacks.at(-1)!;
  expect(callback({ list: [{ key: getWorksheetKey(sheetId, 0, 0), sheetId, newValue: 1 }] })).toBe(true);
  expect(callback({ list: [{ key: getWorksheetKey(sheetId, 0, 1), sheetId, newValue: 2 }] })).toBe(true);
  expect(a.getCell(cell(sheetId))?.value).toBe(1);
  expect(a.getCell(cell(sheetId, 0, 1))?.value).toBe(2);
  expect(a.canUndo()).toBe(false);
});

test('formula callbacks are rejected after dependent input changes or controller disposal', () => {
  const a = controller(false);
  const callbacks: Array<(result: ResponseFormulas) => boolean> = [];
  vi.spyOn(a.getHooks().worker, 'computeFormulas').mockImplementation(async (_data, cb) => {
    callbacks.push(cb);
    return false;
  });
  a.addFirstSheet();
  const sheetId = a.getCurrentSheetId();
  a.setCellValue(1, cell(sheetId));
  a.setCellValue('=A1+1', cell(sheetId, 0, 1));
  const stale = callbacks.at(-1)!;
  a.setCellValue(10, cell(sheetId));
  const result = { list: [{ key: getWorksheetKey(sheetId, 0, 1), sheetId, newValue: 2 }] };
  expect(stale(result)).toBe(false);
  const current = callbacks.at(-1)!;
  a.destroy();
  expect(current(result)).toBe(false);
});

test('formula worker failures are logged and reported to the editor', async () => {
  const a = controller();
  a.addFirstSheet();
  const cause = new Error('worker unavailable');
  vi.mocked(a.model.computeFormulas).mockRejectedValueOnce(cause);
  const log = vi.spyOn(console, 'error').mockImplementation(() => {});
  const toast = vi.fn();
  a.on('toastMessage', toast);
  a.setCellValue('=1', cell(a.getCurrentSheetId()));
  await waitFor(() => expect(toast).toHaveBeenCalledWith({
    type: 'error', message: expect.stringContaining('worker unavailable'),
  }));
  expect(log).toHaveBeenCalledWith('Formula computation failed', cause);
});
