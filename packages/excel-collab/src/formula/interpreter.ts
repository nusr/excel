import {
  SheetRange,
  mergeRange,
  parseReference,
  parseR1C1,
} from '../util';
import { TokenType } from '../types';

import type { CellDataMap, ResultType, IRange } from '../types';
import type {
  Visitor,
  Expression,
  PostUnaryExpression,
} from './expression';
import {
  BinaryExpression,
  UnaryExpression,
  CellExpression,
  CallExpression,
  LiteralExpression,
  GroupExpression,
  ArrayExpression,
  CellRangeExpression,
  MissingExpression,
} from './expression';
import { getCustomError, anyError } from '../util';
import { Scanner } from './scanner';
import { Parser } from './parser';
import { convertDateToNumber } from './numberFormat';

type Scalar = ResultType | null;
type Value = Scalar | SheetRange | Value[];

export class Interpreter implements Visitor {
  private readonly expressions: Expression[];
  private readonly cellDataMap: CellDataMap;
  private currentCoord: Pick<IRange, 'sheetId' | 'row' | 'col'>;
  constructor(
    expressions: Expression[],
    currentCoord: Pick<IRange, 'sheetId' | 'row' | 'col'>,
    cellDataMap: CellDataMap,
  ) {
    this.expressions = expressions;
    this.cellDataMap = cellDataMap;
    this.currentCoord = currentCoord;
  }
  interpret(): ResultType[] {
    return this.expressions.flatMap((item) => this.flatten(this.evaluate(item)));
  }

