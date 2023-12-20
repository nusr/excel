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
} from '@/types';
import {
  controllerLog,
  Range,
  isEmpty,
  PLAIN_FORMAT,
  HTML_FORMAT,
  deepEqual,
  generateHTML,
  convertCanvasStyleToString,
  parseStyle,
  convertResultTypeToString,
} from '@/util';

const ROW_TITLE_HEIGHT = 19;
const COL_TITLE_WIDTH = 34;

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
  getSheetList(): WorkBookJSON['workbook'] {
    return this.model.getSheetList();
  }
  getSheetInfo(sheetId: string): WorksheetType {
    return this.model.getSheetInfo(sheetId);
  }
  setHooks(hooks: IHooks): void {
    this.hooks = hooks;
  }
  private emitChange(): void {
    const result = this.changeSet;
    this.changeSet = new Set<ChangeEventType>();
    this.hooks.modelChange(result);
  }
  getActiveCell(): IRange {
    const currentSheetId = this.model.getCurrentSheetId();
    const { activeCell } = this.getSheetInfo(currentSheetId);
    return {
      ...activeCell,
      sheetId: activeCell.sheetId || currentSheetId,
    };
  }
  private setSheetCell(range: IRange) {
    const id = range.sheetId || this.model.getCurrentSheetId();
    range.sheetId = id;
    this.model.setActiveCell(range);
  }
  setActiveCell(range: IRange): void {
    this.setSheetCell(range);
    this.changeSet.add('setActiveCell');
    this.emitChange();
  }
  setCurrentSheetId(id: string): void {
    if (id === this.getCurrentSheetId()) {
      return;
    }
    this.model.transaction(() => {
      this.model.setCurrentSheetId(id);
      this.changeSet.add('currentSheetId');
      const pos = this.getActiveCell();
      this.setSheetCell(pos);
      this.computeViewSize();
      this.setScroll(this.getScroll());
    });
  }
  addSheet = (): void => {
    this.changeSet.add('sheetList');
    this.changeSet.add('currentSheetId');
    this.model.transaction(() => {
      this.model.addSheet();
      this.setSheetCell({
        row: 0,
        col: 0,
        rowCount: 1,
        colCount: 1,
        sheetId: '',
      });
      this.computeViewSize();
      this.setScroll({
        top: 0,
        left: 0,
        row: 0,
        col: 0,
        scrollLeft: 0,
        scrollTop: 0,
      });
    });
  };
  deleteSheet = (sheetId?: string): void => {
    this.transaction(() => {
      this.model.deleteSheet(sheetId);
      this.changeSet.add('sheetList');
      this.changeSet.add('currentSheetId');
      this.changeSet.add('setActiveCell');
      this.emitChange();
    });
  };
  hideSheet(sheetId?: string | undefined): void {
    this.model.hideSheet(sheetId);
    this.changeSet.add('sheetList');
    this.changeSet.add('currentSheetId');
    this.changeSet.add('setActiveCell');
    this.emitChange();
  }
  unhideSheet(sheetId?: string | undefined): void {
    this.model.unhideSheet(sheetId);
    this.changeSet.add('sheetList');
    this.changeSet.add('currentSheetId');
    this.changeSet.add('setActiveCell');
    this.emitChange();
  }
  renameSheet(sheetName: string, sheetId?: string | undefined): void {
    this.model.renameSheet(sheetName, sheetId);
    this.changeSet.add('sheetList');
    this.emitChange();
  }
  fromJSON(json: WorkBookJSON): void {
    controllerLog('loadJSON', json);
    this.model.transaction(() => {
      this.model.fromJSON(json);
      const activeCell = this.getActiveCell();
      this.changeSet.add('sheetList');
      this.changeSet.add('currentSheetId');
      this.changeSet.add('setActiveCell');
      this.setSheetCell(activeCell);
      this.computeViewSize();
      this.emitChange();
    });
  }
  toJSON(): WorkBookJSON {
    return this.model.toJSON();
  }

  setCellValues(
    value: ResultType[][],
    style: Array<Array<Partial<StyleType>>>,
    ranges: IRange[],
  ): void {
    this.transaction(() => {
      this.model.setCellValues(value, style, ranges);
      this.changeSet.add('setCellValues');
      this.emitChange();
    });
  }
  setCellStyle(style: Partial<StyleType>, ranges: IRange[]): void {
    if (isEmpty(style)) {
      return;
    }
    this.transaction(() => {
      this.model.setCellStyle(style, ranges);
      this.changeSet.add('setCellStyle');
      this.emitChange();
    });
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
    this.transaction(() => {
      this.model.undo();
      this.changeSet.add('setActiveCell');
      this.changeSet.add('sheetList');
      this.changeSet.add('currentSheetId');
      this.changeSet.add('scroll');
      this.emitChange();
    });
  }
  redo() {
    this.transaction(() => {
      this.model.redo();
      this.changeSet.add('setActiveCell');
      this.changeSet.add('sheetList');
      this.changeSet.add('currentSheetId');
      this.changeSet.add('scroll');
      this.emitChange();
    });
  }
  getColWidth(col: number): number {
    return this.model.getColWidth(col);
  }
  setColWidth(col: number, width: number): void {
    this.model.setColWidth(col, width);
    this.computeViewSize();
    this.changeSet.add('content');
  }
  getRowHeight(row: number): number {
    return this.model.getRowHeight(row);
  }
  setRowHeight(row: number, height: number) {
    this.model.setRowHeight(row, height);
    this.computeViewSize();
    this.changeSet.add('content');
  }
  private computeViewSize() {
    const headerSize = this.getHeaderSize();
    const sheetInfo = this.model.getSheetInfo(this.model.getCurrentSheetId());
    let { width } = headerSize;
    let { height } = headerSize;
    for (let i = 0; i < sheetInfo.colCount; i++) {
      width += this.getColWidth(i);
    }
    for (let i = 0; i < sheetInfo.rowCount; i++) {
      height += this.getRowHeight(i);
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
  getCellSize(row: number, col: number): IWindowSize {
    return { width: this.getColWidth(col), height: this.getRowHeight(row) };
  }
  getHeaderSize() {
    return {
      ...this.headerSize,
    };
  }
  computeCellPosition(row: number, col: number): CanvasOverlayPosition {
    const size = this.getHeaderSize();
    const scroll = this.getScroll();
    let resultX = size.width;
    let resultY = size.height;
    let r = scroll.row;
    let c = scroll.col;
    while (c < col) {
      resultX += this.getColWidth(c);
      c++;
    }
    while (r < row) {
      resultY += this.getRowHeight(r);
      r++;
    }
    const cellSize = this.getCellSize(row, col);
    return { ...cellSize, top: resultY, left: resultX };
  }

  addRow(rowIndex: number, count: number): void {
    this.model.addRow(rowIndex, count);
    this.changeSet.add('content');
    this.emitChange();
  }
  addCol(colIndex: number, count: number): void {
    this.model.addCol(colIndex, count);
    this.changeSet.add('content');
    this.emitChange();
  }
  deleteCol(colIndex: number, count: number): void {
    this.model.deleteCol(colIndex, count);
    this.changeSet.add('content');
    this.emitChange();
  }
  deleteRow(rowIndex: number, count: number): void {
    this.model.deleteRow(rowIndex, count);
    this.changeSet.add('content');
    this.emitChange();
  }
  hideCol(colIndex: number, count: number): void {
    this.model.hideCol(colIndex, count);
    this.changeSet.add('content');
    this.emitChange();
  }
  hideRow(rowIndex: number, count: number): void {
    this.model.hideRow(rowIndex, count);
    this.changeSet.add('content');
    this.emitChange();
  }
  getChangeSet(): Set<ChangeEventType> {
    const result = this.changeSet;
    this.changeSet = new Set<ChangeEventType>();
    return result;
  }

  getScroll(): ScrollValue {
    const sheetId = this.model.getCurrentSheetId();
    const result = this.scrollValue[sheetId] || defaultScrollValue;
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
    this.changeSet.add('content');
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
    const parser = new DOMParser();
    const text = htmlString
      .replace('<style>\r\n<!--table', '<style>')
      .replace('-->\r\n</style>', '</style>');
    const doc = parser.parseFromString(text, 'text/html');
    const trList = doc.querySelectorAll('tr');
    const styleList = doc.querySelectorAll('style');
    const result: string[][] = [];
    const resultStyle: Array<Array<Partial<StyleType>>> = [];
    const rowCount = trList.length;
    let colCount = 0;
    for (const item of trList) {
      const tdList = item.querySelectorAll('td');
      const temp: string[] = [];
      const list: Array<Partial<StyleType>> = [];
      for (const td of tdList) {
        let itemStyle: Partial<StyleType> = {};
        if (td.className) {
          itemStyle = parseStyle(styleList, `.${td.className}`);
        } else {
          itemStyle = parseStyle(styleList, td.tagName.toLowerCase());
        }
        list.push(itemStyle);
        temp.push(td.textContent || '');
      }
      result.push(temp);
      resultStyle.push(list);
      if (temp.length > colCount) {
        colCount = temp.length;
      }
    }
    const activeCell = this.getActiveCell();
    return {
      value: result,
      style: resultStyle,
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
        const str = String(a.value || '');
        temp.push(str);
        if (a.style) {
          let text = convertCanvasStyleToString(a.style);
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
  private clearCopyRanges(result: string[][]) {
    if (this.copyRanges.length === 0 || this.isCut || result.length === 0) {
      return;
    }
    const list: string[][] = [];
    const [fromRange] = this.copyRanges;
    const { row, col, rowCount, colCount, sheetId } = fromRange;
    for (let r = row, i = 0, endRow = row + rowCount; r < endRow; r++, i++) {
      const arr: string[] = [];
      for (let c = col, j = 0, endCol = col + colCount; c < endCol; c++, j++) {
        const v = this.model.getCell(new Range(r, c, 1, 1, sheetId));
        const t = convertResultTypeToString(v.value);
        arr.push(t);
      }
      list.push(arr);
    }
    if (!deepEqual(list, result)) {
      this.copyRanges = [];
    }
  }
  paste(event?: ClipboardEvent) {
    this.transaction(() => {
      this.basePaste(event);
    });
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
    let activeCell = this.getActiveCell();
    this.changeSet.add('setCellValues');
    let check = false;
    if (html) {
      const result = this.parseHTML(html);
      if (result.value.length > 0) {
        activeCell = result.range;
        this.changeSet.add('setCellStyle');
        this.model.setCellValues(result.value, result.style, [result.range]);
        check = true;
        this.clearCopyRanges(result.value);
      }
    }
    if (!check && text) {
      const result = this.parseText(text);
      if (result.value.length > 0) {
        activeCell = result.range;
        this.model.setCellValues(result.value, [], [result.range]);
        check = true;
        this.clearCopyRanges(result.value);
      }
    }
    if (!check && this.copyRanges.length > 0) {
      const [range] = this.copyRanges.slice();
      this.changeSet.add('setCellStyle');
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
    this.transaction(() => {
      this.copyRanges = [this.getActiveCell()];
      this.isCut = false;
      const data = this.getCopyData();
      if (event) {
        const keyList = Object.keys(data) as ClipboardType[];
        for (const key of keyList) {
          event.clipboardData?.setData(key, data[key]);
        }
      } else {
        this.hooks.copyOrCut(data, 'copy');
      }
      this.changeSet.add('antLine');
      this.emitChange();
    });
  }
  cut(event?: ClipboardEvent) {
    this.copyRanges = [this.getActiveCell()];
    this.isCut = true;
    this.copy(event);
  }
  getCopyRanges() {
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
    const size = canvas.parentElement!.getBoundingClientRect();
    return {
      top: size.top,
      left: size.left,
      width: size.width,
      height: size.height,
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
    this.changeSet.add('content');
    this.emitChange();
  }
  getDefineName(range: IRange): string {
    return this.model.getDefineName(range);
  }
  setDefineName(range: IRange, name: string): void {
    this.model.setDefineName(range, name);
    this.changeSet.add('content');
    this.emitChange();
  }
  checkDefineName(name: string): IRange | undefined {
    return this.model.checkDefineName(name);
  }
  transaction(func: () => void): void {
    this.model.transaction(func);
  }
}
