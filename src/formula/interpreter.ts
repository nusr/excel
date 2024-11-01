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
} from './expression';
import {
  BinaryExpression,
  UnaryExpression,
  CellExpression,
  CallExpression,
  LiteralExpression,
  GroupExpression,
  ArrayExpression,
} from './expression';
import { CustomError } from './formula';

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
  interpret(): ResultType[] {
    let result: ResultType[] = [];
    for (const item of this.expressions) {
      const temp = this.evaluate(item);
      const r = this.getRangeCellValue(temp);
      if (Array.isArray(r)) {
        result = result.concat(r);
      } else {
        result.push(r);
      }
    }
    return result;
  }

  visitBinaryExpression(data: BinaryExpression): any {
    let left = this.evaluate(data.left);
    let right = this.evaluate(data.right);
    left = this.getOneValue(left);
    right = this.getOneValue(right);
    if (
      [
        TokenType.MINUS,
        TokenType.PLUS,
        TokenType.SLASH,
        TokenType.STAR,
        TokenType.EXPONENT,
      ].includes(data.operator.type)
    ) {
      left = this.parseNumber(left);
      right = this.parseNumber(right);
    }

    switch (data.operator.type) {
      case TokenType.MINUS:
        return left - right;
      case TokenType.PLUS:
        return left + right;
      case TokenType.SLASH: {
        if (right === 0) {
          throw new CustomError('#DIV/0!');
        }
        return left / right;
      }
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
        throw new CustomError('#TEXT');
    }
  }
  visitCallExpression(expr: CallExpression) {
    const callee = this.cellDataMap.getFunction(expr.name.value);
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
  visitCellExpression(data: CellExpression) {
    let sheetId = '';
    if (data.sheetName) {
      const sheetInfo = this.cellDataMap.getSheetInfo('', data.sheetName.value);
      if (!sheetInfo?.sheetId) {
        throw new CustomError('#REF!');
      }
      sheetId = sheetInfo.sheetId;
    }
    let range: IRange | undefined = undefined;
    if (
      [
        TokenType.DEFINED_NAME,
        TokenType.CELL,
        TokenType.COLUMN,
        TokenType.R1C1,
      ].includes(data.value.type)
    ) {
      range = this.cellDataMap.getDefinedName(data.value.value);
    }
    if (!range) {
      if (data.value.type === TokenType.R1C1) {
        range = parseR1C1(data.value.value, this.currentCoord);
      } else {
        range = parseReference(data.value.value);
      }
    }
    if (!range) {
      throw new CustomError('#REF!');
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
      case TokenType.BOOL:
        return value === 'TRUE';
      default:
        throw new CustomError('#VALUE!');
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
  visitArrayExpression(expr: ArrayExpression) {
    const result: ResultType[] = [];
    for (const item of expr.value) {
      result.push(this.evaluate(item));
    }
    return result;
  }
  visitPostUnaryExpression(expr: PostUnaryExpression): any {
    const value = this.evaluate(expr.left);
    const result = this.parseNumber(this.getOneValue(value));
    switch (expr.operator.type) {
      case TokenType.PERCENT:
        return result * 0.01;
      default:
        throw new CustomError('#VALUE!');
    }
  }
  private evaluate(expr: Expression) {
    return expr.accept(this);
  }
  private getRangeCellValue(value: any) {
    if (value instanceof SheetRange) {
      if (value.colCount === value.rowCount && value.colCount === 1) {
        return this.getCellValue(value, true);
      }
      throw new CustomError('#REF!');
    }
    return value;
  }

  private getOneValue(value: any) {
    const result = this.getRangeCellValue(value);
    if (Array.isArray(result)) {
      return result[0];
    } else {
      return result;
    }
  }
  private parseNumber(value: any) {
    const [check, result] = parseNumber(value);
    if (!check) {
      throw new CustomError('#VALUE!');
    }
    return result;
  }

  private getCellValue(range: IRange, isOneCell: boolean): ResultType[] {
    let result: ResultType[] = [];
    if (isOneCell) {
      const t = this.cellDataMap.getCell(range);
      const r = this.cellDataMap.handleCell(t, {
        row: range.row,
        col: range.col,
      });
      result = result.concat(r);
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
      result = result.concat(a);
      return false;
    });
    return result;
  }
}
