import { SheetRange } from '@/util/range';
import { mergeRange, parseReference } from '@/util/reference';
import { parseNumber } from '@/util/util';
import {
  TokenType,
  CellDataMap,
  DefinedNamesMap,
  FormulaType,
  ReferenceType,
  FormulaKeys,
  ResultType,
} from '@/types';
import type {
  Visitor,
  Expression,
  CellRangeExpression,
  PostUnaryExpression,
} from './expression';
import {
  BinaryExpression,
  UnaryExpression,
  CellExpression,
  CallExpression,
  LiteralExpression,
  TokenExpression,
  GroupExpression,
} from './expression';
import { CustomError, assert } from './formula';
import { Token } from './token';

export class Interpreter implements Visitor {
  private readonly expressions: Expression[];
  private readonly functionMap: FormulaType;
  private readonly cellDataMap: CellDataMap;
  private readonly definedNamesMap: DefinedNamesMap;
  constructor(
    expressions: Expression[],
    cellDataMap: CellDataMap,
    definedNamesMap: DefinedNamesMap,
    functionMap: FormulaType,
  ) {
    this.expressions = expressions;
    this.functionMap = functionMap;
    this.cellDataMap = cellDataMap;
    this.definedNamesMap = definedNamesMap;
  }
  interpret(): ResultType {
    const result: ResultType[] = [];
    for (const item of this.expressions) {
      result.push(this.evaluate(item));
    }
    if (result.length === 1) {
      return this.getRangeCellValue(result[0]);
    } else {
      throw new CustomError('#ERROR!');
    }
  }

