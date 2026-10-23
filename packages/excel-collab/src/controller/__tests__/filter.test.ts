import { IController, type FilterValue } from '../../types';
import { initController } from '..';
import { matchesFilter } from '../../util';
import { Model } from '../../model';
import { getMockHooks } from '../../model/__tests__/util';
import { applyUpdate, encodeStateAsUpdate } from 'yjs';

describe('filter.test.ts', () => {
  let controller: IController;
  beforeEach(() => {
    controller = initController();
    controller.addSheet();
  });
  afterEach(() => controller.destroy());
  test('removing a filter restores filtered rows but preserves manually hidden rows', () => {
    const range = {
      row: 0,
      col: 0,
      rowCount: 4,
      colCount: 2,
      sheetId: controller.getCurrentSheetId(),
    };
    controller.setCell(
      [
        ['Name', 'Score'],
        ['Alpha', 10],
        ['Beta', 20],
        ['Alpha', 30],
      ],
      [],
      range,
    );
    controller.hideRow(3, 1);
    controller.addFilter(range);
    controller.updateFilter('', { col: 0, value: { type: 'normal', value: ['Alpha'] } });
    expect(controller.getRow(1).isHide).toBe(false);
    expect(controller.getRow(2).isHide).toBe(true);
    expect(controller.getRow(3).isHide).toBe(true);
    controller.deleteFilter();
    expect(controller.getRow(2).isHide).toBe(false);
    expect(controller.getRow(3).isHide).toBe(true);
  });
  test('not valid', () => {
    const sheetId = controller.getCurrentSheetId();
    controller.addFilter({
      row: 0,
      col: 0,
      colCount: 1,
      rowCount: 1,
      sheetId,
    });
    expect(controller.getFilter(sheetId)).toBeUndefined();
  });
  test('combines columns and clears only the requested column', () => {
    const range = {
      row: 0,
      col: 0,
      rowCount: 4,
      colCount: 2,
      sheetId: controller.getCurrentSheetId(),
    };
    controller.setCell(
      [
        ['Name', 'Score'],
        ['Alpha', 10],
        ['Beta', 20],
        ['Alpha', 30],
      ],
      [],
      range,
    );
    controller.addFilter(range);
    controller.updateFilter('', {
      col: 0,
      value: {
        type: 'custom',
        operator: 'and',
        conditions: [{ operator: 'contains', value: 'ALP' }],
      },
    });
    controller.updateFilter('', {
      col: 1,
      value: {
        type: 'custom',
        operator: 'and',
        conditions: [{ operator: 'greaterThan', value: 15 }],
      },
    });
    expect([1, 2, 3].map((row) => controller.getRow(row).isHide)).toEqual([true, true, false]);
    controller.updateFilter('', { col: 0, value: undefined });
    expect([1, 2, 3].map((row) => controller.getRow(row).isHide)).toEqual([true, false, false]);
    controller.updateFilter('', { col: undefined, value: undefined });
    expect([1, 2, 3].map((row) => controller.getRow(row).isHide)).toEqual([false, false, false]);
  });
  test('keeps criteria attached to columns across insertions and JSON loading', () => {
    const range = {
      row: 0,
      col: 0,
      rowCount: 3,
      colCount: 2,
      sheetId: controller.getCurrentSheetId(),
    };
    controller.setCell(
      [
        ['Name', 'Score'],
        ['Alpha', 10],
        ['Beta', 20],
      ],
      [],
      range,
    );
    controller.addFilter(range);
    controller.updateFilter('', { col: 1, value: { type: 'normal', value: [20] } });
    controller.addCol(0, 1, false);
    expect(controller.getFilter()?.filters?.['2']).toEqual({ type: 'normal', value: [20] });
    expect(controller.getRow(1).isHide).toBe(true);
    expect(controller.getRow(2).isHide).toBe(false);
    const json = controller.toJSON();
    controller.fromJSON(json);
    expect(controller.getRow(1).isHide).toBe(true);
    expect(controller.getRow(2).isHide).toBe(false);
  });
  test('add', () => {
    const sheetId = controller.getCurrentSheetId();
    controller.addFilter({
      row: 0,
      col: 0,
      colCount: 10,
      rowCount: 10,
      sheetId,
    });
    expect(controller.getFilter(sheetId)).not.toBeUndefined();
  });
  test.each([
    ['equal', 'alpha', 'ALPHA', true],
    ['notEqual', 'alpha', 'ALPHA', false],
    ['contains', 'PHA', 'Alpha', true],
    ['notContains', 'pha', 'Alpha', false],
    ['startsWith', 'al', 'Alpha', true],
    ['endsWith', 'ha', 'Alpha', true],
    ['greaterThan', 10, 20, true],
    ['greaterThan', 10, '20', false],
    ['lessThanOrEqual', 10, 10, true],
    ['greaterThanOrEqual', 10, 10, true],
    ['lessThan', 1, 0, true],
    ['empty', undefined, '', true],
    ['notEmpty', undefined, false, true],
    ['notEmpty', undefined, 0, true],
  ] as const)('matches %s against %s', (operator, operand, value, expected) => {
    expect(
      matchesFilter(
        { value },
        {
          type: 'custom',
          operator: 'and',
          conditions: [{ operator, value: operand }],
        },
      ),
    ).toBe(expected);
  });
  test('supports inclusive and reversed numeric bounds, OR, and font/fill colors', () => {
    const between: FilterValue = {
      type: 'custom',
      operator: 'and',
      conditions: [{ operator: 'between', value: 20, value2: 10 }],
    };
    expect(matchesFilter({ value: 10 }, between)).toBe(true);
    expect(matchesFilter({ value: '' }, between)).toBe(false);
    expect(
      matchesFilter(
        { value: 0 },
        {
          type: 'custom',
          operator: 'or',
          conditions: [
            { operator: 'equal', value: 0 },
            { operator: 'equal', value: 20 },
          ],
        },
      ),
    ).toBe(true);
    expect(
      matchesFilter(
        { value: '', fontColor: '#FF0000' },
        {
          type: 'color',
          colorType: 'fontColor',
          value: '#ff0000',
        },
      ),
    ).toBe(true);
    expect(matchesFilter(undefined, { type: 'color', colorType: 'fillColor', value: '' })).toBe(
      true,
    );
  });
  test('re-evaluates edits and preserves filters across undo and remote synchronization', () => {
    const range = {
      row: 0,
      col: 0,
      rowCount: 3,
      colCount: 2,
      sheetId: controller.getCurrentSheetId(),
    };
    controller.setCell(
      [
        ['Name', 'Score'],
        ['Alpha', 10],
        ['Beta', 20],
      ],
      [],
      range,
    );
    controller.addFilter(range);
    controller.clearHistory();
    controller.updateFilter('', { col: 0, value: { type: 'normal', value: ['Alpha'] } });
    expect(controller.getRow(2).isHide).toBe(true);
    controller.undo();
    expect(controller.getRow(2).isHide).toBe(false);
    controller.redo();
    expect(controller.getRow(2).isHide).toBe(true);
    controller.setCellValue('Alpha', { ...range, row: 2 });
    expect(controller.getRow(2).isHide).toBe(false);
    const peer = new Model(getMockHooks());
    applyUpdate(peer.getRoot().doc, encodeStateAsUpdate(controller.getHooks().doc));
    expect(peer.getFilter(range.sheetId)?.filters).toEqual(controller.getFilter()?.filters);
    expect(peer.getRow(1, range.sheetId).isHide).toBe(false);
    peer.destroy();
  });
  test('merges simultaneous filters on different columns without losing either rule', () => {
    const range = {
      row: 0,
      col: 0,
      rowCount: 3,
      colCount: 2,
      sheetId: controller.getCurrentSheetId(),
    };
    controller.setCell(
      [
        ['Name', 'Score'],
        ['Alpha', 10],
        ['Beta', 20],
      ],
      [],
      range,
    );
    controller.addFilter(range);
    const peer = new Model(getMockHooks());
    applyUpdate(peer.getRoot().doc, encodeStateAsUpdate(controller.getHooks().doc));
    controller.updateFilter('', { col: 0, value: { type: 'normal', value: ['Alpha'] } });
    peer.transaction(() =>
      peer.updateFilter(range.sheetId, { col: 1, value: { type: 'normal', value: [20] } }),
    );
    const localUpdate = encodeStateAsUpdate(controller.getHooks().doc);
    applyUpdate(controller.getHooks().doc, encodeStateAsUpdate(peer.getRoot().doc));
    applyUpdate(peer.getRoot().doc, localUpdate);
    expect(controller.getFilter()?.filters).toEqual({
      '0': { type: 'normal', value: ['Alpha'] },
      '1': { type: 'normal', value: [20] },
    });
    expect(peer.getFilter(range.sheetId)?.filters).toEqual(controller.getFilter()?.filters);
    expect(controller.getRow(1).isHide).toBe(true);
    expect(controller.getRow(2).isHide).toBe(true);
    peer.destroy();
  });
  test('delete', () => {
    const sheetId = controller.getCurrentSheetId();
    controller.addFilter({
      row: 0,
      col: 0,
      colCount: 10,
      rowCount: 10,
      sheetId,
    });
    expect(controller.getFilter(sheetId)).not.toBeUndefined();
    controller.deleteFilter(sheetId);
    expect(controller.getFilter(sheetId)).toBeUndefined();
  });
  test('update', () => {
    const sheetId = controller.getCurrentSheetId();
    controller.addFilter({
      row: 0,
      col: 0,
      colCount: 10,
      rowCount: 10,
      sheetId,
    });
    expect(controller.getFilter(sheetId)).not.toBeUndefined();
    controller.updateFilter(sheetId, {
      col: 1,
      value: { type: 'normal', value: [1, 'test'] },
    });
    expect(controller.getFilter(sheetId)?.col).not.toBeUndefined();
    expect(controller.getFilter(sheetId)?.value).not.toBeUndefined();
  });
});
