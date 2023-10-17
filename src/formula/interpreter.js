import { Range, mergeRange, parseCell } from '@/util';
import { TokenType, } from '@/types';
import { CellExpression, LiteralExpression, TokenExpression, } from './expression';
import { CustomError } from './formula';
import { Token } from './token';
export class Interpreter {
    expressions;
    functionMap;
    cellDataMap;
    definedNamesMap;
    constructor(expressions, cellDataMap, definedNamesMap, functionMap) {
        this.expressions = expressions;
        this.functionMap = functionMap;
        this.cellDataMap = cellDataMap;
        this.definedNamesMap = definedNamesMap;
    }
    interpret() {
        const result = [];
        for (const item of this.expressions) {
            result.push(this.evaluate(item));
        }
        if (result.length === 1) {
            return this.getRangeCellValue(result[0]);
        }
        else {
            throw new CustomError('#ERROR!');
        }
    }
    getRangeCellValue(value) {
        if (value instanceof Range) {
            if (value.colCount === value.rowCount && value.colCount === 1) {
                return this.cellDataMap.get(value.row, value.col, value.sheetId);
            }
            else {
                throw new CustomError('#REF!');
            }
        }
        return value;
    }
    checkNumber(value) {
        if (typeof value !== 'number') {
            throw new CustomError('#VALUE!');
        }
    }
    visitBinaryExpression(data) {
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
    visitCallExpression(expr) {
        const callee = this.evaluate(expr.name);
        if (callee && typeof callee === 'function') {
            const params = [];
            for (const item of expr.params) {
                const t = this.evaluate(item);
                if (t instanceof Range) {
                    const { row, col, rowCount, colCount, sheetId } = t;
                    for (let r = row, endRow = row + rowCount; r < endRow; r++) {
                        for (let c = col, endCol = col + colCount; c < endCol; c++) {
                            params.push(this.cellDataMap.get(r, c, sheetId));
                        }
                    }
                }
                else {
                    params.push(t);
                }
            }
            return callee(...params);
        }
        throw new CustomError('#NAME?');
    }
    visitCellExpression(data) {
        let sheetId = '';
        if (data.sheetName) {
            sheetId = this.cellDataMap.convertSheetNameToSheetId(data.sheetName.value);
            if (!sheetId) {
                throw new CustomError('#NAME?');
            }
        }
        const t = parseCell(data.value.value);
        if (t === null) {
            throw new CustomError('#NAME?');
        }
        if (sheetId) {
            t.sheetId = sheetId;
        }
        return t;
    }
    visitLiteralExpression(expr) {
        const { type, value } = expr.value;
        switch (type) {
            case TokenType.STRING:
                return value;
            case TokenType.NUMBER: {
                const t = parseFloat(value);
                if (isNaN(t)) {
                    throw new CustomError('#VALUE!');
                }
                return t;
            }
            case TokenType.TRUE:
                return true;
            case TokenType.FALSE:
                return false;
            default:
                throw new CustomError('#ERROR!');
        }
    }
    addCellExpression(value, type, sheetName) {
        value.value = value.value.toUpperCase();
        const result = new CellExpression(value, type, sheetName);
        return this.visitCellExpression(result);
    }
    visitTokenExpression(expr) {
        const { value, type } = expr.value;
        const defineName = value.toLowerCase();
        if (this.definedNamesMap.has(defineName)) {
            const value = this.definedNamesMap.get(defineName);
            return this.cellDataMap.get(value.row, value.col, value.sheetId);
        }
        const funcName = value.toUpperCase();
        if (this.functionMap[funcName]) {
            return this.functionMap[funcName];
        }
        const realValue = funcName;
        const newToken = new Token(type, realValue);
        if (/^\$[A-Z]+\$\d+$/.test(realValue) ||
            /^\$[A-Z]+$/.test(realValue) ||
            /^\$\d+$/.test(realValue)) {
            return this.addCellExpression(newToken, 'absolute', null);
        }
        if (/^\$[A-Z]+\d+$/.test(realValue) || /^[A-Z]+\$\d+$/.test(realValue)) {
            return this.addCellExpression(newToken, 'mixed', null);
        }
        if (/^[A-Z]+\d+$/.test(realValue) || /^[A-Z]+$/.test(realValue)) {
            return this.addCellExpression(newToken, 'relative', null);
        }
        throw new CustomError('#NAME?');
    }
    visitUnaryExpression(data) {
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
    convertToCellExpression(expr) {
        if (expr instanceof CellExpression) {
            return expr;
        }
        if (expr instanceof TokenExpression) {
            return new CellExpression(new Token(TokenType.IDENTIFIER, expr.value.value.toUpperCase()), 'relative', null);
        }
        if (expr instanceof LiteralExpression) {
            if (expr.value.type === TokenType.NUMBER &&
                /^\d+$/.test(expr.value.value)) {
                return new CellExpression(new Token(TokenType.IDENTIFIER, expr.value.value), 'relative', null);
            }
        }
        return null;
    }
    visitCellRangeExpression(expr) {
        switch (expr.operator.type) {
            case TokenType.COLON: {
                const left = this.convertToCellExpression(expr.left);
                const right = this.convertToCellExpression(expr.right);
                if (left !== null && right !== null) {
                    const a = this.visitCellExpression(left);
                    const b = this.visitCellExpression(right);
                    const result = mergeRange(a, b);
                    if (result === null) {
                        throw new CustomError('#NAME?');
                    }
                    return result;
                }
                else {
                    throw new CustomError('#NAME?');
                }
                break;
            }
            case TokenType.EXCLAMATION: {
                const right = this.convertToCellExpression(expr.right);
                if (right === null) {
                    throw new CustomError('#REF!');
                }
                if (expr.left instanceof TokenExpression) {
                    return this.visitCellExpression(new CellExpression(right.value, right.type, expr.left.value));
                }
                throw new CustomError('#NAME?');
            }
            default:
                throw new CustomError('#NAME?');
        }
    }
    visitGroupExpression(expr) {
        return this.evaluate(expr.value);
    }
    visitPostUnaryExpression(expr) {
        const value = this.evaluate(expr.left);
        switch (expr.operator.type) {
            case TokenType.PERCENT:
                this.checkNumber(value);
                return value * 0.01;
            default:
                throw new CustomError('#VALUE!');
        }
    }
    evaluate(expr) {
        return expr.accept(this);
    }
}
//# sourceMappingURL=interpreter.js.map