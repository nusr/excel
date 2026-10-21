import { vi } from 'vitest';
import { applyUpdate, Doc, encodeStateAsUpdate } from 'yjs';
import { initController } from '..';
import * as util from '../../util';
import { Model } from '../../model';
import { getMockHooks } from '../../model/__tests__/util';

describe('controller review regressions', () => {
  afterEach(() => vi.restoreAllMocks());

  test('setting scroll for another sheet leaves active-sheet scroll untouched', () => {
    const controller = initController();
    const first = controller.addSheet()!;
    controller.addSheet();
    controller.setScroll({
      row: 3, col: 4, top: 30, left: 40, scrollLeft: 40, scrollTop: 30,
    }, first.sheetId);
    expect(controller.getScroll(first.sheetId)).toMatchObject({ row: 3, col: 4, top: 30, left: 40 });
    expect(controller.getScroll()).toMatchObject({ row: 0, col: 0 });
    controller.destroy();
  });

  test('undo/redo respect read-only mode', () => {
    const controller = initController();
    controller.addFirstSheet();
    const range = { row: 0, col: 0, rowCount: 1, colCount: 1, sheetId: controller.getCurrentSheetId() };
    controller.setCellValue(42, range);
    controller.setReadOnly(true);
    controller.undo();
    expect(controller.getCell(range)?.value).toBe(42);
    controller.setReadOnly(false);
    controller.undo();
    controller.setReadOnly(true);
    controller.redo();
    expect(controller.getCell(range)).toBeUndefined();
    controller.setReadOnly(false);
    controller.redo();
    expect(controller.getCell(range)?.value).toBe(42);
    controller.destroy();
  });

  test('async clipboard paste remains undoable and redoable', async () => {
    vi.spyOn(util, 'paste').mockResolvedValue({
      [util.HTML_FORMAT]: '', [util.PLAIN_FORMAT]: '42',
      [util.CUSTOM_FORMAT]: null, [util.IMAGE_FORMAT]: null,
    });
    const controller = initController();
    controller.addFirstSheet();
    const range = { row: 0, col: 0, rowCount: 1, colCount: 1, sheetId: controller.getCurrentSheetId() };
    await controller.paste();
    expect(controller.getCell(range)?.value).toBe(42);
    expect(controller.canUndo()).toBe(true);
    controller.undo();
    expect(controller.getCell(range)).toBeUndefined();
    controller.redo();
    expect(controller.getCell(range)?.value).toBe(42);
    controller.destroy();
  });

  test('undo and structural edits recompute formulas and invalidate drawing/size caches', () => {
    const controller = initController();
    controller.addFirstSheet();
    const range = { row: 0, col: 0, rowCount: 1, colCount: 1, sheetId: controller.getCurrentSheetId() };
    controller.setCell([[1, '=A1']], [], range);
    controller.clearHistory();
    controller.setCellValue(2, range);
    expect(controller.getCell({ ...range, col: 1 })?.value).toBe(2);
    controller.undo();
    expect(controller.getCell({ ...range, col: 1 })?.value).toBe(1);
    const width = controller.getSheetViewSize().width;
    controller.setColWidth(0, 1000);
    controller.undo();
    expect(controller.getSheetViewSize().width).toBe(width);
    controller.addRow(0, 1, true);
    expect(controller.getCell({ ...range, row: 1, col: 1 })).toMatchObject({ value: 1, formula: '=A2' });
    controller.destroy();
  });

  test('renaming a referenced nonactive sheet rewrites formulas atomically with undo/redo and synchronization', () => {
    const controller = initController();
    const source = controller.addFirstSheet()!;
    const range = { row: 0, col: 0, rowCount: 1, colCount: 1, sheetId: source.sheetId };
    controller.setCellValue(7, range);
    const target = controller.addSheet()!;
    const formulaCell = { ...range, sheetId: target.sheetId };
    controller.setCellValue('=Sheet1!$A$1', formulaCell);
    controller.clearHistory();
    controller.renameSheet("O'Brien Data", source.sheetId);
    expect(controller.getCell(formulaCell)).toMatchObject({ formula: "='O''Brien Data'!$A$1", value: 7 });
    const peerDoc = new Doc();
    applyUpdate(peerDoc, encodeStateAsUpdate(controller.getHooks().doc));
    const peer = new Model({ ...getMockHooks(), doc: peerDoc });
    expect(peer.getCell(formulaCell)).toEqual(controller.getCell(formulaCell));
    expect(peer.getSheetInfo(source.sheetId)?.name).toBe("O'Brien Data");
    controller.undo();
    expect(controller.getSheetInfo(source.sheetId)?.name).toBe('Sheet1');
    expect(controller.getCell(formulaCell)).toMatchObject({ formula: '=Sheet1!$A$1', value: 7 });
    controller.redo();
    expect(controller.getCell(formulaCell)).toMatchObject({ formula: "='O''Brien Data'!$A$1", value: 7 });
    controller.destroy();
    peer.destroy();
  });

  test('direct name updates preserve string literals, formatting and other-sheet references', () => {
    const controller = initController();
    const source = controller.addFirstSheet()!;
    const range = { row: 0, col: 0, rowCount: 1, colCount: 1, sheetId: source.sheetId };
    controller.setCellValue(7, range);
    const target = controller.addSheet()!;
    const formulaCell = { ...range, sheetId: target.sheetId };
    const sourceFormula = '=SUM( Sheet1!$A$1:$A$1 , \'Sheet1\'!A1 , Sheet2!A2 )';
    const literalFormula = '="Sheet1!A1"';
    controller.setCellValue(sourceFormula, formulaCell);
    controller.setCellValue(literalFormula, { ...formulaCell, row: 1 });
    controller.updateSheetInfo({ name: 'Renamed' }, source.sheetId);
    expect(controller.getCell(formulaCell)?.formula).toBe(
      '=SUM( Renamed!$A$1:$A$1 , Renamed!A1 , Sheet2!A2 )',
    );
    expect(controller.getCell({ ...formulaCell, row: 1 })?.formula).toBe(literalFormula);
    expect(controller.getCell(formulaCell)?.value).toBe(14);
    controller.destroy();
  });

  test('rejected and case-only renames do not corrupt formula references', () => {
    const controller = initController();
    const source = controller.addFirstSheet()!;
    const target = controller.addSheet()!;
    const range = { row: 0, col: 0, rowCount: 1, colCount: 1, sheetId: source.sheetId };
    const formulaCell = { ...range, sheetId: target.sheetId };
    controller.setCellValue(7, range);
    controller.setCellValue('=Sheet1!A1', formulaCell);
    controller.renameSheet('Sheet2', source.sheetId);
    expect(controller.getCell(formulaCell)?.formula).toBe('=Sheet1!A1');
    controller.renameSheet('sheet1', source.sheetId);
    expect(controller.getCell(formulaCell)).toMatchObject({ formula: '=sheet1!A1', value: 7 });
    controller.destroy();
  });
});
