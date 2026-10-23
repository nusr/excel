import { Buffer } from 'node:buffer';
import { applyUpdate, Doc, encodeStateAsUpdate, Map as YMap, Array as YArray } from 'yjs';
import { Model } from '../Model';
import { getMockHooks } from './util';
import { initController } from '../../controller';
import { hydrateDocument, SharedRoot, upgradeDocument } from '../../protocol';
import type { IRange } from '../../types';

function setup() {
  const hooks = getMockHooks();
  const model = new Model(hooks);
  model.addSheet();
  const range: IRange = {
    row: 2,
    col: 2,
    rowCount: 1,
    colCount: 1,
    sheetId: model.getCurrentSheetId(),
  };
  return { model, doc: hooks.doc, range };
}
function peer(source: Doc) {
  const hooks = getMockHooks();
  applyUpdate(hooks.doc, encodeStateAsUpdate(source));
  return { doc: hooks.doc, model: new Model(hooks) };
}
function exchange(a: Doc, b: Doc, reverse = false) {
  const left = encodeStateAsUpdate(a);
  const right = encodeStateAsUpdate(b);
  if (reverse) {
    applyUpdate(b, left);
    applyUpdate(a, right);
  } else {
    applyUpdate(a, right);
    applyUpdate(b, left);
  }
}

