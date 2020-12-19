import { State, Reducer } from "@/types";
import { EDITOR_DEFAULT_POSITION } from "@/util";

export const initialState: State = {
  controller: {
    initOver: false,
    activeCell: { ...EDITOR_DEFAULT_POSITION },
    isCellEditing: false,
    overlayPosition: { left: 0, top: 0, width: 0, height: 0 },
  },
};

export const reducer: Reducer = (state, action) => {
  console.log(`%c action type: ${action.type}`, "color: red;", action);
  switch (action.type) {
    case "INIT_CONTROLLER":
      state.controller.initOver = true;
      break;
    case "CHANGE_ACTIVE_CELL":
      state.controller.activeCell = action.payload;
      break;
    case "WINDOW_RESIZE":
      state.controller.overlayPosition = action.payload;
      break;
    case "ENTER_EDITING":
      state.controller.isCellEditing = true;
      break;
    case "QUIT_EDITING":
      state.controller.isCellEditing = false;
      break;
    case "RESET":
      state = initialState;
      break;
    default:
      break;
  }
  return state;
};
