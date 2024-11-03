import {
  WorkBookJSON,
  ICommandItem,
  IDrawings,
  DrawingElement,
  IModel,
} from '@/types';
import { CHART_TYPE_LIST, iterateRange } from '@/util';
import { DELETE_FLAG, transformData } from './History';
import { $ } from '@/i18n';
import { toast } from '@/components';

export class Drawing implements IDrawings {
  private drawings: WorkBookJSON['drawings'] = {};
  private model: IModel;
  constructor(model: IModel) {
    this.model = model;
  }
  validateDrawing(data: DrawingElement): boolean {
    if (!data || !data.uuid) {
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
  toJSON() {
    return {
      drawings: { ...this.drawings },
    };
  }
  fromJSON(json: WorkBookJSON): void {
    const data = json.drawings || {};
    const oldValue = { ...this.drawings };
    this.drawings = {};
    for (const [uuid, value] of Object.entries(data)) {
      if (!this.validateDrawing(value) || !uuid) {
        return;
      }
      this.drawings[uuid] = value;
    }
    this.model.push({
      type: 'drawings',
      key: '',
      newValue: this.drawings,
      oldValue,
    });
  }
  undo(item: ICommandItem): void {
    if (item.type === 'drawings') {
      transformData(this, item, 'undo');
    }
  }
  redo(item: ICommandItem): void {
    if (item.type === 'drawings') {
      transformData(this, item, 'redo');
    }
  }
  getDrawingList(sheetId?: string): DrawingElement[] {
    const id = sheetId || this.model.getCurrentSheetId();
    const list = Object.values(this.drawings).filter((v) => v.sheetId === id);
    return list.slice();
  }
  addDrawing(data: DrawingElement) {
    const oldData = this.drawings[data.uuid];
    if (oldData) {
      return toast.error($('uuid-is-duplicate'));
    }
    if (!this.validateDrawing(data)) {
      return;
    }
    if (data.type === 'chart') {
      const range = data.chartRange!;
      let check = false;
      const info = this.model.getSheetInfo(range.sheetId);
      if (!info) {
        return toast.error($('sheet-is-not-exist'));
      }
      iterateRange(
        range,
        info?.rowCount,
        info?.colCount,
        (row: number, col: number) => {
          const data = this.model.getCell({
            row,
            col,
            rowCount: 1,
            colCount: 1,
            sheetId: '',
          });
          if (data?.value) {
            check = true;
            return true;
          } else {
            return false;
          }
        },
      );
      if (!check) {
        return toast.error($('cells-must-contain-data'));
      }
    } else if (data.type === 'floating-picture') {
      if (typeof data.imageAngle !== 'number') {
        data.imageAngle = 0;
      }
    }
    this.drawings[data.uuid] = data;
    this.model.push({
      type: 'drawings',
      key: data.uuid,
      newValue: data,
      oldValue: DELETE_FLAG,
    });
  }
  updateDrawing(uuid: string, value: Partial<DrawingElement>) {
    const keyList = Object.keys(value) as Array<keyof DrawingElement>;
    const item = this.drawings[uuid];
    if (keyList.length === 0 || !item) {
      return;
    }
    for (const key of keyList) {
      if (item[key] !== value[key]) {
        if (key === 'chartType') {
          const index = CHART_TYPE_LIST.findIndex(
            (v) => v.value === value.chartType!,
          );
          if (index < 0) {
            return toast.error($('unsupported-chart-types'));
          }
        }
      }
    }
    for (const key of keyList) {
      if (item[key] !== value[key]) {
        const oldValue =
          typeof item[key] === 'object' && item[key]
            ? // @ts-ignore
              { ...item[key] }
            : item[key];
        // @ts-ignore
        item[key] = value[key];
        this.model.push({
          type: 'drawings',
          key: `${uuid}.${key}`,
          newValue: item[key],
          oldValue: oldValue,
        });
      }
    }
  }
  deleteDrawing(uuid: string) {
    const oldData = this.drawings[uuid];
    if (!oldData) {
      return;
    }
    delete this.drawings[uuid];
    this.model.push({
      type: 'drawings',
      key: uuid,
      newValue: DELETE_FLAG,
      oldValue: oldData,
    });
  }
  addCol(colIndex: number, count: number, isRight = false): void {
    const colCount = this.model.getSheetInfo()!.colCount;
    for (const [uuid, item] of Object.entries(this.drawings)) {
      const result: Partial<DrawingElement> = {};
      const startIndex = isRight ? colIndex + 1 : colIndex;

      if (item.fromCol >= startIndex) {
        result.fromCol = Math.min(colCount - 1, item.fromCol + count);
      }
      if (item.type === 'chart' && item.chartRange!.col >= startIndex) {
        result.chartRange = {
          ...item.chartRange!,
        };
        const col = result.chartRange.col;
        if (col + count <= colCount - 1) {
          result.chartRange.col += count;
        } else {
          result.chartRange.col = colCount - 1;
          result.chartRange.colCount = Math.max(
            colCount - 1 - count - col + result.chartRange.colCount,
            1,
          );
        }
      }

      this.updateDrawing(uuid, result);
    }
  }
  addRow(rowIndex: number, count: number, isAbove = false): void {
    if (count <= 0) {
      return;
    }
    const rowCount = this.model.getSheetInfo()!.rowCount;
    for (const [uuid, item] of Object.entries(this.drawings)) {
      const result: Partial<DrawingElement> = {};
      const startIndex = isAbove ? rowIndex : rowIndex + 1;

      if (item.fromRow >= startIndex) {
        result.fromRow = Math.min(rowCount - 1, item.fromRow + count);
      }
      if (item.type === 'chart' && item.chartRange!.row >= startIndex) {
        result.chartRange = {
          ...item.chartRange!,
        };
        const row = result.chartRange.row;
        if (row + count <= rowCount - 1) {
          result.chartRange.row += count;
        } else {
          result.chartRange.row = rowCount - 1;
          result.chartRange.rowCount = Math.max(
            rowCount - 1 - count - row + result.chartRange.rowCount,
            1,
          );
        }
      }
      this.updateDrawing(uuid, result);
    }
  }
  deleteCol(colIndex: number, count: number): void {
    for (const [uuid, item] of Object.entries(this.drawings)) {
      const result: Partial<DrawingElement> = {};
      if (item.fromCol >= colIndex) {
        result.fromCol = Math.max(item.fromCol - count, 0);
      }
      if (item.type === 'chart' && item.chartRange!.col >= colIndex) {
        result.chartRange = {
          ...item.chartRange!,
        };
        const col = result.chartRange.col;
        if (col >= count) {
          result.chartRange.col -= count;
        } else {
          result.chartRange.col = 0;
          result.chartRange.colCount = Math.max(
            col - count + result.chartRange.colCount,
            1,
          );
        }
      }
      this.updateDrawing(uuid, result);
    }
  }
  deleteRow(rowIndex: number, count: number): void {
    for (const [uuid, item] of Object.entries(this.drawings)) {
      const result: Partial<DrawingElement> = {};
      if (item.fromRow >= rowIndex) {
        result.fromRow = Math.max(item.fromRow - count, 0);
      }
      if (item.type === 'chart' && item.chartRange!.row >= rowIndex) {
        result.chartRange = {
          ...item.chartRange!,
        };
        const row = result.chartRange.row;
        if (row >= count) {
          result.chartRange.row = row - count;
        } else {
          result.chartRange.row = 0;
          result.chartRange.rowCount = Math.max(
            row - count + result.chartRange.rowCount,
            1,
          );
        }
      }
      this.updateDrawing(uuid, result);
    }
  }
  deleteAll(sheetId?: string): void {
    const id = sheetId || this.model.getCurrentSheetId();
    for (const [key, value] of Object.entries(this.drawings)) {
      if (value.sheetId === id) {
        delete this.drawings[key];
        this.model.push({
          type: 'drawings',
          key: key,
          newValue: DELETE_FLAG,
          oldValue: { ...value },
        });
      }
    }
  }
}
