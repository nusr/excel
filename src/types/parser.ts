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
  BANG, // !
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

export type ReferenceType = 'absolute' | 'mixed' | 'relative';
