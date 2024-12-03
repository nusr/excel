import type { ModelJSON, IScroll, IModel, ModelScroll } from '@excel/shared';

export class ScrollManager implements IScroll {
  private model: IModel;
  private scroll: ModelJSON['scroll'] = {};
  constructor(model: IModel) {
    this.model = model;
  }
  fromJSON(json: ModelJSON): void {
    const data = json.scroll || {};
    const scroll: ModelJSON['scroll'] = {};
    for (const [sheetId, value] of Object.entries(data)) {
      if (!sheetId || value.row < 0 || value.col < 0) {
        continue;
      }
      scroll[sheetId] = value;
    }
    this.scroll = scroll;
  }
  toJSON() {
    return { ...this.scroll };
  }
  deleteAll(sheetId?: string): void {
    const id = sheetId || this.model.getCurrentSheetId();
    delete this.scroll[id];
  }
  getScroll(sheetId?: string): ModelScroll {
    const t = this.scroll[sheetId || this.model.getCurrentSheetId()];
    if (!t) {
      return { row: 0, col: 0 };
    }
    return { ...t };
  }
  setScroll(value: ModelScroll, sheetId?: string) {
    const id = sheetId || this.model.getCurrentSheetId();
    const sheetInfo = this.model.getSheetInfo(id);
    if (!sheetInfo) {
      return false;
    }
    const maxRow = sheetInfo.rowCount - 1;
    const maxCol = sheetInfo.colCount - 1;
    if (value.row >= maxRow) {
      value.row = maxRow;
    } else if (value.row < 0) {
      value.row = 0;
    }
    if (value.col >= maxCol) {
      value.col = maxCol;
    } else if (value.col < 0) {
      value.col = 0;
    }
    this.scroll[id] = { ...value };
    return true;
  }
}