  visitBinaryExpression(data: BinaryExpression): Scalar {
    const left = this.getOneValue(this.evaluate(data.left));
    const right = this.getOneValue(this.evaluate(data.right));
    switch (data.operator.type) {
      case TokenType.MINUS:
        return this.parseNumber(left) - this.parseNumber(right);
      case TokenType.PLUS:
        return this.parseNumber(left) + this.parseNumber(right);
      case TokenType.SLASH: {
        const divisor = this.parseNumber(right);
        if (divisor === 0) throw getCustomError('#DIV/0!');
        return this.parseNumber(left) / divisor;
      }
      case TokenType.STAR:
        return this.parseNumber(left) * this.parseNumber(right);
      case TokenType.EXPONENT:
        return Math.pow(this.parseNumber(left), this.parseNumber(right));
      case TokenType.EQUAL:
        return this.compare(left, right) === 0;
      case TokenType.NOT_EQUAL:
        return this.compare(left, right) !== 0;
      case TokenType.GREATER:
        return this.compare(left, right) > 0;
      case TokenType.GREATER_EQUAL:
        return this.compare(left, right) >= 0;
      case TokenType.LESS:
        return this.compare(left, right) < 0;
      case TokenType.LESS_EQUAL:
        return this.compare(left, right) <= 0;
      case TokenType.CONCATENATE:
        return this.text(left) + this.text(right);
      default:
        throw getCustomError('#GETTING_DATA');
    }
  }
  visitCallExpression(expr: CallExpression): Value {
    const name = expr.name.value;
    const argument = (index: number) => this.evaluate(expr.params[index]);
    const scalar = (index: number) => this.getOneValue(argument(index));
    if (name === 'IF') {
      this.checkArity(expr, 2, 3);
      return this.boolean(scalar(0)) ? argument(1) : expr.params.length === 3 ? argument(2) : false;
    }
    if (name === 'CHOOSE') {
      this.checkArity(expr, 2, 255);
      const index = Math.trunc(this.parseNumber(scalar(0)));
      if (index < 1 || index >= expr.params.length) throw getCustomError('#VALUE!');
      return argument(index);
    }
    if (name === 'IFERROR' || name === 'IFNA') {
      this.checkArity(expr, 2, 2);
      try {
        const value = argument(0);
        if (value instanceof SheetRange) this.matrix(value);
        else this.flatten(value);
        return value;
      } catch (error) {
        const code = anyError(error);
        if (!code || (name === 'IFNA' && code !== '#N/A')) throw error;
        return argument(1);
      }
    }
    if (name === 'INDEX') return this.index(expr);
    if (name === 'OFFSET') return this.offset(expr);
    if (name === 'INDIRECT') return this.indirect(expr);
    if (['ISERROR', 'ISERR', 'ISNA', 'ISBLANK', 'ISLOGICAL', 'ISNONTEXT', 'ISNUMBER', 'ISTEXT'].includes(name)) {
      this.checkArity(expr, 1, 1);
      let value: Scalar | Error;
      try {
        value = scalar(0);
      } catch (error) {
        const code = anyError(error);
        if (!code) throw error;
        value = getCustomError(code);
      }
      return this.functionValue(this.cellDataMap.getFunction(name)(value));
    }
    const callee = this.cellDataMap.getFunction(expr.name.value);
    if (callee && typeof callee === 'function') {
      const params = expr.params.map((item) => {
        if (item instanceof MissingExpression) return undefined;
        const value = this.evaluate(item);
        return value instanceof SheetRange ? this.matrix(value) : value;
      });
      return this.functionValue(callee(...params));
    }
    throw getCustomError('#NAME?');
  }
  visitCellExpression(data: CellExpression): SheetRange {
    let sheetId = '';
    if (data.sheetName) {
      const sheetInfo = this.cellDataMap.getSheetInfo('', data.sheetName.value);
      if (!sheetInfo?.sheetId) {
        throw getCustomError('#REF!');
      }
      sheetId = sheetInfo.sheetId;
    }
    let range: SheetRange | undefined;
    if (
      [
        TokenType.DEFINED_NAME,
        TokenType.CELL,
        TokenType.COLUMN,
        TokenType.R1C1,
      ].includes(data.value.type)
    ) {
      const defined = this.cellDataMap.getDefinedName(data.value.value);
      if (defined) range = SheetRange.makeRange(defined);
    }
    if (!range) {
      if (data.value.type === TokenType.R1C1) {
        range = parseR1C1(data.value.value, this.currentCoord);
      } else {
        range = parseReference(data.value.value);
      }
    }
    if (!range) {
      throw getCustomError(data.value.type === TokenType.DEFINED_NAME ? '#NAME?' : '#REF!');
    }
    if (sheetId) {
      range.sheetId = sheetId;
    }
    if (!range.sheetId) range.sheetId = this.currentCoord.sheetId || this.cellDataMap.getSheetInfo()?.sheetId || '';
    return range;
  }
  visitLiteralExpression(expr: LiteralExpression) {
    const { type, value } = expr.value;
    switch (type) {
      case TokenType.STRING:
        return value;
      case TokenType.NUMBER: {
        const number = Number(value);
        if (Number.isNaN(number)) throw getCustomError('#VALUE!');
        if (!Number.isFinite(number)) throw getCustomError('#NUM!');
        return number;
      }
      case TokenType.BOOL:
        return value === 'TRUE';
      case TokenType.ERROR:
      case TokenType.ERROR_REF: {
        const error = anyError(value);
        if (error) throw getCustomError(error);
        throw getCustomError('#VALUE!');
      }
      default:
        throw getCustomError('#VALUE!');
    }
  }
  visitUnaryExpression(data: UnaryExpression): any {
    const value = this.evaluate(data.right);
    const result = this.parseNumber(this.getOneValue(value));
    switch (data.operator.type) {
      case TokenType.MINUS:
        return -result;
      case TokenType.PLUS:
        return result;
      default:
        throw getCustomError('#VALUE!');
    }
  }

