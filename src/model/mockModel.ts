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
  workbook: {
    '1': {
      sheetId: '1',
      name: 'basic',
      isHide: false,
      colCount: DEFAULT_COL_COUNT,
      rowCount: DEFAULT_ROW_COUNT,
      sort: 1,
    },
    '2': {
      sheetId: '2',
      name: 'floating-picture',
      isHide: false,
      colCount: DEFAULT_COL_COUNT,
      rowCount: DEFAULT_ROW_COUNT,
      sort: 2,
      tabColor: '#FE4B4B',
    },
    '3': {
      sheetId: '3',
      name: 'hide',
      isHide: true,
      colCount: DEFAULT_COL_COUNT,
      rowCount: DEFAULT_ROW_COUNT,
      sort: 3,
    },
    '4': {
      sheetId: '4',
      name: 'chart',
      isHide: false,
      colCount: DEFAULT_COL_COUNT,
      rowCount: DEFAULT_ROW_COUNT,
      sort: 4,
      tabColor: '#CEF273',
    },
    '5': {
      sheetId: '5',
      name: 'defined name',
      isHide: false,
      colCount: DEFAULT_COL_COUNT,
      rowCount: DEFAULT_ROW_COUNT,
      sort: 5,
      tabColor: '#76EFEF',
    },
    '6': {
      sheetId: '6',
      name: 'unicode',
      isHide: false,
      colCount: DEFAULT_COL_COUNT,
      rowCount: DEFAULT_ROW_COUNT,
      sort: 6,
      tabColor: '#9E6DE3',
    },
    '7': {
      sheetId: '7',
      name: 'formula',
      isHide: false,
      colCount: DEFAULT_COL_COUNT,
      rowCount: DEFAULT_ROW_COUNT,
      sort: 7,
      tabColor: '#E7258F',
    },
  },
  worksheets: {
    '1': {
      '0_0': {
        value: '1',
        style: {
          fontColor: '#ff0000',
        },
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
    },
    '2': {
      '0_0': {
        formula: '=basic!A1',
      },
    },
    '4': {
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
    '5': {
      '0_0': {
        value: '1',
      },
      '0_2': {
        value: '',
        formula: '=foo',
      },
    },
    '6': {
      '0_1': {
        value: 'Z͑ͫ̓ͪ̂ͫ̽͏̴̙̤̞͉͚̯̞̠͍A̴̵̜̰͔ͫ͗͢L̠ͨͧͩ͘G̴̻͈͍͔̹̑͗̎̅͛́Ǫ̵̹̻̝̳͂̌̌͘!͖̬̰̙̗̿̋ͥͥ̂ͣ̐́́͜͞',
        style: {
          fontSize: 26,
        },
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
    },
    '7': {
      '0_0': {
        formula: '=SUM(1,2)',
      },
      '0_1': {
        value: 'test',
      },
      '0_2': {
        formula: '=CONCATENATE(A1,B1)',
      },
      '0_3': {
        formula: '=UNICODE("测试")',
      },
      '1_0': {
        formula: '=PI()',
      },
      '2_0': {
        formula: '=E()',
      },
      '3_0': {
        formula: '=E()*PI()',
      },
      '4_0': {
        formula: '=SUM(1, SIN(PI()/2),3)',
      },
    },
  },

  // TODO:
  mergeCells: {},
  customHeight: {},
  customWidth: {},
  definedNames: {
    foo: {
      row: 0,
      col: 0,
      rowCount: 1,
      colCount: 1,
      sheetId: '5',
    },
    doo: {
      row: 3,
      col: 3,
      rowCount: 1,
      colCount: 1,
      sheetId: '5',
    },
  },
  drawings: {},
};

if (!isMobile()) {
  const imageUuid = generateUUID();
  MOCK_MODEL.drawings[imageUuid] = {
    title: 'icon',
    type: 'floating-picture',
    uuid: imageUuid,
    imageSrc: mockImage,
    width: 200,
    height: 356,
    originHeight: 356,
    originWidth: 200,
    sheetId: '2',
    fromCol: 1,
    fromRow: 1,
    marginX: 0,
    marginY: 0,
  };
  const chartUuid = generateUUID();
  MOCK_MODEL.drawings[chartUuid] = {
    title: 'Chart Title',
    type: 'chart',
    uuid: chartUuid,
    width: 400,
    height: 250,
    originHeight: 250,
    originWidth: 400,
    marginX: 0,
    marginY: 0,
    sheetId: '4',
    fromCol: 4,
    fromRow: 4,
    chartType: 'bar',
    chartRange: {
      row: 6,
      col: 6,
      colCount: 3,
      rowCount: 3,
      sheetId: '4',
    },
  };
}

export { MOCK_MODEL };
