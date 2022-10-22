import { assert, Range, parseReference, parseCell } from '@/util';
import { TokenType, FunctionMap, CellDataMap } from '@/types';
import type { Visitor, Expression, CellRangeExpression } from './expression';
import {
  BinaryExpression,
  UnaryExpression,
  CellExpression,
  CallExpression,
  LiteralExpression,
  ErrorExpression,
  TokenExpression,
} from './expression';

export class FunctionMapImpl implements FunctionMap {
  private readonly map = new Map<string, any>();
  set(name: string, value: (...list: any[]) => any) {
    this.map.set(name.toLowerCase(), value);
  }
  get(name: string) {
    return this.map.get(name.toLowerCase());
  }
}

export class CellDataMapImpl implements CellDataMap {
  private readonly map = new Map<string, any>();
  private getKey(row: number, col: number, sheetId: string = '') {
    const key = `${row}${col}${sheetId}`;
    console.log('key:', key);
    return key;
  }
  set(row: number, col: number, sheetId: string, value: any): void {
    const key = this.getKey(row, col, sheetId);
    this.map.set(key, value);
  }
  get(row: number, col: number, sheetId: string = ''): any {
    const key = this.getKey(row, col, sheetId);
    return this.map.get(key);
  }
}

export class CustomError extends Error {
  readonly value: string;
  constructor(value: string) {
    super(value);
    this.value = value;
  }
}

export class Interpreter implements Visitor {
  private readonly expressions: Expression[];
  private readonly functionMap: FunctionMap;
  private readonly cellDataMap: CellDataMap;
  constructor(
    expressions: Expression[],
    functionMap: FunctionMap,
    cellDataMap: CellDataMap,
  ) {
    this.expressions = expressions;
    this.functionMap = functionMap;
    this.cellDataMap = cellDataMap;
  }
  interpret(): any[] {
    const result: any[] = [];
    for (const item of this.expressions) {
      result.push(this.evaluate(item));
    }
    return result;
  }
  visitBinaryExpression(data: BinaryExpression): any {
    const left = this.evaluate(data.left);
    const right = this.evaluate(data.right);
    switch (data.operator.type) {
      case TokenType.MINUS:
        return left - right;
      case TokenType.PLUS:
        return left + right;
      case TokenType.SLASH:
        return left / right;
      case TokenType.STAR:
        return left * right;
      case TokenType.EXPONENT:
        return Math.pow(left, right);
      case TokenType.EQUAL:
        return left === right;
      case TokenType.NOT_EQUAL:
        return left !== right;
      case TokenType.GREATER:
        return left > right;
      case TokenType.GREATER_EQUAL:
        return left >= right;
      case TokenType.LESS:
        return left < right;
      case TokenType.LESS_EQUAL:
        return left <= right;
      case TokenType.CONCATENATE:
        return `${left}${right}`;

      default:
        throw new Error('can not handle binary:' + data.operator.error());
    }
  }
  visitCallExpression(data: CallExpression) {
    const name = this.evaluate(data.name);
    console.log('name', name);
    if (!name || typeof name !== 'string') {
      throw new Error('function name not string');
    }
    const callee: any = this.functionMap.get(name);
    if (callee && typeof callee === 'function') {
      const params: any[] = [];
      for (const item of data.params) {
        const t = this.evaluate(item);
        if (t instanceof Range) {
          const { row, col, rowCount, colCount, sheetId } = t;
          for (let r = row, endRow = row + rowCount; r < endRow; r++) {
            for (let c = col, endCol = col + colCount; c < endCol; c++) {
              params.push(this.cellDataMap.get(row, col, sheetId));
            }
          }
        } else {
          params.push(t);
        }
      }
      return callee(...params);
    }
    throw new Error('not function name');
  }
  visitCellExpression(data: CellExpression) {
    const t = parseCell(data.value.value);
    assert(t !== null);
    return this.cellDataMap.get(t.row, t.col, t.sheetId);
  }
  visitErrorExpression(data: ErrorExpression) {
    throw new CustomError(data.value.value);
  }
  visitLiteralExpression(expr: LiteralExpression) {
    const { type, value } = expr.value;
    switch (type) {
      case TokenType.STRING:
        return value;
      case TokenType.NUMBER:
        return parseFloat(value);
      case TokenType.TRUE:
        return true;
      case TokenType.FALSE:
        return false;
      default:
        throw new Error('can not handle literal:' + expr.value.error());
    }
  }
  visitTokenExpression(data: TokenExpression) {
    return data.value.value;
  }
  visitUnaryExpression(data: UnaryExpression): any {
    const value = this.evaluate(data.right);
    switch (data.operator.type) {
      case TokenType.MINUS:
        return -value;
      case TokenType.PLUS:
        return value;
      default:
        throw new Error('can not handle unary:' + data.operator.error());
    }
  }
  visitCellRangeExpression(expr: CellRangeExpression): any {
    const left = this.evaluate(expr.left);
    const right = this.evaluate(expr.right);
    switch (expr.operator.type) {
      case TokenType.COLON: {
        assert(typeof left === 'string');
        assert(typeof right === 'string');
        return parseReference(`${left}:${right}`, '');
      }
      default:
        throw new Error('can not handle cell-range:' + expr.operator.error());
    }
  }
  private evaluate(expr: Expression) {
    return expr.accept(this);
  }
}
