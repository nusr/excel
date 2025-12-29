import { IRange, WorksheetType, ModelCellType } from '../types';
import { type SheetRange } from '../util/range';

export type ResultType = boolean | string | number;

/**
 * Enum representing various token types used in the parser.
 */
export enum TokenType {
  /**
   * Equal sign `=`.
   */
  EQUAL,

  /**
   * Not equal sign `<>`.
   */
  NOT_EQUAL,

  /**
   * Plus sign `+`.
   */
  PLUS,

  /**
   * Minus sign `-`.
   */
  MINUS,

  /**
   * Multiplication sign `*`.
   */
  STAR,

  /**
   * Division sign `/`.
   */
  SLASH,

  /**
   * Exponentiation sign `^`.
   */
  EXPONENT,

  /**
   * Greater than sign `>`.
   */
  GREATER,

  /**
   * Greater than or equal to sign `>=`.
   */
  GREATER_EQUAL,

  /**
   * Concatenation sign `&`.
   */
  CONCATENATE,

  /**
   * Colon `:` used as a range operator.
   */
  COLON,

  /**
   * Comma `,` used as a union operator.
   */
  COMMA,

  /**
   * Empty character `' '` used as an intersection operator.
   */
  EMPTY_CHAR,

  /**
   * Percent sign `%`.
   */
  PERCENT,

  /**
   * Less than sign `<`.
   */
  LESS,

  /**
   * Less than or equal to sign `<=`.
   */
  LESS_EQUAL,

  /**
   * String literal.
   */
  STRING,

  /**
   * Number literal (integer or float).
   */
  NUMBER,

  /**
   * Boolean literal (`TRUE` or `FALSE`).
   */
  BOOL,

  /**
   * Error value (e.g., `#DIV/0!`, `#NAME?`, `#N/A`, `#NULL!`, `#NUM!`, `#VALUE!`, `#GETTING_DATA`).
   */
  ERROR,

  /**
   * Reference error `#REF!`.
   */
  ERROR_REF,

  /**
   * Left bracket `(`.
   */
  LEFT_BRACKET,

  /**
   * Right bracket `)`.
   */
  RIGHT_BRACKET,

  /**
   * Left brace `{`.
   */
  lEFT_BRACE,

  /**
   * Right brace `}`.
   */
  RIGHT_BRACE,

  /**
   * Semicolon `;`.
   */
  SEMICOLON,

  /**
   * Exclamation mark `!`.
   */
  EXCLAMATION,

  /**
   * R1C1 reference style.
   */
  R1C1,

  /**
   * Sheet name followed by an exclamation mark `!`.
   */
  SHEET_NAME,

  /**
   * Cell reference (e.g., `A1`, `$A$1`).
   */
  CELL,

  /**
   * Column reference (e.g., `A`, `$A`).
   */
  COLUMN,

  /**
   * Row reference (e.g., `1`, `$1`).
   */
  ROW,

  /**
   * Defined name (e.g., named ranges or variables).
   */
  DEFINED_NAME,

  /**
   * Built-in Excel function followed by a left parenthesis `(`.
   */
  EXCEL_FUNCTION,

  /**
   * Reference function (e.g., `INDEX`, `OFFSET`, `INDIRECT`) followed by a left parenthesis `(`.
   */
  REF_FUNCTION,

  /**
   * Conditional reference function (e.g., `IF`, `CHOOSE`) followed by a left parenthesis `(`.
   */
  REF_FUNCTION_COND,

  /**
   * End of file.
   */
  EOF,
}

/**
 * Interface representing a map of cell data operations.
 */
export interface CellDataMap {
  /**
   * Sets the value of a specified range of cells.
   * @param range - The range of cells to set the value for.
   * @param value - A 2D array of values to set in the specified range.
   */
  set: (range: IRange, value: ResultType[][]) => void;

  /**
   * Retrieves the data of a specific cell within a range.
   * @param range - The range containing the cell to retrieve.
   * @returns The data of the specified cell, or undefined if the cell does not exist.
   */
  getCell: (range: IRange) => ModelCellType | undefined;

  /**
   * Retrieves information about a worksheet.
   * @param sheetId - The ID of the sheet to retrieve information for (optional).
   * @param sheetName - The name of the sheet to retrieve information for (optional).
   * @returns The information of the specified worksheet, or undefined if the sheet does not exist.
   */
  getSheetInfo: (
    sheetId?: string,
    sheetName?: string,
  ) => WorksheetType | undefined;

  /**
   * Sets a defined name for a specific range.
   * @param name - The name to define.
   * @param value - The range to associate with the defined name.
   */
  setDefinedName: (name: string, value: IRange) => void;

  /**
   * Retrieves the range associated with a defined name.
   * @param name - The defined name to look up.
   * @returns The range associated with the defined name, or undefined if the name does not exist.
   */
  getDefinedName: (name: string) => SheetRange | undefined;

  /**
   * Handles the data of a specific cell.
   * @param value - The data of the cell to handle.
   * @param coord - The coordinates of the cell to handle.
   * @returns An array of results from handling the cell data.
   */
  handleCell: (
    value: ModelCellType | undefined,
    coord: Pick<IRange, 'sheetId' | 'row' | 'col'>,
  ) => ResultType[];

  /**
   * Retrieves a function by its name.
   * @param name - The name of the function to retrieve.
   * @returns The function associated with the specified name, or undefined if the function does not exist.
   */
  getFunction: (name: string) => any;
}

/**
 * Represents the result of an interpretation process.
 */
export interface InterpreterResult {
  /**
   * An array of results produced by the interpreter.
   */
  result: ResultType[];

  /**
   * An optional string representation of the expression that was interpreted.
   */
  expressionStr?: string;
}

export type ReferenceType = 'absolute' | 'mixed' | 'relative';

export type ConvertSheetName = (value: string) => string;
