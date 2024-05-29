import { SheetRange, iterateRange } from '@/util/range';
import { mergeRange, parseReference, parseR1C1 } from '@/util/reference';
import { parseNumber } from '@/util/util';
import {
  TokenType,
  CellDataMap,
  ResultType,
  IRange,
  Coordinate,
} from '@/types';
import type {
  Visitor,
  Expression,
  CellRangeExpression,
  PostUnaryExpression,
  R1C1Expression,
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
import { CustomError, assert, isRelativeReference } from './formula';

export class Interpreter implements Visitor {
  private readonly expressions: Expression[];
  private readonly cellDataMap: CellDataMap;
  private currentCoord: Coordinate;
  constructor(
    expressions: Expression[],
    currentCoord: Coordinate,
    cellDataMap: CellDataMap,
  ) {
    this.expressions = expressions;
    this.cellDataMap = cellDataMap;
    this.currentCoord = currentCoord;
  }
  interpret(): ResultType {
    const result: ResultType[] = [];
    for (const item of this.expressions) {
      result.push(this.evaluate(item));
    }
    if (result.length === 1) {
      return this.getRangeCellValue(result[0]);
    } else {
      throw new CustomError('string');
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
          const list = this.getCellValue(t, false);
          params = params.concat(list);
        } else {
          params.push(t);
        }
      }
      return callee(...params);
    }
    throw new CustomError('#NAME?');
  }
  visitR1C1Expression(data: R1C1Expression) {
    const range = parseR1C1(data.value.value, this.currentCoord);
    if (!range) {
      throw new CustomError('#NAME?');
    }
    return range;
  }
  visitCellExpression(data: CellExpression) {
    let sheetId = '';
    if (data.sheetName) {
      const sheetInfo = this.cellDataMap.getSheetInfo('', data.sheetName.value);
      if (!sheetInfo) {
        throw new CustomError('#REF!');
      }
      sheetId = sheetInfo.sheetId;
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
      case TokenType.FLOAT:
      case TokenType.INTEGER: {
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
    const { value } = expr.value;
    const defineName = value.toLowerCase();
    if (this.cellDataMap.getDefinedName(defineName)) {
      const temp = this.cellDataMap.getDefinedName(defineName)!;
      return this.getCellValue(temp, true)[0];
    }
    const func = this.cellDataMap.getFunction(value.toUpperCase());
    if (func) {
      return func;
    }
    if (isRelativeReference(value)) {
      return this.visitCellExpression(
        new CellExpression(expr.value, 'relative', undefined),
      );
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
        const a = this.visitCellExpression(expr.left);
        const b = this.visitCellExpression(expr.right);
        const result = mergeRange(a, b);
        if (!result) {
          throw new CustomError('#NAME?');
        }
        return result;
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
  private getRangeCellValue(value: any): ResultType {
    if (value instanceof SheetRange) {
      if (value.colCount === value.rowCount && value.colCount === 1) {
        return this.getCellValue(value, true)[0];
      } else {
        throw new CustomError('#REF!');
      }
    }
    return value;
  }

  private getCellValue(range: IRange, isOneCell: boolean): ResultType[] {
    const result: ResultType[] = [];
    if (isOneCell) {
      const t = this.cellDataMap.getCell(range);
      const r = this.cellDataMap.handleCell(t, {
        row: range.row,
        col: range.col,
      });
      if (r !== undefined) {
        result.push(r);
      }
      return result;
    }
    const { row, col, sheetId } = range;
    const sheetInfo = this.cellDataMap.getSheetInfo(sheetId);
    if (!sheetInfo || row >= sheetInfo.rowCount || col >= sheetInfo.colCount) {
      throw new CustomError('#REF!');
    }
    iterateRange(range, sheetInfo, (r, c) => {
      const t = this.cellDataMap.getCell({
        row: r,
        col: c,
        rowCount: 1,
        colCount: 1,
        sheetId,
      });
      const a = this.cellDataMap.handleCell(t, { row: r, col: c });
      if (a !== undefined) {
        result.push(a);
      }
      return false;
    });
    return result;
  }
}
