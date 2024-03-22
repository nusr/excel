import {
  WorkBookJSON,
  StyleType,
  ChangeEventType,
  IController,
  IHooks,
  IModel,
  WorksheetType,
  IWindowSize,
  CanvasOverlayPosition,
  ScrollValue,
  IRange,
  ResultType,
  ClipboardData,
  ClipboardType,
  MainDom,
  FloatElement,
  IPosition,
} from '@/types';
import {
  controllerLog,
  Range,
  PLAIN_FORMAT,
  HTML_FORMAT,
  generateHTML,
  convertToCssString,
  ROW_TITLE_HEIGHT,
  COL_TITLE_WIDTH,
  containRange,
  parseHTML,
  generateUUID,
  sizeConfig,
} from '@/util';

const defaultScrollValue: ScrollValue = {
  top: 0,
  left: 0,
  row: 0,
  col: 0,
  scrollLeft: 0,
  scrollTop: 0,
};

export class Controller implements IController {
  private scrollValue: Record<string, ScrollValue> = {};
  private model: IModel;
  private changeSet = new Set<ChangeEventType>();
  private copyRanges: IRange[] = []; // cut or copy ranges
  private isCut = false; // cut or copy
  private floatElementUuid = '';
  private hooks: IHooks = {
    modelChange() {},
    async copyOrCut() {
      return '';
    },
    async paste() {
      return {
        [HTML_FORMAT]: '',
        [PLAIN_FORMAT]: '',
      };
    },
  };
  // sheet size
  private viewSize = {
    width: 0,
    height: 0,
  };
  private headerSize = {
    width: COL_TITLE_WIDTH,
    height: ROW_TITLE_HEIGHT,
  };
  private mainDom: MainDom = {};
  constructor(model: IModel) {
    this.model = model;
  }
  getCurrentSheetId(): string {
    return this.model.getCurrentSheetId();
  }
  getSheetList(): WorksheetType[] {
    return this.model.getSheetList();
  }
  getSheetInfo(sheetId: string) {
    return this.model.getSheetInfo(sheetId);
  }
  setHooks(hooks: IHooks): void {
    this.hooks = hooks;
  }
  private emitChange(): void {
    if (this.changeSet.size === 0) {
      return;
    }
    this.computeViewSize();
    const result = this.changeSet;
    this.changeSet = new Set<ChangeEventType>();
    controllerLog(result);
    this.model.emitChange(result);
    this.hooks.modelChange(result);
  }
  getActiveCell(): IRange {
    const range = this.model.getActiveCell();
    return range;
  }
  private getRange(range: IRange) {
    const mergeCells = this.getMergeCells(this.getCurrentSheetId());
    if (mergeCells.length === 0) {
      return {
        range,
        isMerged: false,
      };
    }

    for (const item of mergeCells) {
      if (containRange(range.row, range.col, item)) {
        const newRange = {
          ...item,
          sheetId: item.sheetId || this.getCurrentSheetId(),
        };
        return {
          range: newRange,
          isMerged: true,
        };
      }
    }

    return {
      range,
      isMerged: false,
    };
  }
  getActiveRange() {
    const range = this.getActiveCell();
    return this.getRange(range);
  }
  setNextActiveCell(direction: 'left' | 'right' | 'down' | 'up'): IRange {
    const range = this.getActiveCell();
    let startCol = range.col;
    let startRow = range.row;
    const sheetInfo = this.getSheetInfo(range.sheetId)!;
    const mergeCells = this.getMergeCells(range.sheetId);
    const result = {
      ...range,
    };
    if (direction === 'left') {
      startCol--;
      // eslint-disable-next-line no-constant-condition
      while (1) {
        let check1 = false;
        let check2 = false;
        for (const item of mergeCells) {
          if (startCol >= item.col && startCol < item.col + item.colCount) {
            startCol = Math.min(startCol, item.col - 1);
            check1 = true;
            break;
          }
        }
        while (startCol > 0 && this.getColWidth(startCol).len <= 0) {
          startCol--;
          check2 = true;
        }
        if (startCol <= 0) {
          startCol = 0;
          break;
        }
        if (!check2 && !check1) {
          break;
        }
      }
      result.col = startCol;
    }
    if (direction === 'right') {
      startCol++;
      // eslint-disable-next-line no-constant-condition
      while (1) {
        let check1 = false;
        let check2 = false;
        for (const item of mergeCells) {
          if (startCol >= item.col && startCol < item.col + item.colCount) {
            startCol = Math.max(startCol, item.col + item.colCount);
            check1 = true;
            break;
          }
        }
        while (
          startCol < sheetInfo.colCount &&
          this.getColWidth(startCol).len <= 0
        ) {
          startCol++;
          check2 = true;
        }
        if (startCol >= sheetInfo.colCount - 1) {
          startCol = sheetInfo.colCount - 1;
          break;
        }
        if (!check2 && !check1) {
          break;
        }
      }
      result.col = startCol;
    }
    if (direction === 'up') {
      startRow--;
      // eslint-disable-next-line no-constant-condition
      while (1) {
        let check1 = false;
        let check2 = false;
        for (const item of mergeCells) {
          if (startRow >= item.row && startRow < item.row + item.rowCount) {
            startRow = Math.min(startRow, item.row - 1);
            check1 = true;
            break;
          }
        }
        while (startRow > 0 && this.getColWidth(startRow).len <= 0) {
          startRow--;
          check2 = true;
        }
        if (startRow <= 0) {
          startRow = 0;
          break;
        }
        if (!check2 && !check1) {
          break;
        }
      }
      result.row = startRow;
    }
    if (direction === 'down') {
      startRow++;
      // eslint-disable-next-line no-constant-condition
      while (1) {
        let check1 = false;
        let check2 = false;
        for (const item of mergeCells) {
          if (startRow >= item.row && startRow < item.row + item.rowCount) {
            startRow = Math.max(startRow, item.row + item.rowCount);
            check1 = true;
            break;
          }
        }
        while (
          startRow < sheetInfo.rowCount &&
          this.getColWidth(startRow).len <= 0
        ) {
          startRow++;
          check2 = true;
        }
        if (startRow >= sheetInfo.rowCount - 1) {
          startRow = sheetInfo.rowCount - 1;
          break;
        }
        if (!check2 && !check1) {
          break;
        }
      }
      result.row = startRow;
    }
    const temp = this.getRange(result).range;
    this.setActiveCell(temp);
    return temp;
  }
  private setSheetCell(range: IRange) {
    const id = range.sheetId || this.model.getCurrentSheetId();
    range.sheetId = id;
    this.model.setActiveCell(range);
    this.changeSet.add('range');
  }
  setActiveCell(range: IRange): void {
    this.setSheetCell(range);
    this.emitChange();
  }
  setCurrentSheetId(id: string): void {
    if (id === this.getCurrentSheetId()) {
      return;
    }

    this.model.setCurrentSheetId(id);
    this.changeSet.add('sheetId');
    this.changeSet.add('cellValue');

    const pos = this.getActiveCell();
    this.setSheetCell(pos);
    this.setScroll(this.getScroll());
  }
  addSheet = (): void => {
    this.changeSet.add('sheetList');
    this.changeSet.add('range');
    this.model.addSheet();
    this.setScroll({
      top: 0,
      left: 0,
      row: 0,
      col: 0,
      scrollLeft: 0,
      scrollTop: 0,
    });
  };
  deleteSheet = (sheetId?: string): void => {
    this.model.deleteSheet(sheetId);
    this.changeSet.add('sheetList');
    this.changeSet.add('sheetId');
    this.changeSet.add('range');
    this.emitChange();
  };
  hideSheet(sheetId?: string | undefined): void {
    this.model.hideSheet(sheetId);
    this.changeSet.add('sheetList');
    this.changeSet.add('sheetId');
    this.changeSet.add('range');
    this.emitChange();
  }
  unhideSheet(sheetId?: string | undefined): void {
    this.model.unhideSheet(sheetId);
    this.changeSet.add('sheetList');
    this.changeSet.add('sheetId');
    this.changeSet.add('range');
    this.emitChange();
  }
  renameSheet(sheetName: string, sheetId?: string | undefined): void {
    this.model.renameSheet(sheetName, sheetId);
    this.changeSet.add('sheetList');
    this.emitChange();
  }
  fromJSON(json: WorkBookJSON): void {
    this.model.fromJSON(json);
    this.changeSet.add('sheetList');
    this.changeSet.add('sheetId');
    this.changeSet.add('range');
    this.changeSet.add('floatElement');
    this.changeSet.add('cellValue');
    this.setSheetCell(this.getActiveCell());
    this.emitChange();
  }
  toJSON(): WorkBookJSON {
    return this.model.toJSON();
  }

