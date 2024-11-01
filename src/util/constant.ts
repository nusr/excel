import { BorderType } from '@/types';

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
export const FORMULA_MAX_PRECISION = 9;
export const FORMULA_EDITOR_ROLE = '__FORMULA_EDITOR_ROLE__';

export const DEFAULT_FORMAT_CODE = 'General';
export const DEFAULT_TEXT_FORMAT_CODE = '@';

export const ERROR_SET = new Set([
  '#GETTING_DATA',
  '#DIV/0!',
  '#NULL!',
  '#NUM!',
  '#REF!',
  '#VALUE!',
  '#N/A',
  '#NAME?',
] as const);

export type ErrorTypes = typeof ERROR_SET extends Set<infer T> ? T : never;

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

export const TEXT_FLAG = '#TEXT' as const;

export const CELL_REG_EXP = /^[$]?[A-Za-z]{1,3}[$]?[1-9][0-9]*$/;
export const COLUMN_REG_EXP = /^[$]?[A-Za-z]{1,3}$/;
export const ROW_REG_EXP = /^\$[1-9][0-9]*$/;
export const DEFINED_NAME_REG_EXP = /^[a-zA-Z_][a-zA-Z0-9_.?]*$/;

export const BUILT_IN_FUNCTION_SET = new Set([
  'ABS',
  'ACCRINT',
  'ACCRINTM',
  'ACOS',
  'ACOSH',
  'ACOT',
  'ACOTH',
  'ADDRESS',
  'AGGREGATE',
  'AMORDEGRC',
  'AMORLINC',
  'AND',
  'ARABIC',
  'AREAS',
  'ARRAYTOTEXT',
  'ASC',
  'ASIN',
  'ASINH',
  'ATAN',
  'ATAN2',
  'ATANH',
  'AVEDEV',
  'AVERAGE',
  'AVERAGEA',
  'AVERAGEIF',
  'AVERAGEIFS',
  'BAHTTEXT',
  'BASE',
  'BESSELI',
  'BESSELJ',
  'BESSELK',
  'BESSELY',
  'BETA.DIST',
  'BETA.INV',
  'BETADIST',
  'BETAINV',
  'BIN2DEC',
  'BIN2HEX',
  'BIN2OCT',
  'BINOM.DIST',
  'BINOM.DIST.RANGE',
  'BINOM.INV',
  'BINOMDIST',
  'BITAND',
  'BITLSHIFT',
  'BITOR',
  'BITRSHIFT',
  'BITXOR',
  'CALL',
  'CEILING',
  'CEILING.MATH',
  'CEILING.PRECISE',
  'CELL',
  'CHAR',
  'CHIDIST',
  'CHIINV',
  'CHISQ.DIST',
  'CHISQ.DIST.RT',
  'CHISQ.INV',
  'CHISQ.INV.RT',
  'CHISQ.TEST',
  'CHITEST',
  'CLEAN',
  'CODE',
  'COLUMN',
  'COLUMNS',
  'COMBIN',
  'COMBINA',
  'COMPLEX',
  'CONCAT',
  'CONCATENATE',
  'CONFIDENCE',
  'CONFIDENCE.NORM',
  'CONFIDENCE.T',
  'CONVERT',
  'CORREL',
  'COS',
  'COSH',
  'COT',
  'COTH',
  'COUNT',
  'COUNTA',
  'COUNTBLANK',
  'COUNTIF',
  'COUNTIFS',
  'COUPDAYBS',
  'COUPDAYS',
  'COUPDAYSNC',
  'COUPNCD',
  'COUPNUM',
  'COUPPCD',
  'COVAR',
  'COVARIANCE.P',
  'COVARIANCE.S',
  'CRITBINOM',
  'CSC',
  'CSCH',
  'CUBEKPIMEMBER',
  'CUBEMEMBER',
  'CUBEMEMBERPROPERTY',
  'CUBERANKEDMEMBER',
  'CUBESET',
  'CUBESETCOUNT',
  'CUBEVALUE',
  'CUMIPMT',
  'CUMPRINC',
  'DATE',
  'DATEDIF',
  'DATEVALUE',
  'DAVERAGE',
  'DAY',
  'DAYS',
  'DAYS360',
  'DB',
  'DBCS',
  'DCOUNT',
  'DCOUNTA',
  'DDB',
  'DEC2BIN',
  'DEC2HEX',
  'DEC2OCT',
  'DECIMAL',
  'DEGREES',
  'DELTA',
  'DEVSQ',
  'DGET',
  'DISC',
  'DMAX',
  'DMIN',
  'DOLLAR',
  'DOLLARDE',
  'DOLLARFR',
  'DPRODUCT',
  'DSTDEV',
  'DSTDEVP',
  'DSUM',
  'DURATION',
  'DVAR',
  'DVARP',
  'EDATE',
  'EFFECT',
  'ENCODEURL',
  'EOMONTH',
  'ERF',
  'ERF.PRECISE',
  'ERFC',
  'ERFC.PRECISE',
  'ERROR.TYPE',
  'EUROCONVERT',
  'EVEN',
  'EXACT',
  'EXP',
  'EXPON.DIST',
  'EXPONDIST',
  'F.DIST',
  'F.DIST.RT',
  'F.INV',
  'F.INV.RT',
  'F.TEST',
  'FACT',
  'FACTDOUBLE',
  'FALSE',
  'FDIST',
  'FILTER',
  'FILTERXML',
  'FIND',
  'FINDB',
  'FINV',
  'FISHER',
  'FISHERINV',
  'FIXED',
  'FLOOR',
  'FLOOR.MATH',
  'FLOOR.PRECISE',
  'FORECAST',
  'FORECAST.ETS',
  'FORECAST.ETS.CONFINT',
  'FORECAST.ETS.SEASONALITY',
  'FORECAST.ETS.STAT',
  'FORECAST.LINEAR',
  'FORMULATEXT',
  'FREQUENCY',
  'FTEST',
  'FV',
  'FVSCHEDULE',
  'GAMMA',
  'GAMMA.DIST',
  'GAMMA.INV',
  'GAMMADIST',
  'GAMMAINV',
  'GAMMALN',
  'GAMMALN.PRECISE',
  'GAUSS',
  'GCD',
  'GEOMEAN',
  'GESTEP',
  'GETPIVOTDATA',
  'GROWTH',
  'HARMEAN',
  'HEX2BIN',
  'HEX2DEC',
  'HEX2OCT',
  'HLOOKUP',
  'HOUR',
  'HYPERLINK',
  'HYPGEOM.DIST',
  'HYPGEOMDIST',
  'IFERROR',
  'IFNA',
  'IFS',
  'IMABS',
  'IMAGINARY',
  'IMARGUMENT',
  'IMCONJUGATE',
  'IMCOS',
  'IMCOSH',
  'IMCOT',
  'IMCSC',
  'IMCSCH',
  'IMDIV',
  'IMEXP',
  'IMLN',
  'IMLOG10',
  'IMLOG2',
  'IMPOWER',
  'IMPRODUCT',
  'IMREAL',
  'IMSEC',
  'IMSECH',
  'IMSIN',
  'IMSINH',
  'IMSQRT',
  'IMSUB',
  'IMSUM',
  'IMTAN',
  'INFO',
  'INT',
  'INTERCEPT',
  'INTRATE',
  'IPMT',
  'IRR',
  'ISBLANK',
  'ISERR',
  'ISERROR',
  'ISEVEN',
  'ISFORMULA',
  'ISLOGICAL',
  'ISNA',
  'ISNONTEXT',
  'ISNUMBER',
  'ISO.CEILING',
  'ISODD',
  'ISOWEEKNUM',
  'ISPMT',
  'ISREF',
  'ISTEXT',
  'JIS',
  'KURT',
  'LARGE',
  'LCM',
  'LEFT',
  'LEFTB',
  'LEN',
  'LENB',
  'LET',
  'LINEST',
  'LN',
  'LOG',
  'LOG10',
  'LOGEST',
  'LOGINV',
  'LOGNORM.DIST',
  'LOGNORM.INV',
  'LOGNORMDIST',
  'LOOKUP',
  'LOWER',
  'MATCH',
  'MAX',
  'MAXA',
  'MAXIFS',
  'MDETERM',
  'MDURATION',
  'MEDIAN',
  'MID',
  'MIDB',
  'MIN',
  'MINA',
  'MINIFS',
  'MINUTE',
  'MINVERSE',
  'MIRR',
  'MMULT',
  'MOD',
  'MODE',
  'MODE.MULT',
  'MODE.SNGL',
  'MONTH',
  'MROUND',
  'MULTINOMIAL',
  'MUNIT',
  'N',
  'NA',
  'NEGBINOM.DIST',
  'NEGBINOMDIST',
  'NETWORKDAYS',
  'NETWORKDAYS.INTL',
  'NOMINAL',
  'NORM.DIST',
  'NORM.INV',
  'NORM.S.DIST',
  'NORM.S.INV',
  'NORMDIST',
  'NORMINV',
  'NORMSDIST',
  'NORMSINV',
  'NOT',
  'NOW',
  'NPER',
  'NPV',
  'NUMBERVALUE',
  'OCT2BIN',
  'OCT2DEC',
  'OCT2HEX',
  'ODD',
  'ODDFPRICE',
  'ODDFYIELD',
  'ODDLPRICE',
  'ODDLYIELD',
  'OR',
  'PDURATION',
  'PEARSON',
  'PERCENTILE',
  'PERCENTILE.EXC',
  'PERCENTILE.INC',
  'PERCENTRANK',
  'PERCENTRANK.EXC',
  'PERCENTRANK.INC',
  'PERMUT',
  'PERMUTATIONA',
  'PHI',
  'PHONETIC',
  'PI',
  'PMT',
  'POISSON',
  'POISSON.DIST',
  'POWER',
  'PPMT',
  'PRICE',
  'PRICEDISC',
  'PRICEMAT',
  'PROB',
  'PRODUCT',
  'PROPER',
  'PV',
  'QUARTILE',
  'QUARTILE.EXC',
  'QUARTILE.INC',
  'QUOTIENT',
  'RADIANS',
  'RAND',
  'RANDARRAY',
  'RANDBETWEEN',
  'RANK',
  'RANK.AVG',
  'RANK.EQ',
  'RATE',
  'RECEIVED',
  'REGISTER.ID',
  'REPLACE',
  'REPLACEB',
  'REPT',
  'RIGHT',
  'RIGHTB',
  'ROMAN',
  'ROUND',
  'ROUNDDOWN',
  'ROUNDUP',
  'ROW',
  'ROWS',
  'RRI',
  'RSQ',
  'RTD',
  'SEARCH',
  'SEARCHB',
  'SEC',
  'SECH',
  'SECOND',
  'SEQUENCE',
  'SERIESSUM',
  'SHEET',
  'SHEETS',
  'SIGN',
  'SIN',
  'SINH',
  'SKEW',
  'SKEW.P',
  'SLN',
  'SLOPE',
  'SMALL',
  'SORT',
  'SORTBY',
  'SQRT',
  'SQRTPI',
  'STANDARDIZE',
  'STDEV',
  'STDEV.P',
  'STDEV.S',
  'STDEVA',
  'STDEVP',
  'STDEVPA',
  'STEYX',
  'SUBSTITUTE',
  'SUBTOTAL',
  'SUM',
  'SUMIF',
  'SUMIFS',
  'SUMPRODUCT',
  'SUMSQ',
  'SUMX2MY2',
  'SUMX2PY2',
  'SUMXMY2',
  'SWITCH',
  'SYD',
  'T',
  'T.DIST',
  'T.DIST.2T',
  'T.DIST.RT',
  'T.INV',
  'T.INV.2T',
  'T.TEST',
  'TAN',
  'TANH',
  'TBILLEQ',
  'TBILLPRICE',
  'TBILLYIELD',
  'TDIST',
  'TEXT',
  'TEXTJOIN',
  'TIME',
  'TIMEVALUE',
  'TINV',
  'TODAY',
  'TRANSPOSE',
  'TREND',
  'TRIM',
  'TRIMMEAN',
  'TRUE',
  'TRUNC',
  'TTEST',
  'TYPE',
  'UNICHAR',
  'UNICODE',
  'UNIQUE',
  'UPPER',
  'VALUE',
  'VALUETOTEXT',
  'VAR',
  'VAR.P',
  'VAR.S',
  'VARA',
  'VARP',
  'VARPA',
  'VDB',
  'VLOOKUP',
  'WEBSERVICE',
  'WEEKDAY',
  'WEEKNUM',
  'WEIBULL',
  'WEIBULL.DIST',
  'WORKDAY',
  'WORKDAY.INTL',
  'XIRR',
  'XLOOKUP',
  'XMATCH',
  'XNPV',
  'XOR',
  'YEAR',
  'YEARFRAC',
  'YIELD',
  'YIELDDISC',
  'YIELDMAT',
  'Z.TEST',
  'ZTEST',
] as const);

export type BuiltInFormulas = typeof BUILT_IN_FUNCTION_SET extends Set<infer T>
  ? T
  : never;