  visitBinaryExpression(data: BinaryExpression): any {
    let left = this.evaluate(data.left);
    let right = this.evaluate(data.right);
    left = this.getRangeCellValue(left);
    right = this.getRangeCellValue(right);
    switch (data.operator.type) {
      case TokenType.MINUS:
        assert(typeof left === 'number');
        assert(typeof right === 'number');
        return left - right;
      case TokenType.PLUS:
        assert(typeof left === 'number');
        assert(typeof right === 'number');
        return left + right;
      case TokenType.SLASH:
        assert(typeof left === 'number');
        assert(typeof right === 'number');
        if (right === 0) {
          throw new CustomError('#DIV/0!');
        }
        return left / right;
      case TokenType.STAR:
        assert(typeof left === 'number');
        assert(typeof right === 'number');
        return left * right;
      case TokenType.EXPONENT:
        assert(typeof left === 'number');
        assert(typeof right === 'number');
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
    const callee = this.evaluate(expr.name);
    if (callee && typeof callee === 'function') {
      let params: ResultType[] = [];
      for (const item of expr.params) {
        const t = this.evaluate(item);
        if (t instanceof SheetRange) {
          const list = this.cellDataMap.get(t);
          params = params.concat(list);
        } else {
          params.push(t);
        }
      }
      return callee(...params);
    }
    throw new CustomError('#NAME?');
  }
  visitCellExpression(data: CellExpression) {
    let sheetId = '';
    if (data.sheetName) {
      sheetId = this.cellDataMap.convertSheetNameToSheetId(
        data.sheetName.value,
      );
      if (!sheetId) {
        throw new CustomError('#NAME?');
      }
    }
    const range = parseReference(data.value.value);
    if (!range) {
      throw new CustomError('#NAME?');
    }
    if (sheetId) {
      range.sheetId = sheetId;
    }
    return range;
  }
  visitLiteralExpression(expr: LiteralExpression) {
    const { type, value } = expr.value;
    switch (type) {
      case TokenType.STRING:
        return value;
      case TokenType.NUMBER: {
        const [check, num] = parseNumber(value);
        if (check) {
          return num;
        }
        throw new CustomError('#VALUE!');
      }
      case TokenType.TRUE:
        return true;
      case TokenType.FALSE:
        return false;
      default:
        throw new CustomError('#ERROR!');
    }
  }

  visitTokenExpression(expr: TokenExpression) {
    const { value, type } = expr.value;
    const defineName = value.toLowerCase();
    if (this.definedNamesMap.get(defineName)) {
      const temp = this.definedNamesMap.get(defineName)!;
      return this.cellDataMap.get(temp)[0];
    }
    const funcName = value.toUpperCase();
    const func = this.functionMap[funcName as FormulaKeys];
    if (func) {
      return func;
    }
    const realValue = funcName;
    const newToken = new Token(type, realValue);
    if (
      /^\$[A-Z]+\$\d+$/.test(realValue) ||
      /^\$[A-Z]+$/.test(realValue) ||
      /^\$\d+$/.test(realValue)
    ) {
      return this.addCellExpression(newToken, 'absolute', undefined);
    }
    if (/^\$[A-Z]+\d+$/.test(realValue) || /^[A-Z]+\$\d+$/.test(realValue)) {
      return this.addCellExpression(newToken, 'mixed', undefined);
    }
    if (/^[A-Z]+\d+$/.test(realValue) || /^[A-Z]+$/.test(realValue)) {
      return this.addCellExpression(newToken, 'relative', undefined);
    }

    throw new CustomError('#NAME?');
  }
  visitUnaryExpression(data: UnaryExpression): any {
    const value = this.evaluate(data.right);
    switch (data.operator.type) {
      case TokenType.MINUS:
        assert(typeof value === 'number');
        return -value;
      case TokenType.PLUS:
        assert(typeof value === 'number');
        return value;
      default:
        throw new CustomError('#VALUE!');
    }
  }

  visitCellRangeExpression(expr: CellRangeExpression): any {
    switch (expr.operator.type) {
      case TokenType.COLON: {
        const left = this.convertToCellExpression(expr.left);
        const right = this.convertToCellExpression(expr.right);
        if (left && right) {
          const a = this.visitCellExpression(left);
          const b = this.visitCellExpression(right);
          const result = mergeRange(a, b);
          if (!result) {
            throw new CustomError('#NAME?');
          }
          return result;
        } else {
          throw new CustomError('#NAME?');
        }
      }
      case TokenType.EXCLAMATION: {
        const right = this.convertToCellExpression(expr.right);
        if (!right) {
          throw new CustomError('#REF!');
        }
        if (expr.left instanceof TokenExpression) {
          return this.visitCellExpression(
            new CellExpression(right.value, right.type, expr.left.value),
          );
        }
        throw new CustomError('#NAME?');
      }
      default:
        throw new CustomError('#NAME?');
    }
  }
  visitGroupExpression(expr: GroupExpression): any {
    return this.evaluate(expr.value);
  }
  visitPostUnaryExpression(expr: PostUnaryExpression): any {
    const value = this.evaluate(expr.left);
    switch (expr.operator.type) {
      case TokenType.PERCENT:
        assert(typeof value === 'number');
        return value * 0.01;
      default:
        throw new CustomError('#VALUE!');
    }
  }
  private evaluate(expr: Expression) {
    return expr.accept(this);
  }
  private convertToCellExpression(
    expr: Expression,
  ): CellExpression | undefined {
    if (expr instanceof CellExpression) {
      return expr;
    }
    if (expr instanceof TokenExpression) {
      return new CellExpression(
        new Token(TokenType.IDENTIFIER, expr.value.value.toUpperCase()),
        'relative',
        undefined,
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
          undefined,
        );
      }
    }
    return undefined;
  }
  private addCellExpression(
    value: Token,
    type: ReferenceType,
    sheetName: Token | undefined,
  ) {
    value.value = value.value.toUpperCase();
    const result = new CellExpression(value, type, sheetName);
    return this.visitCellExpression(result);
  }
  private getRangeCellValue(value: any): ResultType {
    if (value instanceof SheetRange) {
      if (value.colCount === value.rowCount && value.colCount === 1) {
        const list = this.cellDataMap.get(value);
        return list[0];
      } else {
        throw new CustomError('#REF!');
      }
    }
    return value;
  }
}
