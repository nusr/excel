import { WorkBookJSON } from "./model";

export type CellType = "text";
export type CanvasOverlayPosition = {
  top: number;
  left: number;
  width: number;
  height: number;
};
export type EditorContainerPosition = {
  value: string | number;
} & CanvasOverlayPosition;

export type CellPosition = {
  row: number;
  col: number;
};

export type CellInfo = EditorContainerPosition & CellPosition;
export type State = {
  activeCell: CellInfo;
  isCellEditing: boolean;
  overlayPosition: CanvasOverlayPosition;
  currentSheetId: string;
  sheetList: WorkBookJSON["workbook"];
  editCellValue: string;
};

export type Action =
  | { type: "CHANGE_ACTIVE_CELL"; payload: CellInfo }
  | { type: "CHANGE_Edit_CELL_VALUE"; payload: string }
  | { type: "RESET" }
  | { type: "WINDOW_RESIZE"; payload: CanvasOverlayPosition }
  | { type: "ENTER_EDITING" }
  | { type: "QUIT_EDITING" }
  | { type: "SET_CURRENT_SHEET_ID"; payload: string }
  | { type: "SET_SHEET_LIST"; payload: WorkBookJSON["workbook"] };

export type Reducer = (state: State, action: Action) => State;
