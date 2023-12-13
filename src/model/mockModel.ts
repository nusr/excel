import { WorkBookJSON, EUnderLine } from '@/types';
import { DEFAULT_ROW_COUNT, DEFAULT_COL_COUNT } from '@/util';

export const MOCK_MODEL: WorkBookJSON = {
  workbook: [
    {
      sheetId: '1',
      name: 'Sheet1',
      isHide: false,
      activeCell: {
        row: 2,
        col: 2,
        rowCount: 1,
        colCount: 1,
        sheetId: '',
      },
      colCount: DEFAULT_COL_COUNT,
      rowCount: DEFAULT_ROW_COUNT,
    },
    {
      sheetId: '2',
      name: 'test',
      isHide: false,
      colCount: DEFAULT_COL_COUNT,
      rowCount: DEFAULT_ROW_COUNT,
      activeCell: {
        row: 4,
        col: 4,
        rowCount: 2,
        colCount: 2,
        sheetId: '',
      },
    },
    {
      sheetId: '3',
      name: 'test3',
      isHide: true,
      colCount: DEFAULT_COL_COUNT,
      rowCount: DEFAULT_ROW_COUNT,
      activeCell: {
        row: 4,
        col: 4,
        rowCount: 2,
        colCount: 2,
        sheetId: '',
      },
    },
  ],
  worksheets: {
    1: {
      0: {
        0: {
          value: '1abcd',
          style: {
            fontColor: '#ff0000',
          },
        },
        1: {
          value: '',
        },
        2: {
          value: '',
          formula: '=foo',
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
        6: {
          formula: '=CONCAT("😊", "👨‍👨‍👧‍👧", "👦🏾")',
          style: {
            fontSize: 36,
          },
        },
        7: {
          value: 'Z͑ͫ̓ͪ̂ͫ̽͏̴̙̤̞͉͚̯̞̠͍A̴̵̜̰͔ͫ͗͢L̠ͨͧͩ͘G̴̻͈͍͔̹̑͗̎̅͛́Ǫ̵̹̻̝̳͂̌̌͘!͖̬̰̙̗̿̋ͥͥ̂ͣ̐́́͜͞',
          style: {
            fontSize: 36,
          },
        },
        8: {
          value: '뎌쉐',
          style: {
            fontSize: 36,
          },
        },
        9: {
          value: 'Ĺo͂řȩm̅',
          style: {
            fontSize: 36,
          },
        },
        10: {
          value: '🌷🎁💩😜👍🏳️‍🌈',
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
          // formula: '=Sheet1!A1',
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
  customHeight: {
    1: {
      1: {
        widthOrHeight: 100,
        isHide: false,
      },
      5: {
        widthOrHeight: 100,
        isHide: true,
      },
    },
  },
  customWidth: {
    1: {
      1: {
        widthOrHeight: 100,
        isHide: true,
      },
      6: {
        widthOrHeight: 200,
        isHide: false
      },
      7: {
        widthOrHeight: 200,
        isHide: false
      },
      8: {
        widthOrHeight: 100,
        isHide: false
      },
      9: {
        widthOrHeight: 100,
        isHide: false
      },
      10: {
        widthOrHeight: 100,
        isHide: false
      },
    },
  },
  definedNames: {
    foo: {
      row: 0,
      col: 0,
      rowCount: 1,
      colCount: 1,
      sheetId: '1',
    },
  },
};
