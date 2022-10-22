import { TokenType } from '@/types';
import { Token } from './token';
import {
  DefineNameExpression,
  Expression,
  GroupExpression,
} from './expression';
import {
  BinaryExpression,
  UnaryExpression,
  CellExpression,
  CallExpression,
  LiteralExpression,
  ErrorExpression,
  CellRangeExpression,
} from './expression';
import { isLetter } from '@/util';
import { CustomError } from './error';

export class Parser {
  private readonly tokens: Token[];
  private current = 0;
  constructor(tokens: Token[]) {
    this.tokens = tokens;
  }
  parse() {
    const result: Expression[] = [];
    while (!this.isAtEnd()) {
      result.push(this.expression());
    }
    return result;
  }
  private expression(): Expression {
    return this.equality();
  }
  private equality(): Expression {
    let expr = this.comparison();
    while (this.match(TokenType.EQUAL, TokenType.NOT_EQUAL)) {
      const operator = this.previous();
      const right = this.comparison();
      expr = new BinaryExpression(expr, operator, right);
    }
    return expr;
  }
  private comparison(): Expression {
    let expr = this.term();
    while (
      this.match(
        TokenType.GREATER,
        TokenType.GREATER_EQUAL,
        TokenType.LESS,
        TokenType.LESS_EQUAL,
      )
    ) {
      const operator = this.previous();
      const right = this.term();
      expr = new BinaryExpression(expr, operator, right);
    }
    return expr;
  }
  private term(): Expression {
    let expr = this.factor();
    while (this.match(TokenType.PLUS, TokenType.MINUS)) {
      const operator = this.previous();
      const right = this.factor();
      expr = new BinaryExpression(expr, operator, right);
    }
    return expr;
  }
  private factor(): Expression {
    let expr = this.expo();
    while (this.match(TokenType.SLASH, TokenType.STAR)) {
      const operator = this.previous();
      const right = this.expo();
      expr = new BinaryExpression(expr, operator, right);
    }
    return expr;
  }
  private expo(): Expression {
    let expr = this.concatenate();
    while (this.match(TokenType.EXPONENT)) {
      const operator = this.previous();
      const right = this.expo();
      expr = new BinaryExpression(expr, operator, right);
    }
    return expr;
  }
  private concatenate(): Expression {
    let expr = this.unary();
    while (this.match(TokenType.CONCATENATE)) {
      const operator = this.previous();
      const right = this.unary();
      expr = new BinaryExpression(expr, operator, right);
    }
    return expr;
  }
  private unary(): Expression {
    if (this.match(TokenType.PLUS, TokenType.MINUS)) {
      const operator = this.previous();
      const right = this.unary();
      return new UnaryExpression(operator, right);
    }
    return this.spread();
  }
  private convertToCellExpression(expr: Expression): CellExpression {
    if (expr instanceof CellExpression) {
      return expr;
    }
    if (expr instanceof LiteralExpression) {
      if (expr.value.type === TokenType.NUMBER) {
        return new CellExpression(
          new Token(TokenType.RELATIVE_CELL, expr.value.value),
        );
      }
    }
    if (expr instanceof DefineNameExpression) {
      if (expr.value.value.split('').every((v) => isLetter(v))) {
        return new CellExpression(
          new Token(TokenType.RELATIVE_CELL, expr.value.value),
        );
      }
    }
    throw new CustomError('#REF!');
  }
  private spread(): Expression {
    let expr = this.primary();
    while (this.match(TokenType.COLON)) {
      const operator = this.previous();
      const right = this.primary();
      expr = new CellRangeExpression(
        this.convertToCellExpression(expr),
        operator,
        this.convertToCellExpression(right),
      );
    }
    return expr;
  }
  private primary(): Expression {
    if (this.match(TokenType.NUMBER)) {
      return new LiteralExpression(this.previous());
    }
    if (this.match(TokenType.STRING)) {
      return new LiteralExpression(this.previous());
    }
    if (this.match(TokenType.TRUE)) {
      return new LiteralExpression(this.previous());
    }
    if (this.match(TokenType.FALSE)) {
      return new LiteralExpression(this.previous());
    }
    if (
      this.match(
        TokenType.MIXED_CELL,
        TokenType.RELATIVE_CELL,
        TokenType.ABSOLUTE_CELL,
      )
    ) {
      return new CellExpression(this.previous());
    }
    if (this.match(TokenType.ERROR)) {
      return new ErrorExpression(this.previous());
    }
    if (this.match(TokenType.IDENTIFIER)) {
      const name = this.previous();
      if (this.match(TokenType.LEFT_BRACKET)) {
        const params: Expression[] = [];
        if (!this.check(TokenType.RIGHT_BRACKET)) {
          do {
            params.push(this.expression());
          } while (this.match(TokenType.COMMA));
        }
        this.expect(TokenType.RIGHT_BRACKET);
        return new CallExpression(name, params);
      } else {
        return new DefineNameExpression(name);
      }
    }
    if (this.match(TokenType.LEFT_BRACKET)) {
      const value = this.expression();
      this.expect(TokenType.RIGHT_BRACKET);
      return new GroupExpression(value);
    }
    throw new CustomError('#ERROR!');
  }
  private match(...types: TokenType[]): boolean {
    const type = this.peek().type;
    if (types.includes(type)) {
      this.next();
      return true;
    }
    return false;
  }
  private previous(): Token {
    return this.tokens[this.current - 1];
  }
  private check(type: TokenType): boolean {
    return this.peek().type === type;
  }
  private expect(type: TokenType): Token {
    if (this.check(type)) {
      this.next();
      return this.previous();
    } else {
      throw new CustomError('#ERROR!');
    }
  }
  private next() {
    this.current++;
  }
  private isAtEnd() {
    return this.peek().type === TokenType.EOF;
  }
  private peek(): Token {
    if (this.current < this.tokens.length) {
      return this.tokens[this.current];
    }
    return new Token(TokenType.EOF, '');
  }
}
