import { State, Reducer } from "@/types";
import { EDITOR_DEFAULT_POSITION, storeLog } from "@/util";

export const initialState: State = {
  activeCell: { ...EDITOR_DEFAULT_POSITION },
  currentSheetId: "",
  sheetList: [],
  editCellValue: "",
  canRedo: false,
  canUndo: false,
  isCellEditing: false,
};

export const reducer: Reducer = (state, action) => {
  storeLog(action.type, action);
  switch (action.type) {
    case "CHANGE_Edit_CELL_VALUE":
      state.editCellValue = action.payload;
      break;
    case "CHANGE_ACTIVE_CELL":
      state.activeCell = action.payload;
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