  visitCellRangeExpression(expr: CellRangeExpression): any {
    switch (expr.operator.type) {
      case TokenType.COLON: {
        const a = this.evaluate(expr.left);
        let b: Value;
        if (expr.right instanceof CellExpression && !expr.right.sheetName &&
          !this.cellDataMap.getDefinedName(expr.right.value.value) && a instanceof SheetRange) {
          b = this.visitCellExpression(expr.right);
          b.sheetId = a.sheetId;
        } else {
          b = this.evaluate(expr.right);
        }
        if (!(a instanceof SheetRange) || !(b instanceof SheetRange)) throw getCustomError('#REF!');
        const result = mergeRange(a, b);
        if (!result) {
          throw getCustomError('#REF!');
        }
        return result;
      }
      default:
        throw getCustomError('#NAME?');
    }
  }
  visitGroupExpression(expr: GroupExpression): any {
    return this.evaluate(expr.value);
  }
  visitArrayExpression(expr: ArrayExpression) {
    const result = expr.value.map((item) => this.getOneValue(this.evaluate(item)));
    if (expr.rowWidth === result.length) return result;
    const rows: Scalar[][] = [];
    for (let i = 0; i < result.length; i += expr.rowWidth) rows.push(result.slice(i, i + expr.rowWidth));
    return rows;
  }
  visitMissingExpression() {
    return null;
  }
  visitPostUnaryExpression(expr: PostUnaryExpression): any {
    const value = this.evaluate(expr.left);
    const result = this.parseNumber(this.getOneValue(value));
    switch (expr.operator.type) {
      case TokenType.PERCENT:
        return result * 0.01;
      default:
        throw getCustomError('#VALUE!');
    }
  }
  private evaluate(expr: Expression): Value {
    const value: Value = expr.accept(this);
    if (typeof value === 'number' && !Number.isFinite(value)) throw getCustomError('#NUM!');
    return value;
  }
  private getRangeCellValue(value: Value): Scalar | Value[] {
    if (value instanceof SheetRange) {
      if (value.colCount === value.rowCount && value.colCount === 1) {
        return this.readCell(value);
      }
      throw getCustomError('#REF!');
    }
    return value;
  }

  private getOneValue(value: Value): Scalar {
    const result = this.getRangeCellValue(value);
    return Array.isArray(result) ? this.getOneValue(result[0] ?? null) : result;
  }
  private parseNumber(value: Scalar): number {
    const result = Number(value);
    if (Number.isNaN(result)) throw getCustomError('#VALUE!');
    if (!Number.isFinite(result)) throw getCustomError('#NUM!');
    return result;
  }

  private flatten(value: Value): ResultType[] {
    const result = this.getRangeCellValue(value);
    return Array.isArray(result) ? result.flatMap((item) => this.flatten(item)) : [result ?? 0];
  }

  private dimensions(range: SheetRange) {
    const sheet = this.cellDataMap.getSheetInfo(range.sheetId);
    if (!sheet) throw getCustomError('#REF!');
    const rows = range.rowCount || sheet.rowCount;
    const cols = range.colCount || sheet.colCount;
    if (![range.row, range.col, rows, cols].every(Number.isInteger) ||
      range.row < 0 || range.col < 0 || rows <= 0 || cols <= 0 ||
      range.row + rows > sheet.rowCount || range.col + cols > sheet.colCount) throw getCustomError('#REF!');
    return { rows, cols };
  }

  private readCell(range: SheetRange): Scalar | ResultType[] {
    this.dimensions(range);
    const cell = this.cellDataMap.getCell(range);
    if (!cell) return null;
    const values = this.cellDataMap.handleCell(cell, range);
    return values.length === 1 ? values[0] : values.length ? values : null;
  }

  private matrix(value: Value): Scalar[][] {
    if (value instanceof SheetRange) {
      const { rows, cols } = this.dimensions(value);
      return Array.from({ length: rows }, (_, row) =>
        Array.from({ length: cols }, (_, col) => this.getOneValue(this.readCell(
          new SheetRange(value.row + row, value.col + col, 1, 1, value.sheetId),
        ))));
    }
    if (!Array.isArray(value)) return [[value]];
    return value.every(Array.isArray)
      ? value.map((row) => row.map((item: Value) => this.getOneValue(item)))
      : [value.map((item) => this.getOneValue(item))];
  }

  private checkArity(expr: CallExpression, min: number, max: number) {
    if (expr.params.length < min || expr.params.length > max) throw getCustomError('#VALUE!');
  }

  private boolean(value: Scalar): boolean {
    if (typeof value === 'string') {
      if (value.toUpperCase() === 'TRUE') return true;
      if (value.toUpperCase() === 'FALSE') return false;
      throw getCustomError('#VALUE!');
    }
    return Boolean(value);
  }

  private text(value: Scalar) {
    return value === null ? '' : typeof value === 'boolean' ? String(value).toUpperCase() : String(value);
  }

