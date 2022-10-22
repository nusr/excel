import { TokenType } from '@/types';
import { Token } from './token';
import type { Expression } from './expression';
import {
  BinaryExpression,
  UnaryExpression,
  CellExpression,
  CallExpression,
  LiteralExpression,
  ErrorExpression,
  TokenExpression,
  CellRangeExpression,
} from './expression';
import { isLetter } from '@/util';
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
    if (expr instanceof TokenExpression) {
      if (expr.value.value.split('').every((v) => isLetter(v))) {
        return new CellExpression(
          new Token(TokenType.RELATIVE_CELL, expr.value.value),
        );
      }
    }
    throw new Error('error cell');
  }
  private spread(): Expression {
    let expr = this.call();
    while (this.match(TokenType.COLON)) {
      const operator = this.previous();
      const right = this.call();
      expr = new CellRangeExpression(
        this.convertToCellExpression(expr),
        operator,
        this.convertToCellExpression(right),
      );
    }
    return expr;
  }
  private call() {
    let expr = this.primary();
    while (true) {
      if (this.match(TokenType.LEFT_BRACKET)) {
        expr = this.finishCall(expr);
      } else {
        break;
      }
    }
    return expr;
  }
  private finishCall(expr: Expression): CallExpression {
    const params: Expression[] = [];
    if (!this.check(TokenType.RIGHT_BRACKET)) {
      do {
        params.push(this.expression());
      } while (this.match(TokenType.COMMA));
    }
    this.expect(TokenType.RIGHT_BRACKET, 'expect )');
    return new CallExpression(expr, params);
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
      return new TokenExpression(this.previous());
    }
    throw new Error('can not handle token:' + this.peek().error());
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
  private expect(type: TokenType, message: string): Token {
    if (this.check(type)) {
      this.next();
      return this.previous();
    } else {
      throw new Error(message);
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
