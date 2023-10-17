import { Range } from '@/util';
import { CellDataMap, DefinedNamesMap, FormulaData } from '@/types';
import type { Visitor, Expression, CellRangeExpression, PostUnaryExpression } from './expression';
import { BinaryExpression, UnaryExpression, CellExpression, CallExpression, LiteralExpression, TokenExpression, GroupExpression } from './expression';
export declare class Interpreter implements Visitor {
    private readonly expressions;
    private readonly functionMap;
    private readonly cellDataMap;
    private readonly definedNamesMap;
    constructor(expressions: Expression[], cellDataMap: CellDataMap, definedNamesMap: DefinedNamesMap, functionMap: FormulaData);
    interpret(): any;
    private getRangeCellValue;
    private checkNumber;
    visitBinaryExpression(data: BinaryExpression): any;
    visitCallExpression(expr: CallExpression): any;
    visitCellExpression(data: CellExpression): Range;
    visitLiteralExpression(expr: LiteralExpression): string | number | boolean;
    private addCellExpression;
    visitTokenExpression(expr: TokenExpression): any;
    visitUnaryExpression(data: UnaryExpression): any;
    private convertToCellExpression;
    visitCellRangeExpression(expr: CellRangeExpression): any;
    visitGroupExpression(expr: GroupExpression): any;
    visitPostUnaryExpression(expr: PostUnaryExpression): any;
    private evaluate;
}
