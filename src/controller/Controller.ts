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
  generateHTML,
  convertCanvasStyleToString,
  parseStyle,
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
  private copyRanges: Array<IRange> = [];
  private cutRanges: Array<IRange> = [];
  private hooks: IHooks = {
    modelChange() {},
    async cut() {
      return '';
    },
    async copy() {
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
    controllerLog('emitChange', this.changeSet);
    this.hooks.modelChange(this.changeSet);
    this.changeSet = new Set<ChangeEventType>();
    this.model.record();
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
    this.changeSet.add('selection');
    this.emitChange();
  }
  setCurrentSheetId(id: string): void {
    if (id === this.getCurrentSheetId()) {
      return;
    }
    this.model.setCurrentSheetId(id);
    const pos = this.getActiveCell();
    this.setSheetCell(pos);
    this.computeViewSize();
    this.setScroll(this.getScroll());
  }
  addSheet(): void {
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
  }
  fromJSON(json: WorkBookJSON): void {
    controllerLog('loadJSON', json);
    this.model.fromJSON(json);
    const activeCell = this.getActiveCell();
    this.setSheetCell(activeCell);
    this.computeViewSize();
    this.changeSet.add('content');
    this.emitChange();
  }
  toJSON(): WorkBookJSON {
    return this.model.toJSON();
  }

  setCellValues(
    value: string[][],
    style: Partial<StyleType>[][],
    ranges: IRange[],
  ): void {
    controllerLog('setCellValue', value);
    this.model.setCellValues(value, style, ranges);
    this.changeSet.add('content');
    this.emitChange();
  }
  setCellStyle(style: Partial<StyleType>, ranges: IRange[]): void {
    if (isEmpty(style)) {
      return;
    }
    this.model.setCellStyle(style, ranges);
    this.changeSet.add('content');
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
    this.changeSet.add('content');
    this.emitChange();
  }
  redo() {
    this.model.redo();
    this.changeSet.add('content');
    this.emitChange();
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
    let width = headerSize.width;
    let height = headerSize.height;
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
    for (let item of list) {
      if (item.length > colCount) {
        colCount = item.length;
      }
    }
    if (list.length === 0) {
      return;
    }
    const activeCell = this.getActiveCell();
    const range: IRange = {
      ...activeCell,
      rowCount,
      colCount,
    };
    this.model.setCellValues(list, [], [range]);
    this.changeSet.add('content');
    this.setActiveCell(range);
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
    const resultStyle: Partial<StyleType>[][] = [];
    const rowCount = trList.length;
    let colCount = 0;

    for (const item of trList) {
      const tdList = item.querySelectorAll('td');
      const temp: string[] = [];
      const list: Partial<StyleType>[] = [];
      for (const td of tdList) {
        let itemStyle: Partial<StyleType> = {};
        if (td.className) {
          itemStyle = parseStyle(styleList, '.' + td.className);
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
    if (result.length === 0) {
      return;
    }
    const activeCell = this.getActiveCell();
    const range: IRange = {
      ...activeCell,
      rowCount,
      colCount,
    };
    this.model.setCellValues(result, resultStyle, [range]);
    this.changeSet.add('content');
    this.setActiveCell(range);
  }
  async paste(event?: ClipboardEvent) {
    this.copyRanges = [];
    if (this.cutRanges.length > 0) {
      const [range] = this.cutRanges;
      const result: string[][] = [];
      for (let i = 0; i < range.rowCount; i++) {
        result.push(new Array(range.colCount).fill(''));
      }
      // clear cut data
      this.model.setCellValues(result, [], this.cutRanges);
    }
    let html: string = '';
    let text: string = '';
    if (!event) {
      const data = await this.hooks.paste();
      html = data[HTML_FORMAT];
      text = data[PLAIN_FORMAT];
    } else {
      html = event.clipboardData?.getData(HTML_FORMAT) || '';
      text = event.clipboardData?.getData(PLAIN_FORMAT) || '';
    }
    if (html) {
      this.parseHTML(html);
    } else {
      this.parseText(text);
    }
    if (this.cutRanges.length) {
      this.cutRanges = [];
      this.hooks.copy({
        [PLAIN_FORMAT]: '',
        [HTML_FORMAT]: '',
      });
    }
  }
  private getCopyData(): ClipboardData {
    const { row, col, rowCount, colCount } = this.getActiveCell();
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
    const text = result.map((item) => item.join('\t')).join('\r\n') + '\r\n';
    return {
      [PLAIN_FORMAT]: text,
      [HTML_FORMAT]: htmlData,
    };
  }
  copy(event?: ClipboardEvent): void {
    this.copyRanges = [this.getActiveCell()];
    const data = this.getCopyData();
    if (event) {
      const keyList = Object.keys(data) as ClipboardType[];
      for (const key of keyList) {
        event.clipboardData?.setData(key, data[key]);
      }
    } else {
      this.hooks.copy(data);
    }
    this.changeSet.add('selection');
    this.emitChange();
  }
  cut(event?: ClipboardEvent) {
    this.cutRanges = [this.getActiveCell()];
    this.copy(event);
  }
  getCopyRanges() {
    return this.copyRanges.slice();
  }
  getDomRect(): CanvasOverlayPosition {
    const canvas = this.getMainDom().canvas;
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
}
