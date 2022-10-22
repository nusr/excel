export type ResultType = boolean | string | number | null | undefined;
export type ErrorTypes =
  | '#ERROR!'
  | '#DIV/0!'
  | '#NAME?'
  | '#N/A'
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
  LESS, // <
  LESS_EQUAL, // <=
  ERROR, // error
  IDENTIFIER, //
  STRING,
  NUMBER,
  TRUE,
  FALSE,
  BOOLEAN, // true false
  COLON, // :
  COMMA, // ,
  LEFT_BRACKET, // (
  RIGHT_BRACKET, // )
  MIXED_CELL,
  ABSOLUTE_CELL,
  RELATIVE_CELL,
  EOF,
}

export interface FunctionMap {
  set(name: string, value: (...list: any[]) => any): void;
  set(name: string, value: () => any): void;
  get(name: string): any;
}

export interface CellDataMap {
  set(row: number, col: number, sheetId: string, value: any): void;
  get(row: number, col: number, sheetId: string): any;
}