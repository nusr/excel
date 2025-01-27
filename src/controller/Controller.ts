import {
  type ModelJSON,
  type StyleType,
  type ChangeEventType,
  type IController,
  type IHooks,
  type IModel,
  type WorksheetType,
  type IWindowSize,
  type ScrollValue,
  type IRange,
  type ResultType,
  type ClipboardData,
  type DrawingElement,
  type IPosition,
  type DefinedNameItem,
  type WorksheetData,
  type EMergeCellType,
  type CustomClipboardData,
  type AutoFilterItem,
  type CanvasOverlayPosition,
  SYNC_FLAG,
  type ControllerEventEmitterType,
} from '../types';
import {
  PLAIN_FORMAT,
  HTML_FORMAT,
  generateHTML,
  convertToCssString,
  parseHTML,
  parseText,
  ROW_TITLE_HEIGHT,
  COL_TITLE_WIDTH,
  convertPxToPt,
  isSheet,
  isRow,
  isCol,
  CUSTOM_FORMAT,
  convertFileToTextOrBase64,
  getImageSize,
  convertBase64toBlob,
  IMAGE_FORMAT,
  formatCustomData,
  controllerLog,
  copyOrCut,
  paste,
  EventEmitter,
} from '../util';
import { numberFormat, isDateFormat, convertDateToNumber } from '../formula';
import { transaction } from './decorator';
import { v4 } from 'uuid';

const defaultScrollValue: Omit<ScrollValue, 'row' | 'col'> = {
  top: 0,
  left: 0,
  scrollLeft: 0,
  scrollTop: 0,
};