  setCellValues(
    value: ResultType[][],
    style: Array<Array<Partial<StyleType>>>,
    ranges: IRange[],
  ): void {
    this.model.setCellValues(value, style, ranges);
    this.changeSet.add('cellValue');
    this.emitChange();
  }
  updateCellStyle(style: Partial<StyleType>, ranges: IRange[]): void {
    this.model.updateCellStyle(style, ranges);
    this.changeSet.add('cellStyle');
    this.emitChange();
  }
  getCell = (range: IRange) => {
    const result = this.model.getCell(range);
    return result;
  };
  canRedo(): boolean {
    return this.model.canRedo();
  }
  canUndo(): boolean {
    return this.model.canUndo();
  }
  undo() {
    this.model.undo();
    this.changeSet.add('range');
    this.changeSet.add('sheetList');
    this.changeSet.add('sheetId');
    this.changeSet.add('scroll');
    this.changeSet.add('floatElement');
    this.changeSet.add('cellValue');
    this.changeSet.add('undoRedo');
    this.emitChange();
  }
  redo() {
    this.model.redo();
    this.changeSet.add('range');
    this.changeSet.add('sheetList');
    this.changeSet.add('sheetId');
    this.changeSet.add('scroll');
    this.changeSet.add('floatElement');
    this.changeSet.add('cellValue');
    this.changeSet.add('undoRedo');
    this.emitChange();
  }
  getColWidth(col: number, sheetId?: string) {
    return this.model.getColWidth(col, sheetId);
  }
  setColWidth(
    col: number,
    width: number,
    isChanged: boolean,
    sheetId?: string,
  ): void {
    this.model.setColWidth(col, width, isChanged, sheetId);
    this.changeSet.add('col');
    if (isChanged) {
      this.emitChange();
    }
  }
  getRowHeight(row: number, sheetId?: string) {
    return this.model.getRowHeight(row, sheetId);
  }
  setRowHeight(
    row: number,
    height: number,
    isChanged: boolean,
    sheetId?: string,
  ) {
    this.model.setRowHeight(row, height, isChanged, sheetId);
    this.changeSet.add('row');
    if (isChanged) {
      this.emitChange();
    }
  }
  private computeViewSize() {
    const headerSize = this.getHeaderSize();
    const sheetInfo = this.model.getSheetInfo(this.model.getCurrentSheetId());
    if (!sheetInfo) {
      return;
    }
    let { width } = headerSize;
    let { height } = headerSize;
    for (let i = 0; i < sheetInfo.colCount; i++) {
      width += this.getColWidth(i).len;
    }
    for (let i = 0; i < sheetInfo.rowCount; i++) {
      height += this.getRowHeight(i).len;
    }
    this.viewSize = {
      width,
      height,
    };
  }
  getViewSize() {
    return {
      ...this.viewSize,
    };
  }
  getCellSize(range: IRange): IWindowSize {
    range.sheetId = range.sheetId || this.getCurrentSheetId();
    return this.getRangeSize(range);
  }
  private getRangeSize(range: IRange) {
    const { row, col, colCount, rowCount } = range;
    const sheetId = range.sheetId || this.getCurrentSheetId();
    if (colCount === 0 || rowCount === 0) {
      return {
        width: this.getColWidth(col, sheetId).len,
        height: this.getRowHeight(row, sheetId).len,
      };
    }

    let width = 0;
    let height = 0;
    for (let r = row, endRow = row + rowCount; r < endRow; r++) {
      height += this.getRowHeight(r, sheetId).len;
    }
    for (let c = col, endCol = col + colCount; c < endCol; c++) {
      width += this.getColWidth(c, sheetId).len;
    }
    return { width, height };
  }
  getHeaderSize() {
    return {
      ...this.headerSize,
    };
  }
  computeCellPosition(range: IRange): IPosition {
    const { row, col } = range;
    const sheetId = range.sheetId || this.model.getCurrentSheetId();
    const size = this.getHeaderSize();
    const scroll = this.getScroll(sheetId);

    let resultX = size.width;
    let resultY = size.height;
    let r = scroll.row;
    let c = scroll.col;
    if (col >= scroll.col) {
      while (c < col) {
        resultX += this.getColWidth(c, sheetId).len;
        c++;
      }
    } else {
      resultX = -size.width;
      while (c > col) {
        resultX -= this.getColWidth(c, sheetId).len;
        c--;
      }
    }
    if (row >= scroll.row) {
      while (r < row) {
        resultY += this.getRowHeight(r, sheetId).len;
        r++;
      }
    } else {
      resultY = -size.height;
      while (r > row) {
        resultY -= this.getRowHeight(r, sheetId).len;
        r--;
      }
    }
    return {
      top: resultY,
      left: resultX,
    };
  }

