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
  visitErrorExpression(expr: ErrorExpression): any;
  visitGroupExpression(expr: GroupExpression): any;
  visitDefineNameExpression(expr: DefineNameExpression): any;
}

export interface Expression {
  accept(visitor: Visitor): any;
  toString(): string;
}

export class BinaryExpression implements Expression {
  readonly left: Expression;
  readonly right: Expression;
  readonly operator: Token;
  constructor(left: Expression, operator: Token, right: Expression) {
    this.left = left;
    this.operator = operator;
    this.right = right;
  }
  accept(visitor: Visitor) {
    return visitor.visitBinaryExpression(this);
  }
  toString(): string {
    return '';
  }
}

export class UnaryExpression implements Expression {
  readonly right: Expression;
  readonly operator: Token;
  constructor(operator: Token, right: Expression) {
    this.operator = operator;
    this.right = right;
  }
  accept(visitor: Visitor) {
    return visitor.visitUnaryExpression(this);
  }
  toString(): string {
    return '';
  }
}

export class PostUnaryExpression implements Expression {
  readonly left: Expression;
  readonly operator: Token;
  constructor(operator: Token, left: Expression) {
    this.operator = operator;
    this.left = left;
  }
  accept(visitor: Visitor) {
    return visitor.visitPostUnaryExpression(this);
  }
  toString(): string {
    return '';
  }
}

export class LiteralExpression implements Expression {
  readonly value: Token;
  constructor(value: Token) {
    this.value = value;
  }
  accept(visitor: Visitor) {
    return visitor.visitLiteralExpression(this);
  }
  toString(): string {
    return '';
  }
}

export class CellExpression implements Expression {
  readonly value: Token;
  readonly sheetName: Token | null;
  readonly type: ReferenceType;
  constructor(value: Token, type: ReferenceType, sheetName: Token | null) {
    this.value = value;
    this.sheetName = sheetName;
    this.type = type;
  }
  accept(visitor: Visitor) {
    return visitor.visitCellExpression(this);
  }
  toString(): string {
    return '';
  }
}

export class CallExpression implements Expression {
  readonly name: Token;
  readonly params: Expression[];
  constructor(name: Token, params: Expression[]) {
    this.name = name;
    this.params = params;
  }
  accept(visitor: Visitor) {
    return visitor.visitCallExpression(this);
  }
  toString(): string {
    return '';
  }
}
export class ErrorExpression implements Expression {
  readonly value: Token;
  constructor(value: Token) {
    this.value = value;
  }
  accept(visitor: Visitor): any {
    return visitor.visitErrorExpression(this);
  }
  toString(): string {
    return '';
  }
}
export class CellRangeExpression implements Expression {
  readonly left: Expression;
  readonly right: Expression;
  readonly operator: Token;
  constructor(left: Expression, operator: Token, right: Expression) {
    this.left = left;
    this.operator = operator;
    this.right = right;
  }
  accept(visitor: Visitor) {
    return visitor.visitCellRangeExpression(this);
  }
  toString(): string {
    return '';
  }
}

export class GroupExpression implements Expression {
  readonly value: Expression;
  constructor(value: Expression) {
    this.value = value;
  }
  accept(visitor: Visitor) {
    return visitor.visitGroupExpression(this);
  }
  toString(): string {
    return '';
  }
}

export class DefineNameExpression implements Expression {
  readonly value: Token;
  constructor(value: Token) {
    this.value = value;
  }
  accept(visitor: Visitor) {
    return visitor.visitDefineNameExpression(this);
  }
  toString(): string {
    return '';
  }
}
