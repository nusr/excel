import type { WorkBookJSON } from "@/types";
import { DEFAULT_ROW_COUNT, DEFAULT_COL_COUNT } from "@/util";

export const MOCK_MODEL: WorkBookJSON = {
  workbook: [
    {
      sheetId: "Sheet1",
      name: "Sheet1",
      activeCell: "B2",
      colCount: DEFAULT_COL_COUNT,
      rowCount: DEFAULT_ROW_COUNT,
    },
    {
      sheetId: "2",
      name: "test",
      colCount: DEFAULT_COL_COUNT,
      rowCount: DEFAULT_ROW_COUNT,
      activeCell: "F5",
    },
  ],
  worksheets: {
    Sheet1: {
      "0": {
        "0": {
          value: "",
          formula: "=SUM(1, SUM(1,2))",
          style: "1",
        },
        "1": {
          value: "",
          formula: "=SUM(1,4)",
        },
        "2": {
          value: "",
          formula: "=SUM(A1)",
          style: "2",
        },
        "3": {
          value: "超大字",
          style: "3",
        },
      },
      "3": {
        0: {
          style: "style1",
        },
        1: {
          style: "style1",
        },
        2: {
          style: "style1",
        },
        3: {
          style: "style1",
        },
      },
      "4": {
        0: {
          style: "style1",
        },
        1: {
          style: "style1",
        },
        2: {
          style: "style1",
        },
        3: {
          style: "style1",
        },
      },
    },
  },
  styles: {
    "1": {
      fontColor: "#ff0000",
    },
    "2": {},
    style1: {
      fillColor: "red",
    },
    "3": {
      // fontSize: 72,
    },
  },
  mergeCells: ["D2:E3"],
};
