import { Range, parseReference, parseCell } from '@/util';
import {
  TokenType,
  FunctionMap,
  CellDataMap,
  ErrorTypes,
  VariableMap,
} from '@/types';
import type { Visitor, Expression, CellRangeExpression } from './expression';
import {
  BinaryExpression,
  UnaryExpression,
  CellExpression,
  CallExpression,
  LiteralExpression,
  ErrorExpression,
  DefineNameExpression,
  GroupExpression,
} from './expression';
import { CustomError } from './error';
import { Token } from './token';

export class Interpreter implements Visitor {
  private readonly expressions: Expression[];
  private readonly functionMap: FunctionMap;
  private readonly cellDataMap: CellDataMap;
  private readonly variableMap: VariableMap;
  constructor(
    expressions: Expression[],
    functionMap: FunctionMap,
    cellDataMap: CellDataMap,
    variableMap: VariableMap,
  ) {
    this.expressions = expressions;
    this.functionMap = functionMap;
    this.cellDataMap = cellDataMap;
    this.variableMap = variableMap;
  }
  interpret(): any {
    const result: any[] = [];
    for (const item of this.expressions) {
      result.push(this.evaluate(item));
    }
    if (result.length === 1) {
      return this.getRangeCellValue(result[0]);
    } else {
      throw new CustomError('#ERROR!');
    }
  }
  private getRangeCellValue(value: any): any {
    if (value instanceof Range) {
      if (value.colCount === value.rowCount && value.colCount === 1) {
        return this.cellDataMap.get(value.row, value.col, value.sheetId);
      } else {
        throw new CustomError('#REF!');
      }
    }
    return value;
  }
  private checkNumber(value: any) {
    if (typeof value !== 'number') {
      throw new CustomError('#VALUE!');
    }
  }
  visitBinaryExpression(data: BinaryExpression): any {
    let left = this.evaluate(data.left);
    let right = this.evaluate(data.right);
    left = this.getRangeCellValue(left);
    right = this.getRangeCellValue(right);
    switch (data.operator.type) {
      case TokenType.MINUS:
        this.checkNumber(left);
        this.checkNumber(right);
        return left - right;
      case TokenType.PLUS:
        this.checkNumber(left);
        this.checkNumber(right);
        return left + right;
      case TokenType.SLASH:
        this.checkNumber(left);
        this.checkNumber(right);
        if (right === 0) {
          throw new CustomError('#DIV/0!');
        }
        return left / right;
      case TokenType.STAR:
        this.checkNumber(left);
        this.checkNumber(right);
        return left * right;
      case TokenType.EXPONENT:
        this.checkNumber(left);
        this.checkNumber(right);
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
        throw new CustomError('#VALUE!');
    }
  }
  visitCallExpression(expr: CallExpression) {
    const callee: any = this.functionMap.get(expr.name.value);
    if (callee && typeof callee === 'function') {
      const params: any[] = [];
      for (const item of expr.params) {
        const t = this.evaluate(item);
        if (t instanceof Range) {
          const { row, col, rowCount, colCount, sheetId } = t;
          for (let r = row, endRow = row + rowCount; r < endRow; r++) {
            for (let c = col, endCol = col + colCount; c < endCol; c++) {
              params.push(this.cellDataMap.get(r, c, sheetId));
            }
          }
        } else {
          params.push(t);
        }
      }
      return callee(...params);
    }
    throw new CustomError('#NAME?');
  }
  visitCellExpression(data: CellExpression) {
    const t = parseCell(data.value.value);
    if (t === null) {
      throw new CustomError('#REF!');
    }
    return t;
  }
  visitErrorExpression(data: ErrorExpression) {
    throw new CustomError(data.value.value as ErrorTypes);
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
        throw new CustomError('#ERROR!');
    }
  }
  visitDefineNameExpression(expr: DefineNameExpression) {
    if (!this.variableMap.has(expr.value.value)) {
      throw new CustomError('#NAME?');
    }
    const result = this.variableMap.get(expr.value.value);
    return result;
  }
  visitUnaryExpression(data: UnaryExpression): any {
    const value = this.evaluate(data.right);
    switch (data.operator.type) {
      case TokenType.MINUS:
        return -value;
      case TokenType.PLUS:
        return value;
      default:
        throw new CustomError('#VALUE!');
    }
  }
  private convertToCellExpression(expr: Expression): CellExpression | null {
    if (expr instanceof CellExpression) {
      return expr;
    }
    if (expr instanceof DefineNameExpression) {
      return new CellExpression(
        new Token(TokenType.IDENTIFIER, expr.value.value.toUpperCase()),
        'relative',
        null,
      );
    }
    if (expr instanceof LiteralExpression) {
      if (
        expr.value.type === TokenType.NUMBER &&
        /^\d+$/.test(expr.value.value)
      ) {
        return new CellExpression(
          new Token(TokenType.IDENTIFIER, expr.value.value),
          'relative',
          null,
        );
      }
    }
    return null;
  }
  visitCellRangeExpression(expr: CellRangeExpression): any {
    switch (expr.operator.type) {
      case TokenType.COLON: {
        const left = this.convertToCellExpression(expr.left);
        const right = this.convertToCellExpression(expr.right);
        if (left !== null && right !== null) {
          const result = parseReference(
            `${left.value.value}:${right.value.value}`,
          );
          if (result === null) {
            throw new CustomError('#REF!');
          }
          return result;
        } else {
          throw new CustomError('#REF!');
        }
        break;
      }
      default:
        throw new CustomError('#REF!');
    }
  }
  visitGroupExpression(expr: GroupExpression): any {
    return this.evaluate(expr.value);
  }
  private evaluate(expr: Expression) {
    return expr.accept(this);
  }
}
