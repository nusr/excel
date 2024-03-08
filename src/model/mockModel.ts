import { WorkBookJSON, EUnderLine } from '@/types';
import {
  DEFAULT_ROW_COUNT,
  DEFAULT_COL_COUNT,
  generateUUID,
  isMobile,
} from '@/util';
import { mockImage } from './mockData';

const MOCK_MODEL: WorkBookJSON = {
  currentSheetId: '',
  rangeMap: {
    '1': {
      row: 2,
      col: 2,
      rowCount: 1,
      colCount: 1,
      sheetId: '1',
    },
    '2': {
      row: 4,
      col: 4,
      rowCount: 2,
      colCount: 2,
      sheetId: '2',
    },
    '3': {
      row: 4,
      col: 4,
      rowCount: 2,
      colCount: 2,
      sheetId: '3',
    },
  },
  workbook: [
    {
      sheetId: '1',
      name: 'Sheet1',
      isHide: false,
      colCount: DEFAULT_COL_COUNT,
      rowCount: DEFAULT_ROW_COUNT,
    },
    {
      sheetId: '2',
      name: 'test',
      isHide: false,
      colCount: DEFAULT_COL_COUNT,
      rowCount: DEFAULT_ROW_COUNT,
    },
    {
      sheetId: '3',
      name: 'test3',
      isHide: true,
      colCount: DEFAULT_COL_COUNT,
      rowCount: DEFAULT_ROW_COUNT,
    },
  ],
  worksheets_1: {
    '0_0': {
      value: '1a',
      style: {
        fontColor: '#ff0000',
      },
    },
    '0_1': {
      value: 'Z͑ͫ̓ͪ̂ͫ̽͏̴̙̤̞͉͚̯̞̠͍A̴̵̜̰͔ͫ͗͢L̠ͨͧͩ͘G̴̻͈͍͔̹̑͗̎̅͛́Ǫ̵̹̻̝̳͂̌̌͘!͖̬̰̙̗̿̋ͥͥ̂ͣ̐́́͜͞',
      style: {
        fontSize: 26,
      },
    },
    '0_2': {
      value: '',
      formula: '=foo',
    },
    '0_3': {
      value: 'large text',
      style: {
        fontSize: 36,
      },
    },
    '0_4': {
      value: 'This is a very long text that needs to be wrapped',
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
      value: '뎌쉐',
      style: {
        fontSize: 36,
      },
    },
    '0_8': {
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
  // TODO:
  mergeCells: [
    // {
    //   row: 0,
    //   col: 0,
    //   rowCount: 2,
    //   colCount: 2,
    //   sheetId: '1',
    // },
  ],
  customHeight: {
    '1_1': {
      len: 100,
      isHide: false,
    },
    '1_5': {
      len: 100,
      isHide: false,
    },
  },
  customWidth: {
    '1_3': {
      len: 180,
      isHide: false,
    },
    '1_1': {
      len: 100,
      isHide: false,
    },
    '1_6': {
      len: 200,
      isHide: false,
    },
    '1_7': {
      len: 200,
      isHide: false,
    },
    '1_8': {
      len: 100,
      isHide: false,
    },
    '1_9': {
      len: 100,
      isHide: false,
    },
    '1_10': {
      len: 100,
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
  drawings: [],
};

if (!isMobile()) {
  MOCK_MODEL.drawings.push(
    {
      title: 'icon',
      type: 'floating-picture',
      uuid: generateUUID(),
      imageSrc: mockImage,
      width: 200,
      height: 356,
      originHeight: 356,
      originWidth: 200,
      sheetId: '1',
      fromCol: 1,
      fromRow: 1,
      marginX: 0,
      marginY: 0,
    },
    {
      title: 'Chart Title',
      type: 'chart',
      uuid: generateUUID(),
      width: 400,
      height: 250,
      originHeight: 250,
      originWidth: 400,
      marginX: 0,
      marginY: 0,
      sheetId: '1',
      fromCol: 4,
      fromRow: 4,
      chartType: 'bar',
      chartRange: {
        row: 6,
        col: 6,
        colCount: 3,
        rowCount: 3,
        sheetId: '1',
      },
    },
  );
}

export { MOCK_MODEL };
