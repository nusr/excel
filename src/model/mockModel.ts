import type { WorkBookJSON } from "@/types";

export const MOCK_MODEL: WorkBookJSON = {
  workbook: [
    {
      sheetId: "Sheet1",
      name: "Sheet1",
      activeCell: "B2",
      colCount: 30,
      rowCount: 30,
    },
    {
      sheetId: "2",
      name: "test",
      colCount: 30,
      rowCount: 30,
      activeCell: "F5",
    },
  ],
  worksheets: {
    Sheet1: {
      "0": {
        "0": {
          value: "",
          formula: "SUM(1, sum(1,2))",
          style: "1",
        },
        "1": {
          value: "",
          formula: "SUM(1,4)",
          style: "2",
        },
        "2": {
          value: "",
          formula: "SUM()",
          style: "2",
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
    "2": {
      fontSize: 16,
    },
    style1: {
      fillColor: "red",
    },
  },
  mergeCells: ["D2:E3"],
};
