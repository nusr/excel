import {
  Coordinate,
  IRange,
  WorksheetType,
  ModelCellType,
  FormulaFunction,
} from '@/types';

export type ResultType = boolean | string | number;
export type ErrorTypes =
  | '#DIV/0!' // div zero
  | '#NAME?'
  | '#N/A' // not available
  | '#NULL!'
  | '#NUM!'
  | '#REF!'
  | '#VALUE!'
  | '#GETTING_DATA';

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
  // : 区域运算符，形成区域
  COLON,
  COMMA, // , 联合运算符 求并集
  EMPTY_CHAR, // ' ' 交叉运算符 求交集
  PERCENT, // %
  LESS, // <
  LESS_EQUAL, // <=
  IDENTIFIER, //
  STRING, // string
  FLOAT, // float
  INTEGER, // int
  TRUE, // true
  FALSE, // false
  LEFT_BRACKET, // (
  RIGHT_BRACKET, // )
  lEFT_BRACE, // {
  RIGHT_BRACE, // }
  SEMICOLON, // ;
  EXCLAMATION, // !
  R1C1, // R1C1 reference
  MIXED_CELL, // mixed reference
  ABSOLUTE_CELL, // absolute reference
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
  getDefinedName: (name: string) => IRange | undefined;
  handleCell: (
    value: ModelCellType | undefined,
    coord: Coordinate,
  ) => ResultType[];
  getFunction: (name: string) => FormulaFunction | undefined;
}

export interface InterpreterResult {
  result: ResultType[];
  expressionStr?: string;
}

export type ReferenceType = 'absolute' | 'mixed' | 'relative';

export type ConvertSheetName = (value: string) => string;
