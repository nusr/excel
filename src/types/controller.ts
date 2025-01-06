import {
  IBaseModel,
  ScrollValue,
  WorksheetType,
  IEventEmitter,
  ChangeEventType,
  ModelEventEmitterType,
  IModel,
} from './model';
import { CanvasOverlayPosition, IHooks, DocumentItem } from './components';
import { IRange } from './range';
import { IWindowSize, IPosition } from './event';

export type ControllerEventEmitterType = {
  renderChange: {
    changeSet: Set<ChangeEventType>;
  };
  rangeChange: IRange;
  toastMessage: ModelEventEmitterType['toastMessage'];
};

/**
 * Interface representing a controller with various methods for managing and interacting with a spreadsheet.
 */
export interface IController
  extends IBaseModel,
    IEventEmitter<ControllerEventEmitterType> {
  readonly model: IModel;
  /**
   * Retrieves the hooks associated with the controller.
   * @returns {IHooks} The hooks.
   */
  getHooks(): IHooks;

  /**
   * Emits a change event.
   */
  emitChange(): Promise<void>;

  /**
   * Sets the next active cell based on the given direction.
   * @param direction - The direction to move the active cell ('left', 'right', 'down', 'up').
   */
  setNextActiveCell(direction: 'left' | 'right' | 'down' | 'up'): void;

  /**
   * Gets the size of a cell range.
   * @param range - The range of cells.
   * @returns {IWindowSize} The size of the cell range.
   */
  getCellSize(range: IRange): IWindowSize;

  /**
   * Computes the position of a cell range.
   * @param range - The range of cells.
   * @returns {IPosition} The position of the cell range.
   */
  computeCellPosition(range: IRange): IPosition;

  /**
   * Pastes content from the clipboard.
   * @param event - The clipboard event (optional).
   * @returns {Promise<void>} A promise that resolves when the paste operation is complete.
   */
  paste(event?: ClipboardEvent): Promise<void>;

  /**
   * Copies content to the clipboard.
   * @param event - The clipboard event (optional).
   * @returns {Promise<void>} A promise that resolves when the copy operation is complete.
   */
  copy(event?: ClipboardEvent): Promise<void>;

  /**
   * Cuts content to the clipboard.
   * @param event - The clipboard event (optional).
   * @returns {Promise<void>} A promise that resolves when the cut operation is complete.
   */
  cut(event?: ClipboardEvent): Promise<void>;

  /**
   * Gets the range of cells to be copied.
   * @returns {IRange | undefined} The range of cells to be copied, or undefined if no range is set.
   */
  getCopyRange(): IRange | undefined;

  /**
   * Sets the range of cells to be copied.
   * @param range - The range of cells to be copied, or undefined to clear the copy range.
   */
  setCopyRange(range: IRange | undefined): void;

  /**
   * Sets the scroll position.
   * @param scroll - The scroll value.
   * @param sheetId - The ID of the sheet (optional).
   */
  setScroll(scroll: ScrollValue, sheetId?: string): void;

  /**
   * Gets the scroll position.
   * @param sheetId - The ID of the sheet (optional).
   * @returns {ScrollValue} The scroll value.
   */
  getScroll(sheetId?: string): ScrollValue;

  /**
   * Sets the UUID of the floating element.
   * @param uuid - The UUID of the floating element.
   */
  setFloatElementUuid(uuid: string): void;

  /**
   * Gets the height of a row.
   * @param row - The row number.
   * @param sheetId - The ID of the sheet (optional).
   * @returns {number} The height of the row.
   */
  getRowHeight(row: number, sheetId?: string): number;

  /**
   * Gets the width of a column.
   * @param col - The column number.
   * @param sheetId - The ID of the sheet (optional).
   * @returns {number} The width of the column.
   */
  getColWidth(col: number, sheetId?: string): number;

  /**
   * Gets the size of the sheet view.
   * @returns {IWindowSize} The size of the sheet view.
   */
  getSheetViewSize(): IWindowSize;

  /**
   * Gets the size of the header.
   * @returns {IWindowSize} The size of the header.
   */
  getHeaderSize(): IWindowSize;

  /**
   * Sets the size of the canvas.
   * @param size - The size of the canvas.
   */
  setCanvasSize(size: CanvasOverlayPosition): void;

  /**
   * Gets the size of the canvas.
   * @returns {CanvasOverlayPosition} The size of the canvas.
   */
  getCanvasSize(): CanvasOverlayPosition;

  /**
   * Adds the first sheet to the workbook.
   * @returns {WorksheetType | undefined} The first sheet, or undefined if it could not be added.
   */
  addFirstSheet(): WorksheetType | undefined;
  /**
   * Sets the read-only status of the collaboration provider.
   * @param readOnly - A boolean indicating the read-only status.
   */
  setReadOnly(readOnly: boolean): void;

  /**
   * Gets the read-only status of the collaboration provider.
   * @returns A boolean indicating the read-only status.
   */
  getReadOnly(): boolean;
}

/**
 * Interface representing a collaboration provider for document handling and synchronization.
 */
export interface ICollaborationProvider {
  /**
   * Uploads a file to the collaboration provider.
   * @param file - The file to be uploaded.
   * @param base64 - The base64 representation of the file.
   * @returns A promise that resolves to a string representing the file path.
   */
  uploadFile(docId: string, file: File, base64: string): Promise<string>;

  /**
   * Downloads a file from the collaboration provider.
   * @param filePath - The path of the file to be downloaded.
   * @returns A promise that resolves to a string representing the file content.
   */
  downloadFile(docId: string, filePath: string): Promise<string>;

  /**
   * Adds a new document to the collaboration provider.
   */
  addDocument(id: string): Promise<void>;

  /**
   * Updates an existing document in the collaboration provider.
   */
  updateDocument(
    id: string,
    data: Pick<DocumentItem, 'name' | 'content'>,
  ): Promise<void>;

  /**
   * Retrieves a document from the collaboration provider.
   * @returns A promise that resolves to a DocumentItem or undefined if not found.
   */
  getDocument(id: string): Promise<DocumentItem | undefined>;
}
