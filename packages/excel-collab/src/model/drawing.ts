import type { ModelJSON, IDrawings, DrawingElement, IModel, IRange, TypedMap } from '../types';
import { CHART_TYPE_LIST, iterateRange, toIRange } from '../util';
import i18n from '../i18n';
import { Map } from 'yjs';

export class Drawing implements IDrawings {
  private readonly model: IModel;
  constructor(model: IModel) {
    this.model = model;
  }
  private get drawings() {
    return this.model.getRoot().get('drawings');
  }
  validateDrawing(data: DrawingElement): boolean {
    if (!data?.uuid) {
      return false;
    }
    const sheetInfo = this.model.getSheetInfo(data.sheetId);
    if (!sheetInfo) {
      return false;
    }
    if (data.type === 'floating-picture') {
      if (!data.imageSrc) {
        return false;
      }
    } else {
      if (data.chartType === undefined || data.chartRange === undefined) {
        return false;
      }
      if (CHART_TYPE_LIST.findIndex((v) => v.value === data.chartType) < 0) {
        return false;
      }
      if (!this.model.validateRange(data.chartRange)) {
        return false;
      }
    }
    return true;
  }
  fromJSON(json: ModelJSON): void {
    const data = json.drawings || {};
    const drawings = this.drawings;
    drawings.clear();
    for (const [uuid, value] of Object.entries(data)) {
      if (!this.validateDrawing(value) || !uuid) {
        continue;
      }
      const item = new Map(Object.entries(value)) as TypedMap<DrawingElement>;
      drawings.set(uuid, item);
      this.model.getRoot().bindDrawing(uuid, value);
    }
  }
  getDrawingList(sheetId?: string): DrawingElement[] {
    if (!this.drawings) {
      return [];
    }
    const id = sheetId || this.model.getCurrentSheetId();
    const list = Array.from(this.drawings.keys())
      .map((key) => this.model.getRoot().drawing(key))
      .filter((item): item is DrawingElement => !!item && item.sheetId === id);
    return list.slice();
  }
  addDrawing(data: DrawingElement) {
    const oldData = this.drawings?.get(data.uuid);
    if (oldData) {
      return this.model.emit('toastMessage', {
        type: 'error',
        message: i18n.t('uuid-is-duplicate'),
      });
    }
    if (!this.validateDrawing(data)) {
      return;
    }
    if (data.type === 'chart') {
      const range = data.chartRange!;
      let check = false;
      const info = this.model.getSheetInfo(range.sheetId);
      if (!info) {
        return this.model.emit('toastMessage', {
          type: 'error',
          message: i18n.t('sheet-is-not-exist'),
        });
      }
      iterateRange(range, info?.rowCount, info?.colCount, (row: number, col: number) => {
        const data = this.model.getCell({
          row,
          col,
          rowCount: 1,
          colCount: 1,
          sheetId: range.sheetId,
        });
        if (data && data.value !== '' && data.value !== undefined && data.value !== null) {
          check = true;
          return true;
        } else {
          return false;
        }
      });
      if (!check) {
        return this.model.emit('toastMessage', {
          type: 'error',
          message: i18n.t('cells-must-contain-data'),
        });
      }
      data.chartRange = toIRange(data.chartRange!);
    } else if (data.type === 'floating-picture') {
      if (typeof data.imageAngle !== 'number') {
        data.imageAngle = 0;
      }
    }
    this.drawings!.set(data.uuid, new Map(Object.entries(data)) as TypedMap<DrawingElement>);
    this.model.getRoot().bindDrawing(data.uuid, data);
  }
  updateDrawing(uuid: string, value: Partial<DrawingElement>) {
    const keyList = Object.keys(value) as Array<keyof DrawingElement>;
    const item = this.drawings?.get(uuid);
    if (keyList.length === 0 || !item) {
      return;
    }
    for (const key of keyList) {
      if (item.get(key) !== value[key]) {
        if (key === 'chartType') {
          const index = CHART_TYPE_LIST.findIndex((v) => v.value === value.chartType!);
          if (index < 0) {
            return this.model.emit('toastMessage', {
              type: 'error',
              message: i18n.t('unsupported-chart-types'),
            });
          }
        }
      }
    }
    for (const key of keyList) {
      const newValue = value[key];
      if (item.get(key) !== newValue) {
        item.set(key, key === 'chartRange' ? toIRange(newValue as IRange) : newValue);
      }
    }
    const projected = this.model.getRoot().drawing(uuid)!;
    if ('fromRow' in value || 'fromCol' in value || 'sheetId' in value) {
      this.model.getRoot().bindRange(`drawing:${uuid}`, {
        sheetId: value.sheetId ?? projected.sheetId,
        row: value.fromRow ?? projected.fromRow,
        col: value.fromCol ?? projected.fromCol,
        rowCount: 1,
        colCount: 1,
      });
    }
    if (value.chartRange) this.model.getRoot().bindRange(`chart:${uuid}`, value.chartRange);
  }
  deleteDrawing(uuid: string) {
    this.drawings?.delete(uuid);
  }
  addCol(colIndex: number, count: number, isRight = false): void {
    if (!this.drawings) {
      return;
    }
    const sheetInfo = this.model.getSheetInfo();
    if (!sheetInfo) {
      return;
    }
    const colCount = sheetInfo.colCount + count;
    for (const [uuid, v] of this.drawings.entries()) {
      const item = v.toJSON();
      if (item.sheetId !== this.model.getCurrentSheetId()) {
        continue;
      }
      const result: Partial<DrawingElement> = {};
      const startIndex = isRight ? colIndex + 1 : colIndex;

      if (item.fromCol >= startIndex) {
        result.fromCol = Math.min(colCount - 1, item.fromCol + count);
      }
      if (item.type === 'chart' && item.chartRange!.col >= startIndex) {
        const chartRange: IRange = {
          ...item.chartRange!,
        };
        const col = chartRange.col;
        if (col + count <= colCount - 1) {
          chartRange.col += count;
        } else {
          chartRange.col = colCount - 1;
          chartRange.colCount = Math.max(colCount - 1 - count - col + chartRange.colCount, 1);
        }
        result.chartRange = chartRange;
      } else if (
        item.type === 'chart' &&
        item.chartRange!.col + item.chartRange!.colCount > startIndex
      ) {
        result.chartRange = { ...item.chartRange!, colCount: item.chartRange!.colCount + count };
      }

      this.updateDrawing(uuid, result);
    }
  }
  addRow(rowIndex: number, count: number, isAbove = false): void {
    if (count <= 0) {
      return;
    }
    if (!this.drawings) {
      return;
    }
    const sheetInfo = this.model.getSheetInfo();
    if (!sheetInfo) {
      return;
    }
    const rowCount = sheetInfo.rowCount + count;
    for (const [uuid, v] of this.drawings.entries()) {
      const item = v.toJSON();
      if (item.sheetId !== this.model.getCurrentSheetId()) {
        continue;
      }
      const result: Partial<DrawingElement> = {};
      const startIndex = isAbove ? rowIndex : rowIndex + 1;

      if (item.fromRow >= startIndex) {
        result.fromRow = Math.min(rowCount - 1, item.fromRow + count);
      }
      if (item.type === 'chart' && item.chartRange!.row >= startIndex) {
        const chartRange: IRange = {
          ...item.chartRange!,
        };
        const row = chartRange.row;
        if (row + count <= rowCount - 1) {
          chartRange.row += count;
        } else {
          chartRange.row = rowCount - 1;
          chartRange.rowCount = Math.max(rowCount - 1 - count - row + chartRange.rowCount, 1);
        }
        result.chartRange = chartRange;
      } else if (
        item.type === 'chart' &&
        item.chartRange!.row + item.chartRange!.rowCount > startIndex
      ) {
        result.chartRange = { ...item.chartRange!, rowCount: item.chartRange!.rowCount + count };
      }
      this.updateDrawing(uuid, result);
    }
  }
  deleteCol(colIndex: number, count: number): void {
    if (!this.drawings) {
      return;
    }
    const colCount = this.model.getSheetInfo()!.colCount - count;
    for (const [uuid, v] of this.drawings.entries()) {
      const item = v.toJSON();
      if (item.sheetId !== this.model.getCurrentSheetId()) {
        continue;
      }
      const result: Partial<DrawingElement> = {};
      if (item.fromCol >= colIndex) {
        result.fromCol = Math.min(colCount - 1, Math.max(item.fromCol - count, colIndex));
      }
      if (item.type === 'chart') {
        const chartRange: IRange = {
          ...item.chartRange!,
        };
        const col = chartRange.col;
        const overlap = Math.max(
          0,
          Math.min(col + chartRange.colCount, colIndex + count) - Math.max(col, colIndex),
        );
        chartRange.col = Math.min(
          colCount - 1,
          col < colIndex ? col : Math.max(colIndex, col - count),
        );
        chartRange.colCount = Math.max(1, chartRange.colCount - overlap);
        chartRange.colCount = Math.min(chartRange.colCount, colCount - chartRange.col);
        result.chartRange = chartRange;
      }
      this.updateDrawing(uuid, result);
    }
  }
  /* jscpd:ignore-start */
  deleteRow(rowIndex: number, count: number): void {
    if (!this.drawings) {
      return;
    }
    const rowCount = this.model.getSheetInfo()!.rowCount - count;
    for (const [uuid, v] of this.drawings.entries()) {
      const item = v.toJSON();
      if (item.sheetId !== this.model.getCurrentSheetId()) {
        continue;
      }
      const result: Partial<DrawingElement> = {};
      if (item.fromRow >= rowIndex) {
        result.fromRow = Math.min(rowCount - 1, Math.max(item.fromRow - count, rowIndex));
      }
      if (item.type === 'chart') {
        const chartRange: IRange = {
          ...item.chartRange!,
        };
        const row = chartRange.row;
        const overlap = Math.max(
          0,
          Math.min(row + chartRange.rowCount, rowIndex + count) - Math.max(row, rowIndex),
        );
        chartRange.row = Math.min(
          rowCount - 1,
          row < rowIndex ? row : Math.max(rowIndex, row - count),
        );
        chartRange.rowCount = Math.max(1, chartRange.rowCount - overlap);
        chartRange.rowCount = Math.min(chartRange.rowCount, rowCount - chartRange.row);
        result.chartRange = chartRange;
      }
      this.updateDrawing(uuid, result);
    }
  }
  /* jscpd:ignore-end */
  deleteAll(sheetId?: string): void {
    if (!this.drawings) {
      return;
    }
    const id = sheetId || this.model.getCurrentSheetId();
    for (const [key, value] of this.drawings.entries()) {
      if (value.get('sheetId') === id) {
        this.drawings.delete(key);
      }
    }
  }
}
