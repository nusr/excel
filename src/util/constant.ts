import { ErrorTypes, BorderType } from '@/types';

export const DEFAULT_FONT_SIZE = 12;
export const MUST_FONT_FAMILY = 'sans-serif';
export const SHEET_NAME_PREFIX = 'Sheet';
export const CELL_HEIGHT = 22;
export const CELL_WIDTH = 76;
export const ROW_TITLE_HEIGHT = CELL_HEIGHT;
export const COL_TITLE_WIDTH = CELL_WIDTH / 2;
export const HIDE_CELL = 0;
export const TEXTAREA_MAX_ROWS = 10;
export const MERGE_CELL_LINE_BREAK = '&#10;';
export const LINE_BREAK = '\n';
export const CSV_SPLITTER = ',';
export const XLSX_MAX_COL_COUNT = 16384; // XFD
export const XLSX_MAX_ROW_COUNT = 1048576;
export const DEFAULT_ROW_COUNT = 200;
export const MAX_ADD_ROW_THRESHOLD = 200;
export const DEFAULT_COL_COUNT = 30;
export const DEFAULT_POSITION = -999;

export const SHEET_ITEM_TEST_ID_PREFIX = '__sheet_item_';
export const FORMULA_PREFIX = '=';
export const SPLITTER = '_';
export const MAX_NAME_LENGTH = 35;
export const MAX_PARAMS_COUNT = 256;
export const DEFINED_NAME_REG_EXP = /^[a-zA-Z_][a-zA-Z0-9_.]*$/;
export const FORMULA_MAX_PRECISION = 9;
export const FORMULA_EDITOR_ROLE = '__FORMULA_EDITOR_ROLE__';

export const DEFAULT_FORMAT_CODE = 'General';
export const DEFAULT_TEXT_FORMAT_CODE = '@';

export const ERROR_SET = new Set<ErrorTypes>([
  '#GETTING_DATA',
  '#DIV/0!',
  '#NULL!',
  '#NUM!',
  '#REF!',
  '#VALUE!',
  '#N/A',
  '#NAME?',
]);

export const DEFAULT_LINE_WIDTH = 1;

export const BORDER_TYPE_MAP: Record<BorderType, number> = {
  thin: DEFAULT_LINE_WIDTH,
  hair: DEFAULT_LINE_WIDTH,
  dotted: DEFAULT_LINE_WIDTH,
  dashed: DEFAULT_LINE_WIDTH,
  dashDot: DEFAULT_LINE_WIDTH,
  dashDotDot: DEFAULT_LINE_WIDTH,
  double: DEFAULT_LINE_WIDTH,
  medium: DEFAULT_LINE_WIDTH * 2,
  mediumDashed: DEFAULT_LINE_WIDTH * 2,
  mediumDashDot: DEFAULT_LINE_WIDTH * 2,
  mediumDashDotDot: DEFAULT_LINE_WIDTH * 2,
  thick: DEFAULT_LINE_WIDTH * 4,
};

export const COLOR_PICKER_COLOR_LIST = [
  '#35322B',
  '#505050',
  '#606060',
  '#6F6F6F',
  '#8B8B8B',
  '#B2B2B2',
  '#CCCCCC',
  '#E5E5E5',
  '#F5F5F5',
  '#FFFFFF',
  '#9D0000',
  '#B20000',
  '#CD0F0F',
  '#E30909',
  '#F30B0B',
  '#FE4B4B',
  '#FA7979',
  '#FB9D9D',
  '#FDCECE',
  '#FEE7E7',
  '#B24000',
  '#CC4F10',
  '#DF5D00',
  '#F96800',
  '#FB8937',
  '#FF8C51',
  '#FCA669',
  '#FDC49B',
  '#FEE1CD',
  '#FEF0E6',
  '#B19401',
  '#C5A300',
  '#D8B300',
  '#EBC301',
  '#F9D700',
  '#FBE137',
  '#FCE869',
  '#FDF09B',
  '#FEF7CD',
  '#FEFBE6',
  '#58770A',
  '#688C0D',
  '#7AA017',
  '#8BBB11',
  '#A4DC16',
  '#BEEE44',
  '#CEF273',
  '#DEF6A2',
  '#EFFBD0',
  '#F7FDE8',
  '#007676',
  '#008A8A',
  '#009E9E',
  '#00BBBB',
  '#1CD8D8',
  '#2AEAEA',
  '#76EFEF',
  '#A3F5F5',
  '#D1FAFA',
  '#E8FCFC',
  '#001F9C',
  '#0025B7',
  '#012BD2',
  '#133DE3',
  '#2F55EB',
  '#4567ED',
  '#738DF2',
  '#A2B3F6',
  '#D0D9FB',
  '#E8ECFD',
  '#3F0198',
  '#510EB0',
  '#6721CB',
  '#7735D4',
  '#894EDE',
  '#9E6DE3',
  '#AA82E3',
  '#C7ABED',
  '#E3D5F6',
  '#F1EAFA',
  '#8F0550',
  '#A1095C',
  '#C1026B',
  '#D4157E',
  '#E7258F',
  '#F248A6',
  '#F273B9',
  '#F6A2D0',
  '#FBD0E8',
  '#FDE8F3',
];

export const TEXT_FLAG = '#TEXT' as const
