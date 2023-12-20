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
  worksheets_1: {
    '0_0': {
      value: '1abcd',
      style: {
        fontColor: '#ff0000',
      },
    },
    '0_1': {
      value: '',
    },
    '0_2': {
      value: '',
      formula: '=foo',
    },
    '0_3': {
      value: '超大字',
      style: {
        fontSize: 36,
      },
    },
    '0_4': {
      value: '这是一段非常长的文案，需要换行展示',
      style: {
        isWrapText: true,
        underline: EUnderLine.SINGLE,
      },
    },
    '0_6': {
      formula: '=CONCAT("😊", "👨‍👨‍👧‍👧", "👦🏾")',
      style: {
        fontSize: 36,
      },
    },
    '0_7': {
      value: 'Z͑ͫ̓ͪ̂ͫ̽͏̴̙̤̞͉͚̯̞̠͍A̴̵̜̰͔ͫ͗͢L̠ͨͧͩ͘G̴̻͈͍͔̹̑͗̎̅͛́Ǫ̵̹̻̝̳͂̌̌͘!͖̬̰̙̗̿̋ͥͥ̂ͣ̐́́͜͞',
      style: {
        fontSize: 36,
      },
    },
    '0_8': {
      value: '뎌쉐',
      style: {
        fontSize: 36,
      },
    },
    '0_9': {
      value: 'Ĺo͂řȩm̅',
      style: {
        fontSize: 36,
      },
    },
    '0_10': {
      value: '🌷🎁💩😜👍🏳️‍🌈',
    },
    3_0: {
      style: {
        fillColor: 'red',
      },
    },
    3_1: {
      style: {
        fillColor: 'red',
      },
    },
    4_0: {
      style: {
        fillColor: 'red',
      },
    },
    4_1: {
      style: {
        fillColor: 'red',
      },
    },
  },
  worksheets_2: {
    '0_0': {
      formula: '=Sheet1!A1',
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
    1_1: {
      widthOrHeight: 100,
      isHide: false,
    },
    1_5: {
      widthOrHeight: 100,
      isHide: true,
    },
  },
  customWidth: {
    1_1: {
      widthOrHeight: 100,
      isHide: true,
    },
    1_6: {
      widthOrHeight: 200,
      isHide: false,
    },
    1_7: {
      widthOrHeight: 200,
      isHide: false,
    },
    1_8: {
      widthOrHeight: 100,
      isHide: false,
    },
    1_9: {
      widthOrHeight: 100,
      isHide: false,
    },
    1_10: {
      widthOrHeight: 100,
      isHide: false,
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
