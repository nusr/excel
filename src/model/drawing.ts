import {
  WorkBookJSON,
  ICommandItem,
  IDrawings,
  FloatElement,
  IModel,
} from '@/types';
import { assert } from '@/util';
import { DELETE_FLAG, transformData } from './History';
import { $ } from '@/i18n';

export class Drawing implements IDrawings {
  private drawings: WorkBookJSON['drawings'] = {};
  private model: IModel;
  constructor(model: IModel) {
    this.model = model;
  }
  toJSON() {
    return {
      drawings: this.drawings,
    };
  }
  fromJSON(json: WorkBookJSON): void {
    const data = json.drawings || {};
    this.drawings = { ...data };
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
  getFloatElementList(sheetId?: string): FloatElement[] {
    const id = sheetId || this.model.getCurrentSheetId();
    const list = Object.values(this.drawings).filter((v) => v.sheetId === id);
    return list.slice();
  }
  addFloatElement(data: FloatElement) {
    const oldData = this.drawings[data.uuid];
    assert(!oldData, $('uuid-is-duplicate'));
    if (data.type === 'chart') {
      const range = data.chartRange!;
      let check = false;
      this.model.iterateRange(range, (row: number, col: number) => {
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
      });
      assert(check, $('cells-must-contain-data'));
    } else if (data.type === 'floating-picture') {
      assert(!!data.imageSrc, $('image-source-is-empty'));
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
  updateFloatElement(uuid: string, value: Partial<FloatElement>) {
    const item = this.drawings[uuid];
    if (!item) {
      return;
    }
    const keyList = Object.keys(value) as Array<keyof FloatElement>;
    for (const key of keyList) {
      if (item[key] !== value[key]) {
        const oldValue = item[key];
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
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
  deleteFloatElement(uuid: string) {
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
  deleteCol(colIndex: number, count: number): void {
    if (count <= 0) {
      return;
    }
    for (const [uuid, item] of Object.entries(this.drawings)) {
      if (item.fromCol >= colIndex) {
        const oldValue = item.fromCol;
        if (item.fromCol >= count) {
          item.fromCol -= count;
        } else {
          item.fromCol = 0;
        }
        this.model.push({
          type: 'drawings',
          key: `${uuid}.fromCol`,
          newValue: item.fromCol,
          oldValue: oldValue,
        });
      }
      if (item.type === 'chart' && item.chartRange!.col >= colIndex) {
        const oldCol = item.chartRange!.col;
        const oldColCount = item.chartRange!.colCount;
        if (item.chartRange!.col >= count) {
          item.chartRange!.col -= count;
        } else {
          const t = count - item.chartRange!.col;
          item.chartRange!.col = 0;
          if (item.chartRange!.colCount >= t) {
            item.chartRange!.colCount -= t;
          } else {
            item.chartRange!.colCount = 1;
          }
          this.model.push({
            type: 'drawings',
            key: `${uuid}.chartRange.colCount`,
            newValue: item.chartRange!.col,
            oldValue: oldColCount,
          });
        }
        this.model.push({
          type: 'drawings',
          key: `${uuid}.chartRange.col`,
          newValue: item.chartRange!.col,
          oldValue: oldCol,
        });
      }
    }
  }
  deleteRow(rowIndex: number, count: number): void {
    if (count <= 0) {
      return;
    }
    for (const [uuid, item] of Object.entries(this.drawings)) {
      if (item.fromRow >= rowIndex) {
        const oldValue = item.fromRow;
        if (item.fromRow >= count) {
          item.fromRow -= count;
        } else {
          item.fromRow = 0;
        }
        this.model.push({
          type: 'drawings',
          key: `${uuid}.fromRow`,
          newValue: item.fromRow,
          oldValue: oldValue,
        });
      }
      if (item.type === 'chart' && item.chartRange!.row >= rowIndex) {
        const oldRow = item.chartRange!.row;
        const oldRowCount = item.chartRange!.rowCount;
        if (item.chartRange!.row >= count) {
          item.chartRange!.row -= count;
        } else {
          const t = count - item.chartRange!.row;
          item.chartRange!.row = 0;
          if (item.chartRange!.rowCount >= t) {
            item.chartRange!.rowCount -= t;
          } else {
            item.chartRange!.rowCount = 1;
          }
          this.model.push({
            type: 'drawings',
            key: `${uuid}.chartRange.rowCount`,
            newValue: item.chartRange!.row,
            oldValue: oldRowCount,
          });
        }
        this.model.push({
          type: 'drawings',
          key: `${uuid}.chartRange.row`,
          newValue: item.chartRange!.row,
          oldValue: oldRow,
        });
      }
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
