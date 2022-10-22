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
  PERCENT, // %
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
  lEFT_BRACE, // {
  RIGHT_BRACE, // }
  SEMICOLON, // ;
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

export interface VariableMap {
  set(name: string, value: any): void;
  get(name: string): any;
  has(name: string): boolean;
}

export type InterpreterResult = {
  result: any;
  error: ErrorTypes | null;
};
