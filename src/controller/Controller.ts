import {
  WorkBookJSON,
  StyleType,
  ChangeEventType,
  IController,
  IHooks,
  IModel,
  WorksheetType,
  IWindowSize,
  ScrollValue,
  IRange,
  ResultType,
  ClipboardData,
  ClipboardType,
  DrawingElement,
  IPosition,
  DefinedNameItem,
  WorksheetData,
  EMergeCellType,
} from '@/types';
import {
  PLAIN_FORMAT,
  HTML_FORMAT,
  generateHTML,
  convertToCssString,
  parseHTML,
  parseText,
  generateUUID,
  headerSizeSet,
  ROW_TITLE_HEIGHT,
  COL_TITLE_WIDTH,
  convertPxToPt,
  isSheet,
  isRow,
  isCol,
} from '@/util';
import { numberFormat, isDateFormat, convertDateToNumber } from '@/model';

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
  private copyRange: IRange | undefined = undefined; // cut or copy ranges
  private isCut = false; // cut or copy
  private floatElementUuid = '';
  private isNoChange = false;
  private hooks: IHooks;
  constructor(model: IModel, hooks: IHooks) {
    this.model = model;
    this.hooks = hooks;
  }
  validateDefinedName(name: string): boolean {
    return this.model.validateDefinedName(name);
  }
  validateDrawing(item: DrawingElement): boolean {
    return this.model.validateDrawing(item);
  }
  validateRange(range: IRange): boolean {
    return this.model.validateRange(range);
  }
  getCurrentSheetId(): string {
    return this.model.getCurrentSheetId();
  }
  getSheetList(): WorksheetType[] {
    return this.model.getSheetList();
  }
  getSheetInfo(sheetId?: string) {
    return this.model.getSheetInfo(sheetId);
  }
  batchUpdate(fn: () => boolean, isNoHistory = false): void {
    this.isNoChange = true;
    const result = fn();
    if (isNoHistory) {
      this.changeSet.add('noHistory');
    }
    this.isNoChange = false;
    if (result) {
      this.emitChange();
    }
  }
  emitChange() {
    if (this.isNoChange) {
      return;
    }
    this.model.emitChange(this.changeSet);
    this.changeSet = new Set<ChangeEventType>();
  }
  getActiveRange(r?: IRange) {
    return this.model.getActiveRange(r);
  }
  setNextActiveCell(direction: 'left' | 'right' | 'down' | 'up') {
    const { range, isMerged } = this.getActiveRange();
    let startCol = range.col;
    let startRow = range.row;
    const sheetInfo = this.getSheetInfo(range.sheetId)!;
    const result: IRange = {
      ...range,
      rowCount: 1,
      colCount: 1,
    };
    if (direction === 'left') {
      startCol--;
      while (startCol > 0 && this.getColWidth(startCol).len <= 0) {
        startCol--;
      }
      result.col = startCol;
    }
    if (direction === 'right') {
      if (isMerged) {
        startCol = range.col + range.colCount;
      } else {
        startCol++;
      }
      while (
        startCol < sheetInfo.colCount &&
        this.getColWidth(startCol).len <= 0
      ) {
        startCol++;
      }
      result.col = startCol;
    }
    if (direction === 'up') {
      startRow--;
      while (startRow > 0 && this.getRowHeight(startRow).len <= 0) {
        startRow--;
      }
      result.row = startRow;
    }
    if (direction === 'down') {
      if (isMerged) {
        startRow = range.row + range.rowCount;
      } else {
        startRow++;
      }

      while (
        startRow < sheetInfo.rowCount &&
        this.getRowHeight(startRow).len <= 0
      ) {
        startRow++;
      }
      result.row = startRow;
    }
    this.setActiveRange(result);
  }
  setActiveRange(range: IRange): void {
    this.model.setActiveRange(range);
    this.emitChange();
  }
  setCurrentSheetId(id: string): void {
    this.model.setCurrentSheetId(id);
    this.setScroll(this.getScroll());
  }
  getWorksheet(sheetId?: string): WorksheetData | undefined {
    return this.model.getWorksheet(sheetId);
  }
  setWorksheet(data: WorksheetData, sheetId?: string): void {
    this.model.setWorksheet(data, sheetId);
    this.emitChange();
  }
  addSheet() {
    const result = this.model.addSheet();
    this.setScroll({ ...defaultScrollValue });
    return result;
  }
  deleteSheet = (sheetId?: string): void => {
    this.model.deleteSheet(sheetId);
    this.emitChange();
  };
  updateSheetInfo(data: Partial<WorksheetType>, sheetId?: string): void {
    this.model.updateSheetInfo(data, sheetId);
    this.emitChange();
  }
  hideSheet(sheetId?: string): void {
    this.model.hideSheet(sheetId);
    this.emitChange();
  }
  unhideSheet(sheetId: string): void {
    this.model.unhideSheet(sheetId);
    this.emitChange();
  }
  renameSheet(sheetName: string, sheetId?: string): void {
    this.model.renameSheet(sheetName, sheetId);
    this.emitChange();
  }
  fromJSON(json: WorkBookJSON): void {
    this.model.fromJSON(json);
    this.setScroll({ ...defaultScrollValue });
  }
  toJSON(): WorkBookJSON {
    return this.model.toJSON();
  }

  setCell(
    value: ResultType[][],
    style: Array<Array<Partial<StyleType>>>,
    range: IRange,
  ): void {
    this.model.setCell(value, style, range);
    this.emitChange();
  }
  setCellValue(value: ResultType, range: IRange) {
    const cell = this.getCell(range);
    if (
      isDateFormat(cell?.style?.numberFormat) &&
      typeof value === 'string' &&
      !isNaN(Date.parse(value))
    ) {
      const v = convertDateToNumber(new Date(value));
      this.model.setCellValue(v, range);
    } else {
      this.model.setCellValue(value, range);
    }
    this.emitChange();
  }
  updateCellStyle(style: Partial<StyleType>, range: IRange): void {
    this.model.updateCellStyle(style, range);
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
    this.changeSet.add('scroll');
    this.changeSet.add('undoRedo');
    this.emitChange();
  }
  redo() {
    this.model.redo();
    this.changeSet.add('scroll');
    this.changeSet.add('undoRedo');
    this.emitChange();
  }
  getColWidth(col: number, sheetId?: string) {
    return this.model.getColWidth(col, sheetId);
  }
  setColWidth(col: number, width: number, sheetId?: string): void {
    this.model.setColWidth(col, width, sheetId);
    this.emitChange();
  }
  getRowHeight(row: number, sheetId?: string) {
    return this.model.getRowHeight(row, sheetId);
  }
  setRowHeight(row: number, height: number, sheetId?: string) {
    this.model.setRowHeight(row, height, sheetId);
    this.emitChange();
  }
  getCellSize(range: IRange): IWindowSize {
    range.sheetId = range.sheetId || this.getCurrentSheetId();
    return this.getRangeSize(range);
  }
  private getRangeSize(range: IRange) {
    let { row, col, colCount, rowCount } = range;
    let r = row;
    let c = col;
    let endRow = row + rowCount;
    let endCol = col + colCount;
    const sheetId = range.sheetId || this.getCurrentSheetId();
    const sheetInfo = this.getSheetInfo(sheetId);
    if (!sheetInfo) {
      return { width: 0, height: 0 };
    }
    if (isSheet(range)) {
      c = 0;
      endCol = sheetInfo.colCount;
      r = 0;
      endRow = sheetInfo.rowCount;
    } else if (isCol(range)) {
      r = 0;
      endRow = sheetInfo.rowCount;
    } else if (isRow(range)) {
      c = 0;
      endCol = sheetInfo.colCount;
    }
    let width = 0;
    let height = 0;
    for (; r < endRow; r++) {
      height += this.getRowHeight(r, sheetId).len;
    }
    for (; c < endCol; c++) {
      width += this.getColWidth(c, sheetId).len;
    }
    return { width, height };
  }
  computeCellPosition(range: IRange): IPosition {
    const { row, col } = range;
    const sheetId = range.sheetId || this.model.getCurrentSheetId();
    const size = headerSizeSet.get();
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

  addRow(rowIndex: number, count: number, isAbove = false): void {
    this.model.addRow(rowIndex, count, isAbove);
    this.emitChange();
  }
  addCol(colIndex: number, count: number, isRight = false): void {
    this.model.addCol(colIndex, count, isRight);
    this.emitChange();
  }
  deleteCol(colIndex: number, count: number): void {
    this.model.deleteCol(colIndex, count);
    this.emitChange();
  }
  deleteRow(rowIndex: number, count: number): void {
    this.model.deleteRow(rowIndex, count);
    this.emitChange();
  }
  hideCol(colIndex: number, count: number): void {
    this.model.hideCol(colIndex, count);
    this.emitChange();
  }
  hideRow(rowIndex: number, count: number): void {
    this.model.hideRow(rowIndex, count);
    this.emitChange();
  }
  getScroll(sheetId?: string): ScrollValue {
    const id = sheetId || this.model.getCurrentSheetId();
    const result = this.scrollValue[id] || { ...defaultScrollValue };
    return { ...result };
  }
  setScroll(data: ScrollValue): void {
    const sheetId = this.model.getCurrentSheetId();
    this.scrollValue[sheetId] = {
      ...data,
    };
    if (data.row > 9999) {
      headerSizeSet.set({
        width: Math.floor(COL_TITLE_WIDTH * 2),
        height: ROW_TITLE_HEIGHT,
      });
    } else {
      headerSizeSet.set({
        width: COL_TITLE_WIDTH,
        height: ROW_TITLE_HEIGHT,
      });
    }
    this.changeSet.add('scroll');
    this.emitChange();
  }
  private getPasteRange(textList: Array<Array<ResultType>>): IRange {
    const rowCount = textList.length;
    const activeCell = this.getActiveRange().range;
    const colCount = Math.max(...textList.map((v) => v.length));
    return {
      ...activeCell,
      rowCount,
      colCount,
    };
  }
  private parseText(text: string) {
    const textList = parseText(text);
    const range = this.getPasteRange(textList);
    if (textList.length > 0) {
      this.model.setCell(textList, [], range);
      return range;
    }
    return undefined;
  }
  private parseHTML(htmlString: string) {
    const { textList, styleList, rowMap, colMap } = parseHTML(htmlString);
    const range = this.getPasteRange(textList);
    for (const [row, height] of rowMap.entries()) {
      this.model.setRowHeight(row, height);
    }
    for (const [col, width] of colMap.entries()) {
      this.model.setColWidth(col, width);
    }
    if (textList.length > 0 || styleList.length > 0) {
      this.model.setCell(textList, styleList, range);
      return range;
    }

    return undefined;
  }
  private getCopyData(): ClipboardData {
    const { range: activeCell, isMerged } = this.getActiveRange();
    const { row, col, rowCount, colCount } = activeCell;
    const result: ResultType[][] = [];
    const html: string[] = [];
    let index = 1;
    const classList: string[] = [];
    const currentSheetId = this.model.getCurrentSheetId();
    const colSet = new Set<string>();
    for (let r = row, endRow = row + rowCount; r < endRow; r++) {
      const temp: ResultType[] = [];
      const t: string[] = [];
      const h = convertPxToPt(this.getRowHeight(r).len, '');
      for (let c = col, endCol = col + colCount; c < endCol; c++) {
        const a = this.model.getCell({
          row: r,
          col: c,
          rowCount: 1,
          colCount: 1,
          sheetId: currentSheetId,
        });
        if (!a) {
          continue;
        }
        const str = numberFormat(a.value, a.style?.numberFormat);
        temp.push(str);
        const w = convertPxToPt(this.getColWidth(c).len, '');
        const style = `height=${h} width=${w} style='height:${h}pt;width:${w}pt;'`;
        colSet.add(`<col width=${w} style='width:${w}pt;'>`);
        if (a.style) {
          let text = convertToCssString(a.style);
          if (!str) {
            // copy background-color
            text += 'mso-pattern:black none;';
          }
          const className = `xl${index++}`;
          classList.push(`.${className}{${text}}`);
          t.push(`<td ${style} class="${className}"> ${str} </td>`);
        } else {
          t.push(`<td ${style}> ${str} </td>`);
        }
        if (isMerged) {
          break;
        }
      }
      result.push(temp);
      html.push(`<tr height=${h} style='height:${h}pt;'>${t.join('\n')}</tr>`);
      if (isMerged) {
        break;
      }
    }
    const htmlData = generateHTML(
      classList.join('\n'),
      Array.from(colSet).join('\n') + '\n' + html.join('\n'),
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
        const range = this.getActiveRange().range;
        this.model.updateDrawing(uuid, {
          fromCol: range.col,
          fromRow: range.row,
          marginX: 0,
          marginY: 0,
        });

        this.copyRange = undefined;
        this.isCut = false;
        this.floatElementUuid = '';
        this.emitChange();
        return;
      }
      const list = this.getDrawingList(this.getCurrentSheetId());
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
        this.addDrawing({
          ...item,
          uuid: generateUUID(),
          marginX,
          marginY,
        });
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
    let activeCell = this.getActiveRange().range;

    let check = false;
    if (html) {
      const result = this.parseHTML(html);
      if (result) {
        activeCell = result;
        check = true;
      }
    }
    if (!check && text) {
      const result = this.parseText(text);
      if (result) {
        activeCell = result;
        check = true;
      }
    }
    if (!check && this.copyRange) {
      activeCell = this.model.pasteRange(this.copyRange, this.isCut);
    }
    if (this.isCut) {
      this.copyRange = undefined;
      this.isCut = false;
      this.hooks.copyOrCut(
        {
          [PLAIN_FORMAT]: '',
          [HTML_FORMAT]: '',
        },
        'copy',
      );
    }
    this.setActiveRange(activeCell);
  }
  copy(event?: ClipboardEvent): void {
    this.copyRange = this.getActiveRange().range;
    this.isCut = false;
    this.baseCopy('copy', event);
  }
  cut(event?: ClipboardEvent) {
    this.copyRange = this.getActiveRange().range;
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
  getCopyRange() {
    if (this.floatElementUuid) {
      return undefined;
    }
    if (this.copyRange) {
      return { ...this.copyRange };
    }
    return undefined;
  }
  deleteAll(sheetId?: string): void {
    this.model.deleteAll(sheetId);
    this.emitChange();
  }
  getDefineName(range: IRange): string {
    return this.model.getDefineName(range);
  }
  getDefineNameList(): DefinedNameItem[] {
    return this.model.getDefineNameList();
  }
  setDefineName(range: IRange, name: string) {
    const r = this.model.setDefineName(range, name);
    this.emitChange();
    return r;
  }
  checkDefineName(name: string): IRange | undefined {
    return this.model.checkDefineName(name);
  }
  getDrawingList(sheetId?: string): DrawingElement[] {
    return this.model.getDrawingList(sheetId);
  }
  addDrawing(data: DrawingElement) {
    this.model.addDrawing(data);
    this.emitChange();
  }
  updateDrawing(uuid: string, value: Partial<DrawingElement>) {
    this.model.updateDrawing(uuid, value);
    this.emitChange();
  }
  deleteDrawing(uuid: string) {
    this.model.deleteDrawing(uuid);
    this.emitChange();
  }
  getMergeCellList(sheetId?: string) {
    return this.model.getMergeCellList(sheetId);
  }
  addMergeCell(range: IRange, type?: EMergeCellType): void {
    this.model.addMergeCell(range, type);
    this.emitChange();
  }
  deleteMergeCell(range: IRange): void {
    this.model.deleteMergeCell(range);
    this.emitChange();
  }
  setFloatElementUuid(uuid: string) {
    if (this.floatElementUuid && !uuid) {
      this.copyRange = undefined;
    }
    this.floatElementUuid = uuid;
  }
}
