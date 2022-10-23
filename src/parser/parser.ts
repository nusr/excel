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
import { CustomError } from './error';

const errorSet = new Set([
  '#ERROR',
  '#DIV/0',
  '#NULL',
  '#NUM',
  '#REF',
  '#VALUE',
]);

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
      const right = this.expo();
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
  private convertToCellExpression(
    expr: Expression,
  ): CellExpression {
    if (expr instanceof CellExpression) {
      return expr;
    }
    if (expr instanceof DefineNameExpression) {
      return new CellExpression(
        new Token(TokenType.IDENTIFIER, expr.value.value.toUpperCase()),
        'relative',
        null,
      );
    }
    if (expr instanceof LiteralExpression) {
      if (expr.value.type === TokenType.NUMBER) {
        return new CellExpression(
          new Token(TokenType.IDENTIFIER, expr.value.value),
          'relative',
          null,
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
  private finishCall(name: Token): CallExpression {
    const params: Expression[] = [];
    if (!this.check(TokenType.RIGHT_BRACKET)) {
      do {
        params.push(this.expression());
      } while (this.match(TokenType.COMMA));
    }
    this.expect(TokenType.RIGHT_BRACKET);
    let realName: Token = name;
    if (name.value[0] === '@') {
      realName = new Token(TokenType.IDENTIFIER, name.value.slice(1));
    }
    return new CallExpression(realName, params);
  }
  private primary(): Expression {
    if (
      this.match(
        TokenType.NUMBER,
        TokenType.STRING,
        TokenType.TRUE,
        TokenType.FALSE,
      )
    ) {
      return new LiteralExpression(this.previous());
    }

    if (this.match(TokenType.IDENTIFIER)) {
      const name = this.previous();
      const { value, type } = name;
      const realValue = value.toUpperCase();
      const newToken = new Token(type, realValue);
      if (this.match(TokenType.LEFT_BRACKET)) {
        return this.finishCall(name);
      }
      if (realValue === '#NAME?' || realValue === '#N/A') {
        return new ErrorExpression(newToken);
      }
      if (errorSet.has(realValue) && this.match(TokenType.BANG)) {
        return new ErrorExpression(new Token(type, realValue + '!'));
      }
      if (this.match(TokenType.BANG)) {
        const expr = this.expression();
        if (expr instanceof CellExpression) {
          return new CellExpression(expr.value, expr.type, name);
        }
        throw new CustomError('#REF!');
      }
      if (/^[A-Z]+$/i.test(value)) {
        return new DefineNameExpression(name);
      }
      if (
        /^\$[A-Z]+\$\d+$/.test(realValue) ||
        /^\$[A-Z]+$/.test(realValue) ||
        /^\$\d+$/.test(realValue)
      ) {
        return new CellExpression(newToken, 'absolute', null);
      }
      if (/^\$[A-Z]+\d+$/.test(realValue) || /^[A-Z]+\$\d+$/.test(realValue)) {
        return new CellExpression(newToken, 'mixed', null);
      }
      if (/^[A-Z]+\d+$/.test(realValue) || /^[A-Z]+$/.test(realValue)) {
        return new CellExpression(newToken, 'relative', null);
      }
    }
    if (this.match(TokenType.LEFT_BRACKET)) {
      const value = this.expression();
      this.expect(TokenType.RIGHT_BRACKET);
      return new GroupExpression(value);
    }
    // if (this.match(TokenType.EMPTY_CHAR)) {
    // return this.expression();
    // }
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
