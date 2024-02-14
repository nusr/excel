import { WorkBookJSON, EUnderLine } from '@/types';
import { DEFAULT_ROW_COUNT, DEFAULT_COL_COUNT, generateUUID } from '@/util';
import { mockImage } from './mockData';

export const MOCK_MODEL: WorkBookJSON = {
  currentSheetId: '',
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
        isStrike: true,
        isItalic: true,
        underline: EUnderLine.DOUBLE,
      },
    },
    '0_5': {
      value: '10',
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
    '1_0': {
      formula: '=SUM(F:F)',
    },
    '1_5': {
      value: '5',
    },
    '3_0': {
      style: {
        fillColor: 'red',
      },
    },
    '3_1': {
      style: {
        fillColor: 'red',
      },
    },
    '4_0': {
      style: {
        fillColor: 'red',
      },
    },
    '4_1': {
      style: {
        fillColor: 'red',
      },
    },
    '6_6': {
      value: 3,
    },
    '6_7': {
      value: 6,
    },
    '6_8': {
      value: 29,
    },
    '7_6': {
      value: 35,
    },
    '7_7': {
      value: 15,
    },
    '7_8': {
      value: 34,
    },
    '8_6': {
      value: 23,
    },
    '8_7': {
      value: 24,
    },
    '8_8': {
      value: 15,
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
    '1_1': {
      widthOrHeight: 100,
      isHide: false,
    },
    '1_5': {
      widthOrHeight: 100,
      isHide: true,
    },
  },
  customWidth: {
    '1_1': {
      widthOrHeight: 100,
      isHide: true,
    },
    '1_6': {
      widthOrHeight: 200,
      isHide: false,
    },
    '1_7': {
      widthOrHeight: 200,
      isHide: false,
    },
    '1_8': {
      widthOrHeight: 100,
      isHide: false,
    },
    '1_9': {
      widthOrHeight: 100,
      isHide: false,
    },
    '1_10': {
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
  drawings: [
    {
      title: 'lyf',
      type: 'floating-picture',
      uuid: generateUUID(),
      imageSrc: mockImage,
      width: 200,
      height: 266,
      sheetId: '1',
      fromCol: 2,
      fromRow: 2,
      top: -1,
      left: -1,
    },
    {
      title: 'Chart Title',
      type: 'chart',
      uuid: generateUUID(),
      width: 400,
      height: 266,
      top: -1,
      left: -1,
      sheetId: '1',
      fromCol: 5,
      fromRow: 5,
      chartType: 'bar',
      chartRange: {
        row: 6,
        col: 6,
        colCount: 3,
        rowCount: 3,
        sheetId: '1',
      },
    },
  ],
};
