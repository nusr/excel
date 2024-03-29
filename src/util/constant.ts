import { ErrorTypes, NumberFormatItem, LanguageType } from '@/types';

export const LANGUAGE_LIST: LanguageType[] = ['en', 'zh'];
export const SHEET_NAME_PREFIX = 'Sheet';
export const DEFAULT_ROW_COUNT = 200;
export const DEFAULT_COL_COUNT = 30;
export const TEST_ID_KEY = 'data-testid';
export const SCROLL_SIZE = 30;
export const BOTTOM_BUFF = 200;
export const DEFAULT_POSITION = -999;
export const SHEET_ITEM_TEST_ID_PREFIX = '__sheet_item_';
export const FORMULA_PREFIX = '=';
export const SPLITTER = '_';
export const MAX_NAME_LENGTH = 35;
export const DEBUG_COLOR_LIST = [
  '#0000CC',
  '#0000FF',
  '#0033CC',
  '#0033FF',
  '#0066CC',
  '#0066FF',
  '#0099CC',
  '#0099FF',
  '#00CC00',
  '#00CC33',
  '#00CC66',
  '#00CC99',
  '#00CCCC',
  '#00CCFF',
  '#3300CC',
  '#3300FF',
  '#3333CC',
  '#3333FF',
  '#3366CC',
  '#3366FF',
  '#3399CC',
  '#3399FF',
  '#33CC00',
  '#33CC33',
  '#33CC66',
  '#33CC99',
  '#33CCCC',
  '#33CCFF',
  '#6600CC',
  '#6600FF',
  '#6633CC',
  '#6633FF',
  '#66CC00',
  '#66CC33',
  '#9900CC',
  '#9900FF',
  '#9933CC',
  '#9933FF',
  '#99CC00',
  '#99CC33',
  '#CC0000',
  '#CC0033',
  '#CC0066',
  '#CC0099',
  '#CC00CC',
  '#CC00FF',
  '#CC3300',
  '#CC3333',
  '#CC3366',
  '#CC3399',
  '#CC33CC',
  '#CC33FF',
  '#CC6600',
  '#CC6633',
  '#CC9900',
  '#CC9933',
  '#CCCC00',
  '#CCCC33',
  '#FF0000',
  '#FF0033',
  '#FF0066',
  '#FF0099',
  '#FF00CC',
  '#FF00FF',
  '#FF3300',
  '#FF3333',
  '#FF3366',
  '#FF3399',
  '#FF33CC',
  '#FF33FF',
  '#FF6600',
  '#FF6633',
  '#FF9900',
  '#FF9933',
  '#FFCC00',
  '#FFCC33',
];
export const MAX_PARAMS_COUNT = 256;

export const ERROR_SET = new Set<ErrorTypes>([
  '#ERROR!',
  '#DIV/0!',
  '#NULL!',
  '#NUM!',
  '#REF!',
  '#VALUE!',
  '#N/A',
  '#NAME?',
]);

export const NUMBER_FORMAT_LIST: NumberFormatItem[] = [
  { formatCode: 'general', label: '', id: 0 },
  { formatCode: '0', label: '', id: 1 },
  { formatCode: '0.00', label: '', id: 2 },
  { formatCode: '#,##0', label: '', id: 3 },
  { formatCode: '#,##0.00', label: '', id: 4 },
  { formatCode: '0%', label: '', id: 9 },
  { formatCode: '0.00%', label: '', id: 10 },
  { formatCode: '0.00E+00', label: '', id: 11 },
  { formatCode: '# ?/?', label: '', id: 12 },
  { formatCode: '# ??/??', label: '', id: 13 },
  { formatCode: 'mm-dd-yy', label: '', id: 14 },
  { formatCode: 'd-mmm-yy', label: '', id: 15 },
  { formatCode: 'd-mmm', label: '', id: 16 },
  { formatCode: 'mmm-yy', label: '', id: 17 },
  { formatCode: 'h:mm AM/PM', label: '', id: 18 },
  { formatCode: 'h:mm:ss AM/PM', label: '', id: 19 },
  { formatCode: 'hh:mm', label: '', id: 20 },
  { formatCode: 'hh:mm:ss', label: '', id: 21 },
  { formatCode: 'm/d/yy hh:mm', label: '', id: 22 },
  { formatCode: '#,##0 ;(#,##0)', label: '', id: 37 },
  { formatCode: '#,##0 ;[red](#,##0)', label: '', id: 38 },
  { formatCode: '#,##0.00 ;(#,##0.00)', label: '', id: 39 },
  { formatCode: '#,##0.00 ;[red](#,##0.00)', label: '', id: 40 },
  {
    formatCode: '_(* #,##0_);_(* \\(#,##0\\);_(* "-"_);_(@_)',
    label: '',
    id: 41,
  },
  {
    formatCode: '_("$"* #,##0_);_("$"* \\(#,##0\\);_("$"* "-"_);_(@_)',
    label: '',
    id: 42,
  },
  {
    formatCode: '_(* #,##0.00_);_(* \\(#,##0.00\\);_(* "-"??_);_(@_)',
    label: '',
    id: 43,
  },
  {
    formatCode: '_("$"* #,##0.00_);_("$"* \\(#,##0.00\\);_("$"* "-"??_);_(@_)',
    label: '',
    id: 44,
  },
  { formatCode: 'mm:ss', label: '', id: 45 },
  { formatCode: '[h]:mm:ss', label: '', id: 46 },
  { formatCode: 'mm:ss.0', label: '', id: 47 },
  { formatCode: '##0.0E+0', label: '', id: 48 },
  { formatCode: '@', label: '', id: 49 },
];
export const CELL_HEIGHT = 24;
export const CELL_WIDTH = 68;
export const HIDE_CELL = 0;
export const XLSX_MAX_COL_COUNT = 16384; // XFD
export const XLSX_MAX_ROW_COUNT = 1048576;
