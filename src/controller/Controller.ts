import {
  Coordinate,
  WorkBookJSON,
  CellInfo,
  StyleType,
  ChangeEventType,
  IController,
  IHooks,
  IModel,
  WorksheetType,
  IHistory,
  IWindowSize,
  CanvasOverlayPosition,
  ScrollValue,
  IRange,
  ResultType,
  ClipboardData,
  ClipboardType,
  EUnderLine,
} from '@/types';
import {
  controllerLog,
  Range,
  isEmpty,
  PLAIN_FORMAT,
  HTML_FORMAT,
  generateHTML,
} from '@/util';

const CELL_HEIGHT = 19;
const CELL_WIDTH = 68;
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

function convertCanvasStyleToString(style: Partial<StyleType>): string {
  let result = '';
  if (style.fontColor) {
    result += `color:${style.fontColor};`;
  }
  if (style.fillColor) {
    result += `background-color:${style.fillColor};`;
  }
  if (style.fontSize) {
    result += `font-size:${style.fontSize}pt;`;
  }
  if (style.fontFamily) {
    result += `font-family:${style.fontFamily};`;
  }
  if (style.isItalic) {
    result += `font-style:italic;`;
  }
  if (style.isBold) {
    result += `font-weight:700;`;
  }
  if (style.isWrapText) {
    result += `white-space:normal;`;
  }
  if (style.underline) {
    result += 'text-decoration:underline;';
    if (style.underline === EUnderLine.DOUBLE) {
      result += 'text-decoration-style: double;';
    } else {
      result += 'text-decoration-style: single;';
    }
  }

  return result;
}

function convertCSSStyleToCanvasStyle(
  style: Partial<CSSStyleDeclaration>,
): Partial<StyleType> {
  const {
    color,
    backgroundColor,
    fontSize,
    fontFamily,
    fontStyle,
    fontWeight,
    whiteSpace,
    textDecoration,
  } = style;
  const result: Partial<StyleType> = {};
  if (color) {
    result.fontColor = color;
  }
  if (backgroundColor) {
    result.fillColor = backgroundColor;
  }
  if (fontSize) {
    const size = parseInt(fontSize, 10);
    if (!isNaN(size)) {
      result.fontSize = size;
    }
  }
  if (fontFamily) {
    result.fontFamily = fontFamily;
  }
  if (fontStyle === 'italic') {
    result.isItalic = true;
  }
  if (fontWeight && ['700', '800', '900', 'bold'].includes(fontWeight)) {
    result.isBold = true;
  }
  if (
    whiteSpace &&
    [
      'normal',
      'pre-wrap',
      'pre-line',
      'break-spaces',
      'revert',
      'unset',
    ].includes(whiteSpace)
  ) {
    result.isWrapText = true;
  }
  if (textDecoration === 'underline') {
    result.underline = EUnderLine.SINGLE;
    // TODO: parse double underline
  }
  return result;
}

const parseStyle = (
  styleList: NodeListOf<HTMLStyleElement>,
  selector: string,
): Partial<StyleType> => {
  for (const item of styleList) {
    if (!item.sheet?.cssRules) {
      continue;
    }
    for (const rule of item.sheet?.cssRules) {
      if (rule instanceof CSSStyleRule && rule.selectorText === selector) {
        return convertCSSStyleToCanvasStyle(rule.style);
      }
    }
  }
  return {};
};