  private compare(left: Scalar, right: Scalar) {
    if (left === null) left = typeof right === 'string' ? '' : typeof right === 'boolean' ? false : 0;
    if (right === null) right = typeof left === 'string' ? '' : typeof left === 'boolean' ? false : 0;
    const rank = (value: Scalar) => typeof value === 'number' ? 0 : typeof value === 'string' ? 1 : 2;
    if (typeof left !== typeof right) return rank(left) - rank(right);
    const a = typeof left === 'string' ? left.toLowerCase() : Number(left);
    const b = typeof right === 'string' ? right.toLowerCase() : Number(right);
    return a === b ? 0 : a < b ? -1 : 1;
  }

  private functionValue(value: unknown): Value {
    if (value instanceof Error) throw value;
    if (value instanceof Date) return this.functionValue(convertDateToNumber(value));
    if (Array.isArray(value)) return value.map((item) => this.functionValue(item));
    if (typeof value === 'number') {
      if (!Number.isFinite(value)) throw getCustomError('#NUM!');
      return value;
    }
    if (value === null || typeof value === 'string' || typeof value === 'boolean') return value;
    throw getCustomError('#VALUE!');
  }

  private index(expr: CallExpression): Value {
    this.checkArity(expr, 2, 4);
    const source = this.evaluate(expr.params[0]);
    const matrix = source instanceof SheetRange ? undefined : this.matrix(source);
    const { rows, cols } = source instanceof SheetRange
      ? this.dimensions(source) : { rows: matrix!.length, cols: matrix![0]?.length ?? 0 };
    let row = Math.trunc(this.parseNumber(this.getOneValue(this.evaluate(expr.params[1]))));
    let col = expr.params.length >= 3
      ? Math.trunc(this.parseNumber(this.getOneValue(this.evaluate(expr.params[2])))) : 1;
    if (expr.params.length === 2 && rows === 1) { col = row; row = 1; }
    if (expr.params.length === 4 &&
      this.parseNumber(this.getOneValue(this.evaluate(expr.params[3]))) !== 1) throw getCustomError('#REF!');
    if (row < 0 || col < 0 || row > rows || col > cols) throw getCustomError('#REF!');
    if (source instanceof SheetRange) {
      return new SheetRange(source.row + Math.max(0, row - 1), source.col + Math.max(0, col - 1),
        row === 0 ? rows : 1, col === 0 ? cols : 1, source.sheetId);
    }
    if (row === 0 && col === 0) return matrix!;
    if (row === 0) return matrix!.map((values) => [values[col - 1]]);
    return col === 0 ? matrix![row - 1] : matrix![row - 1][col - 1];
  }

  private offset(expr: CallExpression): SheetRange {
    this.checkArity(expr, 3, 5);
    const source = this.evaluate(expr.params[0]);
    if (!(source instanceof SheetRange)) throw getCustomError('#VALUE!');
    const { rows, cols } = this.dimensions(source);
    const number = (index: number) => Math.trunc(this.parseNumber(this.getOneValue(this.evaluate(expr.params[index]))));
    const height = expr.params[3] && !(expr.params[3] instanceof MissingExpression) ? number(3) : rows;
    const width = expr.params[4] && !(expr.params[4] instanceof MissingExpression) ? number(4) : cols;
    if (height <= 0 || width <= 0) throw getCustomError('#REF!');
    const range = new SheetRange(source.row + number(1), source.col + number(2), height, width, source.sheetId);
    this.dimensions(range);
    return range;
  }

  private indirect(expr: CallExpression): SheetRange {
    this.checkArity(expr, 1, 2);
    const text = this.text(this.getOneValue(this.evaluate(expr.params[0])));
    const a1 = expr.params.length === 1 || this.boolean(this.getOneValue(this.evaluate(expr.params[1])));
    try {
      const expression = new Parser(new Scanner(text).scan()).parse()[0];
      const valid = (node: Expression): boolean => {
        if (node instanceof CellRangeExpression) return valid(node.left) && valid(node.right);
        return node instanceof CellExpression &&
          (Boolean(this.cellDataMap.getDefinedName(node.value.value)) ||
            (a1 ? node.value.type !== TokenType.R1C1 : node.value.type === TokenType.R1C1));
      };
      if (!valid(expression)) throw getCustomError('#REF!');
      const range = this.evaluate(expression);
      if (!(range instanceof SheetRange)) throw getCustomError('#REF!');
      this.dimensions(range);
      return range;
    } catch (error) {
      if (anyError(error)) throw getCustomError('#REF!');
      throw error;
    }
  }
}
