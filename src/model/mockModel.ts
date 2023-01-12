import { WorkBookJSON, EUnderLine } from '@/types';
import { DEFAULT_ROW_COUNT, DEFAULT_COL_COUNT } from '@/util';

export const MOCK_MODEL: WorkBookJSON = {
  workbook: [
    {
      sheetId: '1',
      name: 'Sheet1',
      activeCell: {
        row: 1,
        col: 1,
      },
      colCount: 16384,
      rowCount: 1048576,
    },
    {
      sheetId: '2',
      name: 'test',
      colCount: DEFAULT_COL_COUNT,
      rowCount: DEFAULT_ROW_COUNT,
      activeCell: {
        row: 4,
        col: 4,
      },
    },
  ],
  worksheets: {
    1: {
      0: {
        0: {
          value: '',
          formula: '=SUM(1, SUM(1,2))',
          style: {
            fontColor: '#ff0000',
          },
        },
        1: {
          value: '',
          formula: '=SUM(1,4)',
        },
        2: {
          value: '',
          formula: '=SUM(A1)',
        },
        3: {
          value: '超大字',
          style: {
            fontSize: 36,
          },
        },
        4: {
          value: '这是一段非常长的文案，需要换行展示',
          style: {
            isWrapText: true,
            underline: EUnderLine.SINGLE,
          },
        },
      },
      3: {
        0: {
          style: {
            fillColor: 'red',
          },
        },
        1: {
          style: {
            fillColor: 'red',
          },
        },
      },
      4: {
        0: {
          style: {
            fillColor: 'red',
          },
        },
        1: {
          style: {
            fillColor: 'red',
          },
        },
      },
    },
    2: {
      0: {
        0: {
          formula: '=Sheet1!A1',
        },
      },
    },
  },
  mergeCells: [
    {
      row: 7,
      col: 0,
      rowCount: 2,
      colCount: 2,
      sheetId: '1',
    },
  ],
};
