export type CellType = "text";
export type CanvasOverlayPosition = {
  top: number;
  left: number;
  width: number;
  height: number;
};
export type EditorContainerPosition = {
  value: string;
} & CanvasOverlayPosition;

export type CellPosition = {
  row: number;
  col: number;
};

export type CellInfo = EditorContainerPosition & CellPosition;
export type ControllerState = {
  initOver: boolean;
  activeCell: CellInfo;
  isCellEditing: boolean;
  overlayPosition: CanvasOverlayPosition;
};
export type State = {
  controller: ControllerState;
};

export type Action =
  | { type: "INIT_CONTROLLER" }
  | { type: "CHANGE_ACTIVE_CELL"; payload: CellInfo }
  | { type: "RESET" }
  | { type: "WINDOW_RESIZE"; payload: CanvasOverlayPosition }
  | { type: "ENTER_EDITING" }
  | { type: "QUIT_EDITING" };

export type Reducer = (state: State, action: Action) => State;