describe('collaboration protocol v3', () => {
  test('out-of-order named-cell and directory updates cannot clear received content during style creation', () => {
    const left = setup();
    const right = peer(left.doc);
    left.model.setCellValue(42, left.range);
    const relay = peer(left.doc);
    const updates: Uint8Array[] = [];
    relay.doc.on('update', (update) => updates.push(update));
    relay.model.updateCellStyle({ isBold: true }, left.range);
    applyUpdate(right.doc, updates[0]);
    right.model.setCellValue(42, left.range);
    exchange(right.doc, relay.doc);
    exchange(left.doc, right.doc);
    expect(left.model.getCell(left.range)).toEqual({ value: 42, isBold: true });
    expect(right.model.getCell(left.range)).toEqual({
      value: 42,
      isBold: true,
    });
  });

  test('JSON replacement clears omitted named-cell data before later style-only reuse', () => {
    const left = setup();
    left.model.setCellValue(42, left.range);
    const json = left.model.toJSON();
    json.worksheets = {};
    left.model.fromJSON(json);
    left.model.updateCellStyle({ isBold: true }, left.range);
    expect(left.model.getCell(left.range)).toEqual({ value: '', isBold: true });
    hydrateDocument(left.doc, json);
    left.model.updateCellStyle({ isItalic: true }, left.range);
    expect(left.model.getCell(left.range)).toEqual({
      value: '',
      isItalic: true,
    });
  });

  test.each([false, true])(
    'concurrent first value/style writes preserve only explicit fields (reverse=%s)',
    (reverse) => {
      const left = setup();
      const right = peer(left.doc);
      left.model.transaction(() => left.model.setCellValue(42, left.range));
      right.model.transaction(() => right.model.updateCellStyle({ isBold: true }, left.range));
      exchange(left.doc, right.doc, reverse);
      expect(left.model.getCell(left.range)).toEqual({
        value: 42,
        isBold: true,
      });
      expect(right.model.getCell(left.range)).toEqual({
        value: 42,
        isBold: true,
      });
      right.model.transaction(() => right.model.updateCellStyle({ fontSize: 24 }, left.range));
      exchange(left.doc, right.doc, !reverse);
      expect(left.model.getCell(left.range)).toEqual({
        value: 42,
        isBold: true,
        fontSize: 24,
      });
      left.model.undo();
      expect(left.model.getCell(left.range)).toEqual({
        value: '',
        isBold: true,
        fontSize: 24,
      });
      left.model.redo();
      expect(left.model.getCell(left.range)?.value).toBe(42);
    },
  );

  test.each([false, true])(
    'public controller first writes and second remote updates render without Awareness (%s)',
    async (reverse) => {
      const left = initController();
      left.addFirstSheet();
      const hooks = getMockHooks();
      applyUpdate(hooks.doc, encodeStateAsUpdate(left.getHooks().doc));
      const right = initController(hooks as any);
      const range = {
        row: 0,
        col: 0,
        rowCount: 1,
        colCount: 1,
        sheetId: left.getCurrentSheetId(),
      };
      const changes: Set<string>[] = [];
      right.on('renderChange', ({ changeSet }) => changes.push(changeSet));
      left.setCellValue(42, range);
      right.updateCellStyle({ isBold: true }, range);
      exchange(left.getHooks().doc, right.getHooks().doc, reverse);
      expect(right.getCell(range)).toEqual({ value: 42, isBold: true });
      changes.length = 0;
      left.setCellValue(43, range);
      applyUpdate(right.getHooks().doc, encodeStateAsUpdate(left.getHooks().doc));
      await Promise.resolve();
      expect(right.getCell(range)).toEqual({ value: 43, isBold: true });
      expect(changes.some((set) => set.has('worksheets'))).toBe(true);
      left.destroy();
      right.destroy();
    },
  );

  test.each([false, true])(
    'concurrent formula/literal assignment is coherent on blank and existing cells (%s)',
    async (existing) => {
      for (const reverse of [false, true]) {
        const left = setup();
        if (existing) {
          left.model.setCellValue('=10', left.range);
          await left.model.computeFormulas();
        }
        const right = peer(left.doc);
        left.model.transaction(() => left.model.setCellValue('=2+2', left.range));
        await left.model.computeFormulas();
        right.model.transaction(() => {
          right.model.setCellValue(42, left.range);
          right.model.updateCellStyle({ isBold: true }, left.range);
        });
        exchange(left.doc, right.doc, reverse);
        await left.model.computeFormulas();
        await right.model.computeFormulas();
        const cell = left.model.getCell(left.range)!;
        expect(cell).toEqual(right.model.getCell(left.range));
        expect(cell.isBold).toBe(true);
        if (cell.formula) expect(cell).toMatchObject({ formula: '=2+2', value: 4 });
        else expect(cell.value).toBe(42);
        const restored = peer(left.doc);
        expect(restored.model.getCell(left.range)).toEqual(cell);
      }
    },
  );

  test.each(['row', 'col'] as const)(
    'concurrent %s insertions preserve formulas, names, merges and filters',
    async (axis) => {
      const left = setup();
      const range = { ...left.range, rowCount: 3, colCount: 3 };
      left.model.setCellValue(7, range);
      left.model.addMergeCell(range);
      left.model.setDefineName(range, 'target');
      left.model.addFilter(range);
      left.model.updateFilter(range.sheetId, {
        col: 2,
        value: { type: 'normal', value: [7] },
      });
      const formula = { ...left.range, row: 10, col: 10 };
      left.model.setCellValue('=SUM($C$3:E5)', formula);
      left.model.hideRow(2, 1);
      const right = peer(left.doc);
      if (axis === 'row') {
        left.model.transaction(() => left.model.addRow(0, 1, true));
        right.model.transaction(() => right.model.addRow(1, 1, true));
      } else {
        left.model.transaction(() => left.model.addCol(0, 1));
        right.model.transaction(() => right.model.addCol(1, 1));
      }
      exchange(left.doc, right.doc);
      const expected = { ...range, [axis]: 4 };
      for (const model of [left.model, right.model]) {
        expect(model.getCell(expected)?.value).toBe(7);
        expect(model.getMergeCellList()).toEqual([expected]);
        expect(model.checkDefineName('target')).toEqual(expected);
        expect(model.getFilter()?.range).toEqual(expected);
        expect(model.getFilter()?.col).toBe(axis === 'row' ? 2 : 4);
        expect(model.getRow(axis === 'row' ? 4 : 2).isHide).toBe(true);
        const moved = { ...formula, [axis]: 12 };
        expect(model.getCell(moved)?.formula).toBe(
          axis === 'row' ? '=SUM($C$5:E7)' : '=SUM($E$3:G5)',
        );
        await model.computeFormulas();
        expect(model.getCell(moved)?.value).toBe(7);
      }
      const reconnected = peer(left.doc);
      expect(reconnected.model.toJSON()).toEqual(left.model.toJSON());
    },
  );

  test.each([
    ['row', 4],
    ['row', 5],
    ['col', 4],
    ['col', 5],
  ] as const)(
    'concurrent %s deletions shrink endpoint/interior ranges and invalidate direct refs (%s)',
    async (axis, second) => {
      const left = setup();
      const range = { ...left.range, rowCount: 4, colCount: 4 };
      left.model.addMergeCell(range);
      left.model.setCellValue(7, { ...range, row: 3, col: 3 });
      left.model.setDefineName(range, 'target');
      left.model.addFilter(range);
      const aggregate = { ...left.range, row: 12, col: 12 };
      const direct = { ...aggregate, col: 13 };
      left.model.setCellValue('=SUM(C3:F6)', aggregate);
      left.model.setCellValue('=$C$3', direct);
      const right = peer(left.doc);
      if (axis === 'row') {
        left.model.transaction(() => left.model.deleteRow(2, 1));
        right.model.transaction(() => right.model.deleteRow(second, 1));
      } else {
        left.model.transaction(() => left.model.deleteCol(2, 1));
        right.model.transaction(() => right.model.deleteCol(second, 1));
      }
      exchange(left.doc, right.doc, true);
      const expected = {
        ...range,
        [axis === 'row' ? 'rowCount' : 'colCount']: 2,
      };
      for (const model of [left.model, right.model]) {
        expect(model.getMergeCellList()).toEqual([expected]);
        expect(model.checkDefineName('target')).toEqual(expected);
        expect(model.getFilter()?.range).toEqual(expected);
        const moved = { ...aggregate, [axis]: aggregate[axis] - 2 };
        const movedDirect = { ...direct, [axis]: direct[axis] - 2 };
        expect(model.getCell(moved)?.formula).toBe(axis === 'row' ? '=SUM(C3:F4)' : '=SUM(C3:D6)');
        expect(model.getCell(movedDirect)?.formula).toBe('=#REF!');
        await model.computeFormulas();
        expect(model.getCell(moved)?.value).toBe(7);
        expect(model.getCell(movedDirect)?.value).toBe('#REF!');
      }
    },
  );

  test('fully deleted metadata disappears except retained invalid names; undo/redo restores identities', async () => {
    const left = setup();
    const range = { ...left.range, rowCount: 2, colCount: 2 };
    left.model.addMergeCell(range);
    left.model.setDefineName(range, 'target');
    left.model.addFilter(range);
    const formula = { ...left.range, row: 10, col: 10 };
    left.model.setCellValue('=SUM(target)', formula);
    left.model.clearHistory();
    left.model.transaction(() => left.model.deleteRow(2, 2));
    expect(left.model.getMergeCellList()).toEqual([]);
    expect(left.model.getFilter()).toBeUndefined();
    expect(left.model.checkDefineName('target')).toMatchObject({
      row: -1,
      col: -1,
    });
    await left.model.computeFormulas();
    expect(left.model.getCell({ ...formula, row: 8 })?.value).toBe('#REF!');
    const json = left.model.toJSON();
    const restored = setup();
    restored.model.fromJSON(json);
    expect(restored.model.checkDefineName('target')).toMatchObject({
      row: -1,
      col: -1,
    });
    left.model.undo();
    expect(left.model.getMergeCellList()).toEqual([range]);
    expect(left.model.checkDefineName('target')).toEqual(range);
    expect(left.model.getFilter()?.range).toEqual(range);
    left.model.redo();
    expect(left.model.getMergeCellList()).toEqual([]);
    expect(left.model.getFilter()).toBeUndefined();
  });

  test('deleting a referenced sheet invalidates direct and named references through binary/JSON round trips', async () => {
    const left = setup();
    left.model.setCellValue(7, left.range);
    left.model.setDefineName(left.range, 'target');
    const target = left.model.addSheet();
    const formula = { ...left.range, row: 0, col: 0, sheetId: target.sheetId };
    left.model.setCellValue('=Sheet1!C3', formula);
    left.model.setCellValue('=SUM(target)', { ...formula, col: 1 });
    left.model.deleteSheet(left.range.sheetId);
    expect(left.model.getCell(formula)?.formula).toBe('=#REF!');
    expect(left.model.checkDefineName('target')).toMatchObject({
      row: -1,
      col: -1,
    });
    await left.model.computeFormulas();
    expect(left.model.getCell(formula)?.value).toBe('#REF!');
    expect(left.model.getCell({ ...formula, col: 1 })?.value).toBe('#REF!');
    const json = setup();
    json.model.fromJSON(left.model.toJSON());
    expect(json.model.toJSON()).toEqual(left.model.toJSON());
    expect(peer(left.doc).model.toJSON()).toEqual(left.model.toJSON());
  });

  test('whole axes, R1C1 and mixed absolute presentation survive insertions and binary/JSON round trips', () => {
    const left = setup();
    const formula = { ...left.range, row: 10, col: 10 };
    left.model.setCellValue('=SUM(C:C)+SUM(3:3)+R[-8]C[-8]+$C3+C$3', formula);
    left.model.setDefineName({ ...left.range, row: 0, rowCount: 0, colCount: 1 }, 'wholeColumn');
    left.model.transaction(() => {
      left.model.addRow(0, 1, true);
      left.model.addCol(0, 1);
    });
    const moved = { ...formula, row: 11, col: 11 };
    expect(left.model.getCell(moved)?.formula).toBe('=SUM(D:D)+SUM(4:4)+R[-8]C[-8]+$D4+D$4');
    expect(left.model.checkDefineName('wholeColumn')).toMatchObject({
      row: 0,
      rowCount: 0,
      col: 3,
    });
    const binary = peer(left.doc);
    expect(binary.model.toJSON()).toEqual(left.model.toJSON());
    const json = setup();
    json.model.fromJSON(left.model.toJSON());
    expect(json.model.toJSON()).toEqual(left.model.toJSON());
  });

  test('a new merge at an old numeric coordinate cannot overwrite a structurally moved merge', () => {
    const left = setup();
    const range = { ...left.range, rowCount: 2, colCount: 2 };
    left.model.addMergeCell(range);
    left.model.addRow(2, 2, true);
    left.model.addMergeCell(range);
    expect(left.model.getMergeCellList()).toEqual([{ ...range, row: 4 }, range]);
  });

  test('re-entering original source after structural projection rebinds the newly requested coordinate', async () => {
    const left = setup();
    const source = { ...left.range, row: 0, col: 1 };
    const formula = { ...left.range, row: 0, col: 5 };
    left.model.setCellValue(7, source);
    left.model.setCellValue('=B1', formula);
    left.model.addCol(1, 1);
    const moved = { ...formula, col: 6 };
    expect(left.model.getCell(moved)?.formula).toBe('=C1');
    left.model.setCellValue('=B1', moved);
    expect(left.model.getCell(moved)?.formula).toBe('=B1');
    await left.model.computeFormulas();
    expect(left.model.getCell(moved)?.value).toBe(0);
  });

  test('late formula workers cannot overwrite concurrent literal content', async () => {
    const hooks = getMockHooks();
    let callback: ((result: any) => boolean) | undefined;
    hooks.worker = {
      computeFormulas: async (_data: any, next: typeof callback) => {
        callback = next;
        return false;
      },
    } as any;
    const model = new Model(hooks);
    model.addSheet();
    const range = {
      row: 0,
      col: 0,
      rowCount: 1,
      colCount: 1,
      sheetId: model.getCurrentSheetId(),
    };
    model.setCellValue('=1+1', range);
    await model.computeFormulas();
    const remote = peer(hooks.doc);
    remote.model.setCellValue(42, range);
    applyUpdate(hooks.doc, encodeStateAsUpdate(remote.doc));
    expect(callback!({ list: [{ key: `${range.sheetId}_0_0`, newValue: 2 }] })).toBe(false);
    expect(model.getCell(range)).toMatchObject({ value: 42, formula: '' });
  });

  test('untracked computed caches do not resurrect cells after undo or deletion', async () => {
    const left = setup();
    left.model.transaction(() => left.model.setCellValue('=1+1', left.range));
    await left.model.computeFormulas();
    expect(left.model.getCell(left.range)?.value).toBe(2);
    left.model.undo();
    expect(left.model.getCell(left.range)).toBeUndefined();
    expect(left.model.toJSON().worksheets).toEqual({});
    left.model.redo();
    expect(left.model.getCell(left.range)).toMatchObject({
      formula: '=1+1',
      value: 2,
    });
    left.model.transaction(() => left.model.deleteCell(left.range));
    expect(left.model.getCell(left.range)).toBeUndefined();
  });

  test.each([
    {
      targetRow: 2,
      targetCol: 2,
      insertRow: 5,
      rows: 1,
      insertCol: 5,
      cols: 2,
      before: '=R[-8]C[-8]+R3C3+R[-8]C3+R3C[-8]',
      after: '=R[-9]C[-10]+R3C3+R[-9]C3+R3C[-10]',
      formulaRow: 11,
      formulaCol: 12,
    },
    {
      targetRow: 30,
      targetCol: 20,
      insertRow: 20,
      rows: 2,
      insertCol: 15,
      cols: 1,
      before: '=R[20]C[10]+R31C21+R[20]C21+R31C[10]',
      after: '=R[22]C[11]+R33C22+R[22]C22+R33C[11]',
      formulaRow: 10,
      formulaCol: 10,
    },
  ])(
    'public Model preserves relative, absolute and mixed R1C1 when formula/target move differently ($targetRow)',
    async (data) => {
      const left = setup();
      const formula = { ...left.range, row: 10, col: 10 };
      left.model.setCellValue(7, {
        ...left.range,
        row: data.targetRow,
        col: data.targetCol,
      });
      left.model.setCellValue(data.before, formula);
      await left.model.computeFormulas();
      expect(left.model.getCell(formula)?.value).toBe(28);
      left.model.transaction(() => {
        left.model.addRow(data.insertRow, data.rows, true);
        left.model.addCol(data.insertCol, data.cols);
      });
      const moved = { ...formula, row: data.formulaRow, col: data.formulaCol };
      expect(left.model.getCell(moved)?.formula).toBe(data.after);
      await left.model.computeFormulas();
      expect(left.model.getCell(moved)?.value).toBe(28);
      expect(peer(left.doc).model.getCell(moved)).toEqual(left.model.getCell(moved));
    },
  );

  test('invalid/mixed versions and malformed v2 documents fail without destructive migration', () => {
    const doc = new Doc();
    doc.getMap('excel:meta').set('version', 4);
    expect(() => new SharedRoot(doc)).toThrow('Unsupported collaboration protocol: 4');
    doc.getMap('excel:meta').set('version', 2);
    doc.getMap('excel:workbook').set('broken', new YMap([['rows', new YArray()]]));
    const before = encodeStateAsUpdate(doc);
    expect(() => upgradeDocument(doc)).toThrow('Invalid worksheet');
    expect(Buffer.from(encodeStateAsUpdate(doc)).equals(Buffer.from(before))).toBe(true);
    const legacy = setup().model.toJSON();
    const clean = new Doc();
    hydrateDocument(clean, legacy);
    expect(clean.getMap('excel:meta').get('version')).toBe(3);
  });
});
