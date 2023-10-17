import type { Token } from './token';
import type { ReferenceType } from '@/types';
export interface Visitor {
    visitBinaryExpression(expr: BinaryExpression): any;
    visitUnaryExpression(expr: UnaryExpression): any;
    visitPostUnaryExpression(expr: PostUnaryExpression): any;
    visitLiteralExpression(expr: LiteralExpression): any;
    visitCellExpression(expr: CellExpression): any;
    visitCellRangeExpression(expr: CellRangeExpression): any;
    visitCallExpression(expr: CallExpression): any;
    visitGroupExpression(expr: GroupExpression): any;
    visitTokenExpression(expr: TokenExpression): any;
}
export interface Expression {
    accept(visitor: Visitor): any;
    toString(): string;
}
export declare class BinaryExpression implements Expression {
    readonly left: Expression;
    readonly right: Expression;
    readonly operator: Token;
    constructor(left: Expression, operator: Token, right: Expression);
    accept(visitor: Visitor): any;
    private handleConcatenate;
    toString(): string;
}
export declare class UnaryExpression implements Expression {
    readonly right: Expression;
    readonly operator: Token;
    constructor(operator: Token, right: Expression);
    accept(visitor: Visitor): any;
    toString(): string;
}
export declare class PostUnaryExpression implements Expression {
    readonly left: Expression;
    readonly operator: Token;
    constructor(operator: Token, left: Expression);
    accept(visitor: Visitor): any;
    toString(): string;
}
export declare class LiteralExpression implements Expression {
    readonly value: Token;
    constructor(value: Token);
    accept(visitor: Visitor): any;
    toString(): string;
}
export declare class CellExpression implements Expression {
    readonly value: Token;
    readonly sheetName: Token | null;
    readonly type: ReferenceType;
    constructor(value: Token, type: ReferenceType, sheetName: Token | null);
    accept(visitor: Visitor): any;
    toString(): string;
}
export declare class CallExpression implements Expression {
    readonly name: Expression;
    readonly params: Expression[];
    constructor(name: Expression, params: Expression[]);
    accept(visitor: Visitor): any;
    toString(): string;
}
export declare class CellRangeExpression implements Expression {
    readonly left: Expression;
    readonly right: Expression;
    readonly operator: Token;
    constructor(left: Expression, operator: Token, right: Expression);
    accept(visitor: Visitor): any;
    toString(): string;
}
export declare class GroupExpression implements Expression {
    readonly value: Expression;
    constructor(value: Expression);
    accept(visitor: Visitor): any;
    toString(): string;
}
export declare class TokenExpression implements Expression {
    readonly value: Token;
    constructor(value: Token);
    accept(visitor: Visitor): any;
    toString(): string;
}
