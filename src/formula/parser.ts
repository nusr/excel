import { TokenType, ErrorTypes } from '@/types';
import { Token } from './token';
import {
  TokenExpression,
  Expression,
  GroupExpression,
  PostUnaryExpression,
  BinaryExpression,
  UnaryExpression,
  CallExpression,
  LiteralExpression,
  CellRangeExpression,
  R1C1Expression,
  CellExpression,
} from './expression';
import { CustomError, isRelativeReference } from './formula';
import { ERROR_SET } from '@/util/constant';

export class Parser {
  private readonly tokens: Token[];
  private current = 0;
  constructor(tokens: Token[]) {
    this.tokens = tokens;
  }
  parse(): Expression[] {
    const result: Expression[] = [];
    while (!this.isAtEnd()) {
      result.push(this.expression());
    }
    return result;
  }
  private expression(): Expression {
    return this.comparison();
  }
  private comparison(): Expression {
    let expr = this.concatenate();
    while (
      this.match(
        TokenType.EQUAL,
        TokenType.NOT_EQUAL,
        TokenType.GREATER,
        TokenType.GREATER_EQUAL,
        TokenType.LESS,
        TokenType.LESS_EQUAL,
      )
    ) {
      const operator = this.previous();
      const right = this.concatenate();
      expr = new BinaryExpression(expr, operator, right);
    }
    return expr;
  }
  private concatenate(): Expression {
    let expr = this.term();
    while (this.match(TokenType.CONCATENATE)) {
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
    let expr = this.unary();
    while (this.match(TokenType.EXPONENT)) {
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
    return this.postUnary();
  }
  private postUnary(): Expression {
    let expr = this.cellRange();
    if (this.match(TokenType.PERCENT)) {
      const operator = this.previous();
      expr = new PostUnaryExpression(operator, expr);
    }
    return expr;
  }
  private cellRange(): Expression {
    let expr = this.sheetRange();
    while (this.match(TokenType.COLON)) {
      const operator = this.previous();
      const right = this.sheetRange();
      const realRight = this.convertToCellExpression(right);
      const realLeft = this.convertToCellExpression(expr);
      expr = new CellRangeExpression(realLeft, operator, realRight);
    }
    return expr;
  }
  private convertToCellExpression(expr: Expression): CellExpression {
    if (expr instanceof CellExpression) {
      return expr;
    }
    if (
      expr instanceof TokenExpression &&
      isRelativeReference(expr.value.value)
    ) {
      return new CellExpression(expr.value, 'relative', undefined);
    }
    if (
      expr instanceof LiteralExpression &&
      expr.value.type === TokenType.INTEGER
    ) {
      return new CellExpression(expr.value, 'relative', undefined);
    }
    throw new CustomError('#NAME?');
  }
  private sheetRange(): Expression {
    let expr = this.call();
    if (this.match(TokenType.EXCLAMATION)) {
      const right = this.call();
      if (
        expr instanceof TokenExpression ||
        expr instanceof LiteralExpression
      ) {
        const cell = this.convertToCellExpression(right);
        return new CellExpression(cell.value, cell.type, expr.value);
      }
    }
    return expr;
  }
  private call(): Expression {
    let expr = this.primary();
    while (1) {
      if (this.match(TokenType.LEFT_BRACKET)) {
        expr = this.finishCall(expr);
      } else {
        break;
      }
    }
    return expr;
  }

  private finishCall(name: Expression): CallExpression {
    const params: Expression[] = [];
    if (!this.check(TokenType.RIGHT_BRACKET)) {
      do {
        // fix SUM(1,)
        if (this.peek().type == TokenType.RIGHT_BRACKET) {
          break;
        }
        params.push(this.expression());
      } while (this.match(TokenType.COMMA));
    }
    this.expect(TokenType.RIGHT_BRACKET);
    return new CallExpression(name, params);
  }
  private primary(): Expression {
    if (this.match(TokenType.LEFT_BRACKET)) {
      const value = this.expression();
      this.expect(TokenType.RIGHT_BRACKET);
      return new GroupExpression(value);
    }
    if (
      this.match(
        TokenType.INTEGER,
        TokenType.FLOAT,
        TokenType.STRING,
        TokenType.TRUE,
        TokenType.FALSE,
      )
    ) {
      return new LiteralExpression(this.previous());
    }
    if (this.match(TokenType.ABSOLUTE_CELL)) {
      const token = this.previous();
      return new CellExpression(token, 'absolute', undefined);
    }
    if (this.match(TokenType.MIXED_CELL)) {
      const token = this.previous();
      return new CellExpression(token, 'mixed', undefined);
    }

    if (this.match(TokenType.IDENTIFIER)) {
      const name = this.previous();
      const realValue = name.value.toUpperCase();
      if (ERROR_SET.has(realValue as ErrorTypes)) {
        throw new CustomError(realValue as ErrorTypes);
      }
      return new TokenExpression(name);
    }
    if (this.match(TokenType.R1C1)) {
      return new R1C1Expression(this.previous());
    }

    throw new CustomError('#ERROR!');
  }
  private match(...types: TokenType[]): boolean {
    const { type } = this.peek();
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
