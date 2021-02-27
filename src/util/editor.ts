import { CellInfo } from "@/types";
import { CELL_HEIGHT, CELL_WIDTH } from "./cell";
export const EDITOR_DEFAULT_POSITION: CellInfo = {
  left: -999,
  top: -999,
  value: "",
  width: CELL_WIDTH,
  height: CELL_HEIGHT,
  row: 0,
  col: 0,
  style: {},
  displayValue: "",
};
