import type { Token } from './token';

export interface Visitor {
  visitBinaryExpression(data: BinaryExpression): any;
  visitUnaryExpression(data: UnaryExpression): any;
  visitLiteralExpression(data: LiteralExpression): any;
  visitCellExpression(data: CellExpression): any;
  visitCellRangeExpression(data: CellRangeExpression): any;
  visitCallExpression(data: CallExpression): any;
  visitErrorExpression(data: ErrorExpression): any;
  visitTokenExpression(data: TokenExpression): any;
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
  constructor(value: Token) {
    this.value = value;
  }
  accept(visitor: Visitor) {
    return visitor.visitCellExpression(this);
  }
  toString(): string {
    return '';
  }
}

export class CallExpression implements Expression {
  readonly name: Expression;
  readonly params: Expression[];
  constructor(name: Expression, params: Expression[]) {
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
    return visitor.visitCellExpression(this);
  }
  toString(): string {
    return '';
  }
}
export class TokenExpression implements Expression {
  readonly value: Token;
  constructor(value: Token) {
    this.value = value;
  }
  accept(visitor: Visitor) {
    return visitor.visitTokenExpression(this);
  }
  toString(): string {
    return '';
  }
}

export class CellRangeExpression implements Expression {
  readonly left: CellExpression;
  readonly right: CellExpression;
  readonly operator: Token;
  constructor(left: CellExpression, operator: Token, right: CellExpression) {
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
