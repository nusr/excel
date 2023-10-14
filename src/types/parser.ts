import { IRange } from '@/types'
export type ResultType = boolean | string | number | null | undefined;
export type ErrorTypes =
  | '#ERROR!'
  | '#DIV/0!' // div zero
  | '#NAME?'
  | '#N/A' // not available
  | '#NULL!'
  | '#NUM!'
  | '#REF!'
  | '#VALUE!';
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
  IDENTIFIER, //
  STRING,
  NUMBER,
  TRUE,
  FALSE,
  LEFT_BRACKET, // (
  RIGHT_BRACKET, // )
  lEFT_BRACE, // {
  RIGHT_BRACE, // }
  SEMICOLON, // ;
  EXCLAMATION, // !
  EOF,
}

export interface CellDataMap {
  set(row: number, col: number, sheetId: string, value: any): void;
  get(row: number, col: number, sheetId: string): any;
  convertSheetNameToSheetId(sheetName: string): string;
}

export interface DefinedNamesMap {
  set(name: string, value: IRange): void;
  get(name: string): IRange;
  has(name: string): boolean;
}

export type InterpreterResult = {
  result: any;
  error: ErrorTypes | null;
  expressionStr: string;
};

export type ReferenceType = 'absolute' | 'mixed' | 'relative';


export type ConvertSheetName = (value: string) => string;