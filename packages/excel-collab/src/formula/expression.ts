import type { Token } from './token';
import { TokenType } from '../types';

export interface Visitor {
  visitBinaryExpression: (expr: BinaryExpression) => any;
  visitUnaryExpression: (expr: UnaryExpression) => any;
  visitPostUnaryExpression: (expr: PostUnaryExpression) => any;
  visitLiteralExpression: (expr: LiteralExpression) => any;
  visitCellExpression: (expr: CellExpression) => any;
  visitCellRangeExpression: (expr: CellRangeExpression) => any;
  visitCallExpression: (expr: CallExpression) => any;
  visitGroupExpression: (expr: GroupExpression) => any;
  visitArrayExpression: (expr: ArrayExpression) => any;
  visitMissingExpression: (expr: MissingExpression) => any;
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
  toString(): string {
    return `${this.left.toString()}${this.operator.toString()}${this.right.toString()}`;
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
    if (this.value.type === TokenType.STRING) return `"${this.value.value.replace(/"/g, '""')}"`;
    return this.value.toString();
  }
}

export class MissingExpression implements Expression {
  accept(visitor: Visitor) {
    return visitor.visitMissingExpression(this);
  }
  toString() {
    return '';
  }
}

export class CellExpression implements Expression {
  readonly value: Token;
  readonly sheetName: Token | undefined;
  constructor(value: Token, sheetName: Token | undefined) {
    this.value = value;
    this.sheetName = sheetName;
  }
  accept(visitor: Visitor) {
    return visitor.visitCellExpression(this);
  }
  toString(): string {
    const t = this.value.toString().toUpperCase();
    if (this.sheetName) {
      let name = this.sheetName.toString();
      if (!/^[A-Za-z_][A-Za-z0-9_]*$/.test(name)) {
        name = `'${name.replace(/'/g, "''")}'`;
      }
      return `${name}!${t}`;
    } else {
      return t;
    }
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
    return `${this.name.toString()}(${this.params.map((item) => item.toString()).join(',')})`;
  }
}

export class CellRangeExpression implements Expression {
  readonly right: Expression;
  readonly operator: Token;
  readonly left: Expression;
  constructor(left: Expression, operator: Token, right: Expression) {
    this.left = left;
    this.operator = operator;
    this.right = right;
  }
  accept(visitor: Visitor) {
    return visitor.visitCellRangeExpression(this);
  }
  toString(): string {
    return this.left.toString() + this.operator.toString() + this.right.toString();
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

export class ArrayExpression implements Expression {
  readonly value: Expression[];
  constructor(
    value: Expression[],
    readonly rowWidth = value.length,
  ) {
    this.value = value;
  }
  accept(visitor: Visitor) {
    return visitor.visitArrayExpression(this);
  }
  toString(): string {
    const temp = this.value
      .map(
        (v, index) =>
          `${index === 0 ? '' : index % this.rowWidth === 0 ? ';' : ','}${v.toString()}`,
      )
      .join('');
    return `{${temp}}`;
  }
}
