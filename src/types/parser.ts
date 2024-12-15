import {
  IRange,
  WorksheetType,
  ModelCellType,
  FormulaFunction,
} from '../types';
import { type SheetRange } from '../util/range';

export type ResultType = boolean | string | number;

export enum TokenType {
  EQUAL, // =
  NOT_EQUAL, // <>
  PLUS, // +
  MINUS, // -
  STAR, // *
  SLASH, // /
  EXPONENT, // ^
  GREATER, // >
  GREATER_EQUAL, // >=
  CONCATENATE, // &
  COLON, // : 区域运算符，形成区域
  COMMA, // , 联合运算符 求并集
  EMPTY_CHAR, // ' ' 交叉运算符 求交集
  PERCENT, // %
  LESS, // <
  LESS_EQUAL, // <=
  STRING, // string
  NUMBER, // integer | float
  BOOL, // TRUE | FALSE
  ERROR, // #DIV/0! | #NAME? | #N/A | #NULL! | #NUM! | #VALUE! | #GETTING_DATA
  ERROR_REF, // #REF!
  LEFT_BRACKET, // (
  RIGHT_BRACKET, // )
  lEFT_BRACE, // {
  RIGHT_BRACE, // }
  SEMICOLON, // ;
  EXCLAMATION, // !
  R1C1, // R1C1 reference
  SHEET_NAME, // sheet name !
  CELL, // /[$]?[A-Za-z]{1,3}[$]?[1-9][0-9]*/
  COLUMN, // /[$]?[A-Za-z]{1,3}/
  ROW, // /^\$[1-9][0-9]*/
  DEFINED_NAME, // /[a-zA-Z_][a-zA-Z0-9_.?]*/
  EXCEL_FUNCTION, // built-in function \(
  REF_FUNCTION, // (INDEX | OFFSET | INDIRECT)\( 5
  REF_FUNCTION_COND, //  (IF | CHOOSE)\( 5
  EOF,
}

export interface CellDataMap {
  set: (range: IRange, value: ResultType[][]) => void;
  getCell: (range: IRange) => ModelCellType | undefined;
  getSheetInfo: (
    sheetId?: string,
    sheetName?: string,
  ) => WorksheetType | undefined;
  setDefinedName: (name: string, value: IRange) => void;
  getDefinedName: (name: string) => SheetRange | undefined;
  handleCell: (
    value: ModelCellType | undefined,
    coord: Pick<IRange, 'sheetId' | 'row' | 'col'>,
  ) => ResultType[];
  getFunction: (name: string) => FormulaFunction | undefined;
}

export interface InterpreterResult {
  result: ResultType[];
  expressionStr?: string;
}

export type ReferenceType = 'absolute' | 'mixed' | 'relative';

export type ConvertSheetName = (value: string) => string;