  addRow(rowIndex: number, count: number): void {
    this.model.addRow(rowIndex, count);
    this.changeSet.add('row');
    this.emitChange();
  }
  addCol(colIndex: number, count: number): void {
    this.model.addCol(colIndex, count);
    this.changeSet.add('col');
    this.emitChange();
  }
  deleteCol(colIndex: number, count: number): void {
    this.model.deleteCol(colIndex, count);
    this.changeSet.add('col');
    this.emitChange();
  }
  deleteRow(rowIndex: number, count: number): void {
    this.model.deleteRow(rowIndex, count);
    this.changeSet.add('row');
    this.emitChange();
  }
  hideCol(colIndex: number, count: number): void {
    this.model.hideCol(colIndex, count);
    this.changeSet.add('col');
    this.emitChange();
  }
  hideRow(rowIndex: number, count: number): void {
    this.model.hideRow(rowIndex, count);
    this.changeSet.add('row');
    this.emitChange();
  }
  getChangeSet(): Set<ChangeEventType> {
    const result = this.changeSet;
    this.changeSet = new Set<ChangeEventType>();
    return result;
  }
  setChangeSet(data: Set<ChangeEventType>) {
    this.changeSet = data;
    this.emitChange();
  }
  getScroll(sheetId?: string): ScrollValue {
    const id = sheetId || this.model.getCurrentSheetId();
    const result = this.scrollValue[id] || defaultScrollValue;
    return result;
  }
  setScroll(data: ScrollValue): void {
    const sheetId = this.model.getCurrentSheetId();
    this.scrollValue[sheetId] = {
      ...data,
    };
    if (data.row > 9999) {
      this.headerSize = {
        width: Math.floor(COL_TITLE_WIDTH * 2),
        height: ROW_TITLE_HEIGHT,
      };
    } else {
      this.headerSize = {
        width: COL_TITLE_WIDTH,
        height: ROW_TITLE_HEIGHT,
      };
    }
    this.changeSet.add('scroll');
    this.emitChange();
  }
  private parseText(text: string) {
    let list: string[][];
    if (text.indexOf('\r\n') > -1) {
      list = text
        .split('\r\n')
        .map((item) => item)
        .map((item) => item.split('\t'));
    } else {
      list = text
        .split('\n')
        .map((item) => item)
        .map((item) => item.split('\t'));
    }
    if (list[0].length !== list[list.length - 1].length) {
      // delete last empty cell
      const last = list[list.length - 1];
      if (last.length === 1 && !last[0]) {
        list.pop();
      }
    }
    const rowCount = list.length;
    let colCount = 0;
    for (const item of list) {
      if (item.length > colCount) {
        colCount = item.length;
      }
    }
    const activeCell = this.getActiveCell();
    return {
      value: list,
      style: [],
      range: {
        ...activeCell,
        rowCount,
        colCount,
      },
    };
  }
  private parseHTML(htmlString: string) {
    const { textList, styleList } = parseHTML(htmlString);
    const rowCount = textList.length;
    const activeCell = this.getActiveCell();
    const colCount = Math.max(...textList.map((v) => v.length));
    return {
      value: textList,
      style: styleList,
      range: {
        ...activeCell,
        rowCount,
        colCount,
      },
    };
  }
  private getCopyData(): ClipboardData {
    const activeCell = this.getActiveCell();
    const { row, col, rowCount, colCount } = activeCell;
    const result: ResultType[][] = [];
    const html: string[][] = [];
    let index = 1;
    const classList: string[] = [];
    const currentSheetId = this.model.getCurrentSheetId();
    for (let r = row, endRow = row + rowCount; r < endRow; r++) {
      const temp: ResultType[] = [];
      const t: string[] = [];
      for (let c = col, endCol = col + colCount; c < endCol; c++) {
        const a = this.model.getCell(new Range(r, c, 1, 1, currentSheetId));
        if (!a) {
          continue;
        }
        const str = String(a.value || '');
        temp.push(str);
        if (a.style) {
          let text = convertToCssString(a.style);
          if (!str) {
            // copy background-color
            text += 'mso-pattern:black none;';
          }
          const className = `xl${index++}`;
          classList.push(`.${className}{${text}}`);
          t.push(`<td class="${className}"> ${str} </td>`);
        } else {
          t.push(`<td> ${str} </td>`);
        }
      }
      result.push(temp);
      html.push(t);
    }
    const htmlData = generateHTML(
      classList.join('\n'),
      html.map((item) => `<tr>${item.join('\n')}</tr>`).join('\n'),
    );
    const text = `${result.map((item) => item.join('\t')).join('\r\n')}\r\n`;
    return {
      [PLAIN_FORMAT]: text,
      [HTML_FORMAT]: htmlData,
    };
  }
  paste(event?: ClipboardEvent) {
    if (this.floatElementUuid) {
      if (this.isCut) {
        const uuid = this.floatElementUuid;
        const range = this.getActiveCell();

        this.model.updateFloatElement(uuid, {
          fromCol: range.col,
          fromRow: range.row,
          marginX: 0,
          marginY: 0,
        });
        this.changeSet.add('floatElement');
        this.copyRanges = [];
        this.isCut = false;
        this.floatElementUuid = '';
        this.emitChange();
      } else {
        const list = this.getFloatElementList(this.getCurrentSheetId());
        const item = list.find((v) => v.uuid === this.floatElementUuid);
        if (item) {
          const size = this.getCellSize({
            row: item.fromRow,
            col: item.fromCol,
            rowCount: 1,
            colCount: 1,
            sheetId: item.sheetId,
          });
          let { marginX, marginY } = item;
          const offset = 14;
          if (marginX + offset < size.width) {
            marginX += offset;
          } else if (marginX - offset >= 0) {
            marginX -= offset;
          }
          if (marginY + offset < size.width) {
            marginY += offset;
          } else if (marginY - offset >= 0) {
            marginY -= offset;
          }
          this.addFloatElement({
            ...item,
            uuid: generateUUID(),
            marginX,
            marginY,
          });
        }
      }
      return;
    }
    this.basePaste(event);
  }
  private async basePaste(event?: ClipboardEvent) {
    let html = '';
    let text = '';
    if (!event) {
      const data = await this.hooks.paste();
      html = data[HTML_FORMAT];
      text = data[PLAIN_FORMAT];
    } else {
      html = event.clipboardData?.getData(HTML_FORMAT) || '';
      text = event.clipboardData?.getData(PLAIN_FORMAT) || '';
    }
    html = html.trim();
    text = text.trim();
    let activeCell = this.getActiveCell();
    this.changeSet.add('cellValue');
    let check = false;
    if (html) {
      const result = this.parseHTML(html);
      if (result.value.length > 0) {
        activeCell = result.range;
        this.changeSet.add('cellStyle');
        this.model.setCellValues(result.value, result.style, [result.range]);
        check = true;
      }
    }
    if (!check && text) {
      const result = this.parseText(text);
      if (result.value.length > 0) {
        activeCell = result.range;
        this.model.setCellValues(result.value, [], [result.range]);
        check = true;
      }
    }
    if (!check && this.copyRanges.length > 0) {
      const [range] = this.copyRanges.slice();
      this.changeSet.add('cellStyle');
      activeCell = this.model.pasteRange(range, this.isCut);
    }
    if (this.isCut) {
      this.copyRanges = [];
      this.isCut = false;
      this.hooks.copyOrCut(
        {
          [PLAIN_FORMAT]: '',
          [HTML_FORMAT]: '',
        },
        'copy',
      );
    }
    this.setActiveCell(activeCell);
  }
  copy(event?: ClipboardEvent): void {
    this.copyRanges = [this.getActiveCell()];
    this.isCut = false;
    this.baseCopy('copy', event);
  }
  cut(event?: ClipboardEvent) {
    this.copyRanges = [this.getActiveCell()];
    this.isCut = true;
    this.baseCopy('cut', event);
  }
  private baseCopy(type: 'cut' | 'copy', event?: ClipboardEvent) {
    const data = this.getCopyData();
    if (event) {
      const keyList = Object.keys(data) as ClipboardType[];
      for (const key of keyList) {
        event.clipboardData?.setData(key, data[key]);
      }
    } else {
      this.hooks.copyOrCut(data, type);
    }
    this.changeSet.add('antLine');

    this.emitChange();
  }
  getCopyRanges() {
    if (this.floatElementUuid) {
      return [];
    }
    return this.copyRanges.slice();
  }
  getDomRect(): CanvasOverlayPosition {
    const { canvas } = this.getMainDom();
    if (!canvas) {
      return {
        top: 0,
        left: 0,
        width: 0,
        height: 0,
      };
    }
    const dom = canvas.parentElement!;
    const scrollbarSize = parseInt(sizeConfig.scrollBarSize, 10);
    const size = dom.getBoundingClientRect();
    return {
      top: size.top,
      left: size.left,
      width: dom.clientWidth - scrollbarSize,
      height: dom.clientHeight - scrollbarSize,
    };
  }
  setMainDom(dom: MainDom): void {
    this.mainDom = Object.assign(this.mainDom, dom);
  }
  getMainDom(): MainDom {
    return this.mainDom;
  }
  deleteAll(sheetId?: string): void {
    this.model.deleteAll(sheetId);
    this.changeSet.add('cellValue');
    this.emitChange();
  }
  getDefineName(range: IRange): string {
    return this.model.getDefineName(range);
  }
  setDefineName(range: IRange, name: string): void {
    this.model.setDefineName(range, name);
    this.changeSet.add('defineName');
    this.changeSet.add('cellValue');
    this.emitChange();
  }
  checkDefineName(name: string): IRange | undefined {
    return this.model.checkDefineName(name);
  }
  getFloatElementList(sheetId: string): FloatElement[] {
    return this.model.getFloatElementList(sheetId);
  }
  addFloatElement(data: FloatElement) {
    this.model.addFloatElement(data);
    this.changeSet.add('floatElement');
    this.emitChange();
  }
  updateFloatElement(uuid: string, value: Partial<FloatElement>) {
    this.model.updateFloatElement(uuid, value);
    this.changeSet.add('floatElement');
    this.emitChange();
  }
  deleteFloatElement(uuid: string) {
    this.model.deleteFloatElement(uuid);
    this.changeSet.add('floatElement');
    this.emitChange();
  }
  getMergeCells(sheetId?: string): IRange[] {
    return this.model.getMergeCells(sheetId);
  }
  addMergeCell(range: IRange): void {
    this.model.addMergeCell(range);
    this.changeSet.add('mergeCell');
    this.changeSet.add('cellValue');
    this.emitChange();
  }
  deleteMergeCell(range: IRange): void {
    this.model.deleteMergeCell(range);
    this.changeSet.add('mergeCell');
    this.changeSet.add('cellValue');
    this.emitChange();
  }
  setFloatElementUuid(uuid: string) {
    if (this.floatElementUuid && !uuid) {
      this.copyRanges = [];
    }
    this.floatElementUuid = uuid;
  }
}