export class Controller
  extends EventEmitter<ControllerEventEmitterType>
  implements IController
{
  private scrollValue: Record<string, Omit<ScrollValue, 'row' | 'col'>> = {};
  readonly model: IModel;
  private changeSet = new Set<ChangeEventType>();
  private floatElementUuid = '';
  private copyRange: IRange | undefined = undefined;
  private isCut = false;
  private readonly hooks: IHooks;
  private sheetViewSize: IWindowSize | null = null;
  private readonly = false;
  private canvasSize: CanvasOverlayPosition = {
    top: 0,
    left: 0,
    width: 0,
    height: 0,
  };
  constructor(model: IModel, hooks: IHooks) {
    super();
    this.model = model;
    this.hooks = hooks;
  }
  setReadOnly(readOnly: boolean): void {
    this.readonly = readOnly;
  }
  getReadOnly(): boolean {
    return this.readonly;
  }
  setCanvasSize(size: CanvasOverlayPosition) {
    this.canvasSize = { ...size };
  }
  getCanvasSize(): CanvasOverlayPosition {
    return { ...this.canvasSize };
  }
  private setSheetViewSize() {
    const headerSize = this.getHeaderSize();
    const sheetInfo = this.getSheetInfo();
    if (!sheetInfo) {
      return;
    }
    let { width, height } = headerSize;
    for (let i = 0; i < sheetInfo.colCount; i++) {
      const t = this.getCol(i);
      width += t.isHide ? 0 : t.len;
    }
    for (let i = 0; i < sheetInfo.rowCount; i++) {
      const t = this.getRow(i);
      height += t.isHide ? 0 : t.len;
    }
    this.sheetViewSize = {
      width,
      height,
    };
  }
  getSheetViewSize() {
    if (!this.sheetViewSize) {
      this.setSheetViewSize();
    }
    return this.sheetViewSize || { width: 0, height: 0 };
  }
  getHeaderSize() {
    const { row } = this.model.getScroll();
    if (row > 9999) {
      return {
        width: Math.floor(COL_TITLE_WIDTH * 2),
        height: ROW_TITLE_HEIGHT,
      };
    }
    return {
      width: COL_TITLE_WIDTH,
      height: ROW_TITLE_HEIGHT,
    };
  }
  clearHistory() {
    this.model.clearHistory();
  }
  getHooks() {
    return this.hooks;
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
  transaction = <T>(fn: () => T, origin?: any): T => {
    return this.model.transaction(fn, origin);
  };
  emitChange() {
    const changeSet = new Set(this.changeSet);
    this.changeSet = new Set<ChangeEventType>();
    if (changeSet.has('customHeight') || changeSet.has('customWidth')) {
      this.setSheetViewSize();
    }
    if (
      changeSet.has('worksheets') ||
      changeSet.has('definedNames') ||
      changeSet.has('currentSheetId')
    ) {
      this.model.computeFormulas().then((result) => {
        if (result) {
          controllerLog('computeFormulas');
          this.emit('renderChange', { changeSet: new Set(['worksheets']) });
        }
      });
    }
    if (changeSet.size > 0) {
      controllerLog('emitChange', changeSet);
      this.emit('renderChange', { changeSet });
    }
  }
  getActiveRange(r?: IRange) {
    return this.model.getActiveRange(r);
  }
  setNextActiveCell(direction: 'left' | 'right' | 'down' | 'up') {
    const { range, isMerged } = this.getActiveRange();
    let startCol = range.col;
    let startRow = range.row;
    const sheetInfo = this.getSheetInfo(range.sheetId);
    if (!sheetInfo) {
      return;
    }
    const result: IRange = {
      ...range,
      rowCount: 1,
      colCount: 1,
    };
    if (direction === 'left') {
      startCol--;
      while (startCol > 0 && this.getColWidth(startCol) <= 0) {
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
      while (startCol < sheetInfo.colCount && this.getColWidth(startCol) <= 0) {
        startCol++;
      }
      result.col = startCol;
    }
    if (direction === 'up') {
      startRow--;
      while (startRow > 0 && this.getRowHeight(startRow) <= 0) {
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
        this.getRowHeight(startRow) <= 0
      ) {
        startRow++;
      }
      result.row = startRow;
    }
    this.setActiveRange(result);
  }
  setActiveRange(range: IRange): void {
    this.model.setActiveRange(range);
    this.changeSet.add('rangeMap');
    const r = {
      row: range.row,
      col: range.col,
      sheetId: range.sheetId || this.model.getCurrentSheetId(),
      rowCount: range.rowCount,
      colCount: range.colCount,
    };
    this.emit('rangeChange', r);
    this.emitChange();
  }
  setCurrentSheetId(id: string): void {
    this.model.setCurrentSheetId(id);
    this.changeSet.add('currentSheetId');
    this.changeSet.add('customHeight');
    this.changeSet.add('scroll');
    this.emitChange();
  }

  getWorksheet(sheetId?: string) {
    return this.model.getWorksheet(sheetId);
  }
  @transaction()
  setWorksheet(data: WorksheetData): void {
    this.model.setWorksheet(data);
    this.changeSet.add('worksheets');
    this.changeSet.add('cellStyle');
    this.emitChange();
  }
  @transaction()
  addSheet() {
    const result = this.model.addSheet();
    this.changeSet.add('workbook');
    this.changeSet.add('customHeight');
    this.changeSet.add('currentSheetId');
    this.emitChange();
    return result;
  }
  @transaction(SYNC_FLAG.SKIP_UNDO_REDO)
  addFirstSheet() {
    return this.addSheet();
  }
  @transaction()
  deleteSheet(sheetId?: string) {
    this.model.deleteSheet(sheetId);
    this.changeSet.add('workbook');
    this.changeSet.add('customHeight');
    this.changeSet.add('currentSheetId');
    this.emitChange();
  }
  @transaction()
  updateSheetInfo(data: Partial<WorksheetType>, sheetId?: string): void {
    this.model.updateSheetInfo(data, sheetId);
    this.changeSet.add('workbook');
    this.changeSet.add('customHeight');
    this.emitChange();
  }
  @transaction()
  hideSheet(sheetId?: string): void {
    this.model.hideSheet(sheetId);
    this.changeSet.add('workbook');
    this.changeSet.add('customHeight');
    this.changeSet.add('currentSheetId');
    this.emitChange();
  }
  @transaction()
  unhideSheet(sheetId: string): void {
    this.model.unhideSheet(sheetId);
    this.changeSet.add('workbook');
    this.changeSet.add('customHeight');
    this.changeSet.add('currentSheetId');
    this.emitChange();
  }
  @transaction()
  renameSheet(sheetName: string, sheetId?: string): void {
    this.model.renameSheet(sheetName, sheetId);
    this.changeSet.add('workbook');
    this.emitChange();
  }
  @transaction(SYNC_FLAG.SKIP_UNDO_REDO)
  fromJSON(json: ModelJSON): void {
    this.changeSet.add('currentSheetId');
    this.changeSet.add('cellStyle');
    this.changeSet.add('definedNames');
    this.changeSet.add('mergeCells');
    this.changeSet.add('autoFilter');
    this.changeSet.add('drawings');
    this.changeSet.add('workbook');
    this.changeSet.add('worksheets');
    this.changeSet.add('rangeMap');
    this.changeSet.add('scroll');
    this.changeSet.add('customHeight');
    this.changeSet.add('customWidth');
    this.model.fromJSON(json);
    this.emitChange();
  }
  toJSON(): ModelJSON {
    return this.model.toJSON();
  }
  @transaction()
  setCell(
    value: ResultType[][],
    style: Array<Array<Partial<StyleType>>>,
    range: IRange,
  ): void {
    this.model.setCell(value, style, range);
    this.changeSet.add('worksheets');
    this.changeSet.add('cellStyle');
    this.emitChange();
  }
  @transaction()
  deleteCell(range: IRange) {
    this.model.deleteCell(range);
    this.changeSet.add('worksheets');
    this.changeSet.add('cellStyle');
    this.emitChange();
  }
  @transaction()
  setCellValue(value: ResultType, range: IRange) {
    const cell = this.getCell(range);
    if (
      isDateFormat(cell?.numberFormat) &&
      typeof value === 'string' &&
      !isNaN(Date.parse(value))
    ) {
      const v = convertDateToNumber(new Date(value));
      if (v === null) {
        return;
      }
      this.model.setCellValue(v, range);
    } else {
      this.model.setCellValue(value, range);
    }
    this.changeSet.add('worksheets');
    this.emitChange();
  }
  @transaction()
  updateCellStyle(style: Partial<StyleType>, range: IRange): void {
    this.model.updateCellStyle(style, range);
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
    this.changeSet.add('undo');
    this.emitChange();
  }
  redo() {
    this.model.redo();
    this.changeSet.add('redo');
    this.emitChange();
  }
  getCol(col: number, sheetId?: string) {
    return this.model.getCol(col, sheetId);
  }
  getColWidth(col: number, sheetId?: string): number {
    const data = this.model.getCol(col, sheetId);
    return data.isHide ? 0 : data.len;
  }
  @transaction()
  setColWidth(col: number, width: number, sheetId?: string): void {
    this.model.setColWidth(col, width, sheetId);
    this.changeSet.add('customWidth');
    this.emitChange();
  }
  getRow(row: number, sheetId?: string) {
    return this.model.getRow(row, sheetId);
  }
  getRowHeight(row: number, sheetId?: string): number {
    const data = this.model.getRow(row, sheetId);
    return data.isHide ? 0 : data.len;
  }
  @transaction()
  setRowHeight(row: number, height: number, sheetId?: string) {
    this.model.setRowHeight(row, height, sheetId);
    this.changeSet.add('customHeight');
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
      height += this.getRowHeight(r, sheetId);
    }
    for (; c < endCol; c++) {
      width += this.getColWidth(c, sheetId);
    }
    return { width, height };
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
        resultX += this.getColWidth(c, sheetId);
        c++;
      }
    } else {
      resultX = -size.width;
      while (c > col) {
        resultX -= this.getColWidth(c, sheetId);
        c--;
      }
    }
    if (row >= scroll.row) {
      while (r < row) {
        resultY += this.getRowHeight(r, sheetId);
        r++;
      }
    } else {
      resultY = -size.height;
      while (r > row) {
        resultY -= this.getRowHeight(r, sheetId);
        r--;
      }
    }
    return {
      top: resultY,
      left: resultX,
    };
  }
  @transaction()
  addRow(rowIndex: number, count: number, isAbove = false): void {
    this.model.addRow(rowIndex, count, isAbove);
    this.changeSet.add('customHeight');
    this.emitChange();
  }
  @transaction()
  addCol(colIndex: number, count: number, isRight = false): void {
    this.model.addCol(colIndex, count, isRight);
    this.changeSet.add('customWidth');
    this.emitChange();
  }
  @transaction()
  deleteCol(colIndex: number, count: number): void {
    this.model.deleteCol(colIndex, count);
    this.changeSet.add('customWidth');
    this.emitChange();
  }
  @transaction()
  deleteRow(rowIndex: number, count: number): void {
    this.model.deleteRow(rowIndex, count);
    this.changeSet.add('customHeight');
    this.emitChange();
  }
  @transaction()
  hideCol(colIndex: number, count: number): void {
    this.model.hideCol(colIndex, count);
    this.changeSet.add('customWidth');
    this.emitChange();
  }
  @transaction()
  hideRow(rowIndex: number, count: number): void {
    this.model.hideRow(rowIndex, count);
    this.changeSet.add('customHeight');
    this.emitChange();
  }
  @transaction()
  unhideRow(rowIndex: number, count: number): void {
    this.model.unhideRow(rowIndex, count);
    this.changeSet.add('customHeight');
    this.emitChange();
  }
  @transaction()
  unhideCol(colIndex: number, count: number): void {
    this.model.unhideCol(colIndex, count);
    this.changeSet.add('customWidth');
    this.emitChange();
  }
  getScroll(sheetId?: string): ScrollValue {
    const id = sheetId || this.model.getCurrentSheetId();
    const data = this.model.getScroll(id);
    const result = this.scrollValue[id] || { ...defaultScrollValue };
    return { ...result, ...data };
  }

  setScroll(data: ScrollValue, sheetId?: string): void {
    const id = sheetId || this.model.getCurrentSheetId();
    let { row, col, ...realData } = data;

    const sheetInfo = this.getSheetInfo(id);
    if (sheetInfo) {
      if (row < 0) {
        row = 0;
      } else if (row >= sheetInfo.rowCount - 1) {
        row = sheetInfo.rowCount - 1;
      }
      if (col < 0) {
        col = 0;
      } else if (col >= sheetInfo.colCount - 1) {
        col = sheetInfo.colCount - 1;
      }
    }

    this.scrollValue[id] = realData;

    const check = this.model.setScroll({
      row,
      col,
    });
    if (check) {
      this.changeSet.add('scroll');
    }
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
  private async getCopyData(
    type: 'cut' | 'copy',
  ): Promise<[ClipboardData, string]> {
    const { range: activeCell, isMerged } = this.getActiveRange();
    const { row, col, rowCount, colCount } = activeCell;
    const result: ResultType[][] = [];
    const trList: string[] = [];
    let index = 1;
    const classList: string[] = [];
    const currentSheetId = this.model.getCurrentSheetId();
    const colSet = new Set<string>();
    for (let r = row, endRow = row + rowCount; r < endRow; r++) {
      const temp: ResultType[] = [];
      const t: string[] = [];
      const h = convertPxToPt(this.getRow(r).len, '');
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
        const str = numberFormat(a.value, a?.numberFormat);
        temp.push(str);
        const w = convertPxToPt(this.getCol(c).len, '');
        const style = `height=${h} width=${w} style='height:${h}pt;width:${w}pt;'`;
        colSet.add(`<col width=${w} style='width:${w}pt;'>`);
        if (a) {
          let text = convertToCssString(a);
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
      trList.push(
        `<tr height=${h} style='height:${h}pt;'>${t.join('\n')}</tr>`,
      );
      if (isMerged) {
        break;
      }
    }
    const customData: CustomClipboardData = {
      range: activeCell,
      type,
      floatElementUuid: this.floatElementUuid,
    };
    const customDataStr = JSON.stringify(customData);
    const htmlData = generateHTML(
      classList.join('\n'),
      `
      ${Array.from(colSet).join('\n')}
      ${trList.join('\n')}`,
      formatCustomData(customDataStr),
    );
    const text = `${result.map((item) => item.join('\t')).join('\r\n')}\r\n`;

    const clipboardData: ClipboardData = {
      [PLAIN_FORMAT]: text,
      [HTML_FORMAT]: htmlData,
      [CUSTOM_FORMAT]: customData,
      [IMAGE_FORMAT]: null,
    };

    let imageData = '';

    if (this.floatElementUuid) {
      const list = this.getDrawingList(this.getCurrentSheetId());
      const item = list.find((v) => v.uuid === this.floatElementUuid);
      if (item) {
        if (item.type === 'floating-picture') {
          const dom = document.querySelector<HTMLCanvasElement>(
            `canvas[data-uuid="${item.uuid}"]`,
          );
          if (dom) {
            dom.toBlob((blob) => {
              if (blob) {
                clipboardData[IMAGE_FORMAT] = blob;
              }
            });
            imageData = dom.toDataURL();
          }
        } else {
          imageData = item.imageSrc || '';
          clipboardData[IMAGE_FORMAT] = convertBase64toBlob(imageData);
        }
      }
    }

    return [clipboardData, imageData];
  }
  private pasteFloatElement(floatElementUuid: string, isCut: boolean) {
    if (!floatElementUuid) {
      return false;
    }

    if (isCut) {
      const range = this.getActiveRange().range;
      this.model.updateDrawing(floatElementUuid, {
        fromCol: range.col,
        fromRow: range.row,
        marginX: 0,
        marginY: 0,
      });
      this.floatElementUuid = '';
      this.isCut = false;
      this.emitChange();
      return true;
    }
    const list = this.getDrawingList(this.getCurrentSheetId());
    const item = list.find((v) => v.uuid === floatElementUuid);
    if (!item) {
      return false;
    }

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
      uuid: v4(),
      marginX,
      marginY,
    });
    return true;
  }
  @transaction()
  async paste(event?: ClipboardEvent): Promise<void> {
    if (this.floatElementUuid) {
      if (this.pasteFloatElement(this.floatElementUuid, this.isCut)) {
        this.changeSet.add('drawings');
        this.emitChange();
        return Promise.resolve();
      }
    }
    await this.basePaste(event);
    this.changeSet.add('worksheets');
    this.changeSet.add('cellStyle');
    this.emitChange();
  }
  private async basePaste(event?: ClipboardEvent): Promise<void> {
    let html = '';
    let text = '';
    let custom: CustomClipboardData | null = null;
    let files: FileList | null = null;
    if (!event) {
      const data = await paste();
      html = data[HTML_FORMAT];
      text = data[PLAIN_FORMAT];
      if (data[CUSTOM_FORMAT]) {
        custom = data[CUSTOM_FORMAT];
      }
      if (custom && custom.type === 'cut') {
        copyOrCut(
          {
            [PLAIN_FORMAT]: '',
            [HTML_FORMAT]: '',
            [CUSTOM_FORMAT]: null,
            [IMAGE_FORMAT]: null,
          },
          'copy',
        );
      }
    } else {
      html = event.clipboardData?.getData(HTML_FORMAT) || '';
      text = event.clipboardData?.getData(PLAIN_FORMAT) || '';
      const t = event.clipboardData?.getData(CUSTOM_FORMAT) || '';
      if (t) {
        custom = JSON.parse(t);
      }
      if (custom && custom.type === 'cut') {
        event.clipboardData?.setData(HTML_FORMAT, '');
        event.clipboardData?.setData(PLAIN_FORMAT, '');
        event.clipboardData?.setData(CUSTOM_FORMAT, '');
        event.clipboardData?.setData(IMAGE_FORMAT, '');
      }
      if (event.clipboardData?.files) {
        files = event.clipboardData?.files;
      }
    }
    if (files) {
      const list: DrawingElement[] = [];
      for (const file of files) {
        if (file.size <= 0) {
          continue;
        }
        let fileName = file.name;
        const fileType = file.type.slice('image/'.length);
        fileName = fileName.slice(0, -(fileType.length + 1));

        const base64 = await convertFileToTextOrBase64(file, true);
        if (!base64) {
          continue;
        }
        const size = await getImageSize(base64);
        const range = this.getActiveRange().range;
        list.push({
          width: size.width,
          height: size.height,
          originHeight: size.height,
          originWidth: size.width,
          title: fileName,
          type: 'floating-picture',
          uuid: v4(),
          imageSrc: base64,
          sheetId: range.sheetId,
          fromRow: range.row,
          fromCol: range.col,
          marginX: 0,
          marginY: 0,
        });
      }
      if (list.length > 0) {
        this.addDrawing(...list);
        return;
      }
    }
    if (custom && custom.floatElementUuid) {
      if (
        this.pasteFloatElement(custom.floatElementUuid, custom.type === 'cut')
      ) {
        return;
      }
    }
    if (custom) {
      const activeCell = this.model.pasteRange(
        custom.range,
        custom.type === 'cut',
      );
      this.setActiveRange(activeCell);
      return;
    }
    html = html.trim();
    text = text.trim();
    if (html) {
      const result = this.parseHTML(html);
      if (result) {
        this.setActiveRange(result);
        return;
      }
    }
    if (text) {
      const result = this.parseText(text);
      if (result) {
        this.setActiveRange(result);
        return;
      }
    }
    if (this.copyRange) {
      const activeCell = this.model.pasteRange(this.copyRange, this.isCut);
      this.setActiveRange(activeCell);
      if (this.isCut) {
        this.copyRange = undefined;
        this.isCut = false;
      }
      return;
    }
  }
  copy(event?: ClipboardEvent): Promise<void> {
    this.copyRange = this.getActiveRange().range;
    this.isCut = false;
    return this.baseCopy('copy', event);
  }
  cut(event?: ClipboardEvent): Promise<void> {
    this.copyRange = this.getActiveRange().range;
    this.isCut = true;
    return this.baseCopy('cut', event);
  }
  private async baseCopy(type: 'cut' | 'copy', event?: ClipboardEvent) {
    const [data, imageData] = await this.getCopyData(type);
    if (event) {
      event.clipboardData?.setData(HTML_FORMAT, data[HTML_FORMAT]);
      event.clipboardData?.setData(PLAIN_FORMAT, data[PLAIN_FORMAT]);
      event.clipboardData?.setData(
        CUSTOM_FORMAT,
        data[CUSTOM_FORMAT] ? JSON.stringify(data[CUSTOM_FORMAT]) : '',
      );
      event.clipboardData?.setData(IMAGE_FORMAT, imageData);
    } else {
      copyOrCut(data, type);
    }
    this.changeSet.add('antLine');

    this.emitChange();
  }
  getCopyRange() {
    return this.copyRange;
  }
  @transaction()
  setCopyRange(range: IRange | undefined) {
    this.copyRange = range;
  }
  @transaction()
  deleteAll(sheetId?: string): void {
    this.model.deleteAll(sheetId);
    this.changeSet.add('definedNames');
    this.changeSet.add('mergeCells');
    this.changeSet.add('cellStyle');
    this.changeSet.add('autoFilter');
    this.changeSet.add('drawings');
    this.changeSet.add('customHeight');
    this.changeSet.add('customWidth');
    this.changeSet.add('worksheets');
    this.emitChange();
  }
  getDefineName(range: IRange): string {
    return this.model.getDefineName(range);
  }
  getDefineNameList(): DefinedNameItem[] {
    return this.model.getDefineNameList();
  }
  @transaction()
  setDefineName(range: IRange, name: string) {
    const r = this.model.setDefineName(range, name);
    this.changeSet.add('definedNames');
    this.emitChange();
    return r;
  }
  checkDefineName(name: string): IRange | undefined {
    return this.model.checkDefineName(name);
  }
  getDrawingList(sheetId?: string): DrawingElement[] {
    return this.model.getDrawingList(sheetId);
  }
  @transaction()
  addDrawing(...data: DrawingElement[]) {
    this.model.addDrawing(...data);
    this.changeSet.add('drawings');
    this.emitChange();
  }
  @transaction()
  updateDrawing(uuid: string, value: Partial<DrawingElement>) {
    this.model.updateDrawing(uuid, value);
    this.changeSet.add('drawings');
    this.emitChange();
  }
  @transaction()
  deleteDrawing(uuid: string) {
    this.model.deleteDrawing(uuid);
    this.changeSet.add('drawings');
    this.emitChange();
  }
  getMergeCellList(sheetId?: string) {
    return this.model.getMergeCellList(sheetId);
  }
  @transaction()
  addMergeCell(range: IRange, type?: EMergeCellType): void {
    this.model.addMergeCell(range, type);
    this.changeSet.add('mergeCells');
    this.emitChange();
  }
  @transaction()
  deleteMergeCell(range: IRange): void {
    this.model.deleteMergeCell(range);
    this.changeSet.add('mergeCells');
    this.emitChange();
  }
  setFloatElementUuid(uuid: string) {
    this.floatElementUuid = uuid;
  }
  getFilter(sheetId?: string): AutoFilterItem | undefined {
    return this.model.getFilter(sheetId);
  }
  @transaction()
  addFilter(range: IRange): void {
    this.model.addFilter(range);
    this.changeSet.add('autoFilter');
    this.emitChange();
  }
  @transaction()
  deleteFilter(sheetId?: string): void {
    this.model.deleteFilter(sheetId);
    this.changeSet.add('autoFilter');
    this.emitChange();
  }
  @transaction()
  updateFilter(sheetId: string, value: Partial<AutoFilterItem>) {
    this.model.updateFilter(sheetId, value);
    this.changeSet.add('autoFilter');
    this.emitChange();
  }
}