export class Controller implements IController {
  private scrollValue: Record<string, ScrollValue> = {};
  private model: IModel;
  private ranges: Array<Range> = [];
  private changeSet = new Set<ChangeEventType>();
  private copyRanges: Array<Range> = [];
  private cutRanges: Array<Range> = [];
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
  private domRect: CanvasOverlayPosition = {
    top: 0,
    left: 0,
    width: 0,
    height: 0,
  };
  private history: IHistory;
  private readonly rowMap: Map<number, number> = new Map([]);
  private readonly colMap: Map<number, number> = new Map([]);
  private viewSize = {
    width: 0,
    height: 0,
  };
  private headerSize = {
    width: COL_TITLE_WIDTH,
    height: ROW_TITLE_HEIGHT,
  };
  constructor(model: IModel, history: IHistory) {
    this.model = model;
    this.ranges = [new Range(0, 0, 1, 1, this.getCurrentSheetId())];
    this.history = history;
  }
  getCurrentSheetId(): string {
    return this.model.getCurrentSheetId();
  }
  getSheetList(): WorkBookJSON['workbook'] {
    return this.model.getSheetList();
  }
  getCellsContent(sheetId: string): Coordinate[] {
    return this.model.getCellsContent(sheetId);
  }
  getSheetInfo(sheetId: string): WorksheetType {
    return this.model.getSheetInfo(sheetId);
  }
  getRanges(): Range[] {
    return this.ranges;
  }
  setHooks(hooks: IHooks): void {
    this.hooks = hooks;
  }
  private emitChange(recordHistory = true): void {
    controllerLog('emitChange', this.changeSet);
    if (recordHistory) {
      this.history.onChange(this.toJSON());
    }
    this.hooks.modelChange(this.changeSet);
    this.changeSet = new Set<ChangeEventType>();
  }
  getActiveCell(): Coordinate {
    const { activeCell } = this.getSheetInfo(this.model.getCurrentSheetId());
    return {
      ...activeCell,
    };
  }
  private setRanges(
    row: number,
    col: number,
    rowCount: number,
    colCount: number,
  ) {
    const sheetInfo = this.model.getSheetInfo(this.model.getCurrentSheetId());
    if (
      row < 0 ||
      col < 0 ||
      row >= sheetInfo.rowCount ||
      col >= sheetInfo.colCount
    ) {
      return false;
    }
    this.model.setActiveCell(row, col, rowCount, colCount);
    this.ranges = [
      new Range(row, col, rowCount, colCount, this.getCurrentSheetId()),
    ];
    return true;
  }
  setActiveCell(
    row: number,
    col: number,
    rowCount: number,
    colCount: number,
  ): void {
    if (!this.setRanges(row, col, rowCount, colCount)) {
      return;
    }
    this.changeSet.add('selectionChange');
    this.emitChange();
  }
  setCurrentSheetId(id: string): void {
    if (id === this.getCurrentSheetId()) {
      return;
    }
    this.model.setCurrentSheetId(id);
    const pos = this.getActiveCell();
    this.setRanges(pos.row, pos.col, 1, 1);
    this.computeViewSize();
    this.setScroll(this.getScroll());
  }
  addSheet(): void {
    this.model.addSheet();
    this.computeViewSize();
    this.setRanges(0, 0, 1, 1);
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
    this.setRanges(0, 0, 1, 1);
    this.computeViewSize();
    this.changeSet.add('contentChange');
    this.emitChange(false);
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
    this.changeSet.add('contentChange');
    this.emitChange();
  }
  setCellStyle(style: Partial<StyleType>, ranges: IRange[]): void {
    if (isEmpty(style)) {
      return;
    }
    this.model.setCellStyle(style, ranges);
    this.changeSet.add('contentChange');
    this.emitChange();
  }
  getCell = (data: Coordinate): CellInfo => {
    const { row, col } = data;
    const { model } = this;
    const { value, formula, style } = model.queryCell(row, col);
    return {
      value,
      row,
      col,
      formula,
      style,
    };
  };
  canRedo(): boolean {
    return this.history.canRedo();
  }
  canUndo(): boolean {
    return this.history.canUndo();
  }
  undo(): void {
    const result = this.history.undo(this.toJSON());
    if (result) {
      this.fromJSON(result);
    }
  }
  redo(): void {
    const result = this.history.redo(this.toJSON());
    if (result) {
      this.fromJSON(result);
    }
  }
  getColWidth(col: number): number {
    return this.colMap.get(col) || CELL_WIDTH;
  }
  setColWidth(col: number, width: number): void {
    this.colMap.set(col, width);
    this.computeViewSize();
    this.changeSet.add('contentChange');
  }
  getRowHeight(row: number): number {
    return this.rowMap.get(row) || CELL_HEIGHT;
  }
  setRowHeight(row: number, height: number) {
    this.rowMap.set(row, height);
    this.computeViewSize();
    this.changeSet.add('contentChange');
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
    this.changeSet.add('contentChange');
    this.emitChange();
  }
  addCol(colIndex: number, count: number): void {
    this.model.addCol(colIndex, count);
    this.changeSet.add('contentChange');
    this.emitChange();
  }
  deleteCol(colIndex: number, count: number): void {
    this.model.deleteCol(colIndex, count);
    this.changeSet.add('contentChange');
    this.emitChange();
  }
  deleteRow(rowIndex: number, count: number): void {
    this.model.deleteRow(rowIndex, count);
    this.changeSet.add('contentChange');
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
    this.changeSet.add('contentChange');
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
    this.model.setCellValues(list, [], this.ranges);
    this.changeSet.add('contentChange');
    this.setActiveCell(activeCell.row, activeCell.col, rowCount, colCount);
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
    this.model.setCellValues(result, resultStyle, this.ranges);
    this.changeSet.add('contentChange');
    this.setActiveCell(activeCell.row, activeCell.col, rowCount, colCount);
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
    const [range] = this.ranges;
    const { row, col, rowCount, colCount } = range;
    const result: ResultType[][] = [];
    const html: string[][] = [];
    let index = 1;
    const classList: string[] = [];
    for (let r = row, endRow = row + rowCount; r < endRow; r++) {
      const temp: ResultType[] = [];
      const t: string[] = [];
      for (let c = col, endCol = col + colCount; c < endCol; c++) {
        const a = this.model.queryCell(r, c);
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
    this.copyRanges = this.ranges.slice();
    const data = this.getCopyData();
    if (event) {
      const keyList = Object.keys(data) as ClipboardType[];
      for (const key of keyList) {
        event.clipboardData?.setData(key, data[key]);
      }
    } else {
      this.hooks.copy(data);
    }
    this.changeSet.add('selectionChange');
    this.emitChange();
  }
  cut(event?: ClipboardEvent) {
    this.cutRanges = this.ranges.slice();
    this.copy(event);
  }
  getCopyRanges() {
    return this.copyRanges.slice();
  }
  setDomRect(data: CanvasOverlayPosition): void {
    this.domRect = {
      ...data,
    };
  }
  getDomRect(): CanvasOverlayPosition {
    return {
      ...this.domRect,
    };
  }
}
