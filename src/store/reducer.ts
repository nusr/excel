import { State, Reducer } from "@/types";
import { EDITOR_DEFAULT_POSITION } from "@/util";

export const initialState: State = {
  activeCell: { ...EDITOR_DEFAULT_POSITION },
  isCellEditing: false,
  overlayPosition: { left: 0, top: 0, width: 0, height: 0 },
  currentSheetId: "",
  sheetList: [],
  editCellValue: "",
};

export const reducer: Reducer = (state, action) => {
  // console.log(`%c action type: ${action.type}`, "color: red;", action);
  switch (action.type) {
    case "CHANGE_Edit_CELL_VALUE":
      state.editCellValue = action.payload;
      break;
    case "CHANGE_ACTIVE_CELL":
      state.activeCell = action.payload;
      break;
    case "WINDOW_RESIZE":
      state.overlayPosition = action.payload;
      break;
    case "ENTER_EDITING":
      state.isCellEditing = true;
      break;
    case "QUIT_EDITING":
      state.isCellEditing = false;
      break;
    case "RESET":
      state = initialState;
      break;
    case "SET_CURRENT_SHEET_ID":
      state.currentSheetId = action.payload;
      break;
    case "SET_SHEET_LIST":
      state.sheetList = action.payload;
      break;
    case "BATCH":
      state = {
        ...state,
        ...action.payload,
      };
      break;
    default:
      break;
  }
  return state;
};
