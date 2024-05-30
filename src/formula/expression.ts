import type { Token } from './token';
import type { ReferenceType } from '@/types';
import { TokenType } from '@/types';

export interface Visitor {
  visitBinaryExpression: (expr: BinaryExpression) => any;
  visitUnaryExpression: (expr: UnaryExpression) => any;
  visitPostUnaryExpression: (expr: PostUnaryExpression) => any;
  visitLiteralExpression: (expr: LiteralExpression) => any;
  visitCellExpression: (expr: CellExpression) => any;
  visitR1C1Expression: (expr: R1C1Expression) => any;
  visitCellRangeExpression: (expr: CellRangeExpression) => any;
  visitCallExpression: (expr: CallExpression) => any;
  visitGroupExpression: (expr: GroupExpression) => any;
  visitTokenExpression: (expr: TokenExpression) => any;
  visitArrayExpression: (expr: ArrayExpression) => any;
}

export interface Expression {
  accept: (visitor: Visitor) => any;
  toString: () => string;
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
  private handleConcatenate(value: Expression): string {
    const result = value.toString();
    const check =
      this.operator.type === TokenType.CONCATENATE &&
      value instanceof LiteralExpression &&
      value.value.type === TokenType.STRING;
    if (check) {
      return JSON.stringify(result);
    }
    return result;
  }
  toString(): string {
    const left = this.handleConcatenate(this.left);
    const right = this.handleConcatenate(this.right);
    return `${left}${this.operator.toString()}${right}`;
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
    return this.operator.toString() + this.right.toString();
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
    return this.left.toString() + this.operator.toString();
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
    return this.value.toString();
  }
}

export class R1C1Expression implements Expression {
  readonly value: Token;
  constructor(value: Token) {
    this.value = value;
  }
  accept(visitor: Visitor) {
    return visitor.visitR1C1Expression(this);
  }
  toString(): string {
    return this.value.toString();
  }
}
export class CellExpression implements Expression {
  readonly value: Token;
  readonly sheetName: Token | undefined;
  readonly type: ReferenceType;
  constructor(value: Token, type: ReferenceType, sheetName: Token | undefined) {
    this.value = value;
    this.sheetName = sheetName;
    this.type = type;
  }
  accept(visitor: Visitor) {
    return visitor.visitCellExpression(this);
  }
  toString(): string {
    const t = this.value.toString().toUpperCase();
    if (this.sheetName) {
      let name = this.sheetName.toString();
      if (name.includes(' ')) {
        name = `'${name}'`;
      }
      return `${name}!${t}`;
    } else {
      return t;
    }
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
    return `${this.name.toString().toUpperCase()}(${this.params
      .map((item) => item.toString())
      .join(',')})`;
  }
}

export class CellRangeExpression implements Expression {
  readonly right: CellExpression;
  readonly operator: Token;
  readonly left: CellExpression;
  constructor(left: CellExpression, operator: Token, right: CellExpression) {
    this.left = left;
    this.operator = operator;
    this.right = right;
  }
  accept(visitor: Visitor) {
    return visitor.visitCellRangeExpression(this);
  }
  toString(): string {
    return (
      this.left.toString() + this.operator.toString() + this.right.toString()
    );
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
    return `(${this.value.toString()})`;
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
    return this.value.toString();
  }
}

export class ArrayExpression implements Expression {
  readonly value: Expression[];
  constructor(value: Expression[]) {
    this.value = value;
  }
  accept(visitor: Visitor) {
    return visitor.visitArrayExpression(this);
  }
  toString(): string {
    const temp = this.value.map((v) => v.toString()).join(',');
    return `{${temp}}`;
  }
}
