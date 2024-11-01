import { TokenType } from '@/types';
import { Token } from './token';
import { CustomError } from './formula';
import {
  FORMULA_PREFIX,
  ERROR_SET,
  BUILT_IN_FUNCTION_SET,
  CELL_REG_EXP,
  COLUMN_REG_EXP,
  DEFINED_NAME_REG_EXP,
  type BuiltInFormulas,
  ROW_REG_EXP,
  type ErrorTypes,
} from '@/util/constant';
import { isDigit, isAlpha } from '@/util/reference';

const emptyData = '';

export class Scanner {
  private readonly list: string[];
  private current = 0;
  private start = 0;
  private readonly tokens: Token[] = [];
  constructor(source: string) {
    this.list = [...source];
  }
  scan(): Token[] {
    while (!this.isAtEnd()) {
      this.start = this.current;
      this.scanToken();
    }
    this.tokens.push(new Token(TokenType.EOF, ''));
    if (this.tokens.length > 0 && this.tokens[0].type === TokenType.EQUAL) {
      this.tokens.shift();
    }
    return this.tokens;
  }
  private peek() {
    if (this.isAtEnd()) {
      return emptyData;
    }
    return this.list[this.current];
  }
  private match(text: string) {
    if (this.peek() !== text) {
      return false;
    }
    this.next();
    return true;
  }
  private next() {
    if (this.isAtEnd()) {
      return emptyData;
    }
    return this.list[this.current++];
  }
  private isAtEnd() {
    return this.current >= this.list.length;
  }
  private addToken(type: TokenType) {
    const text = this.list.slice(this.start, this.current).join('');
    this.tokens.push(new Token(type, text));
  }
  private string(end: string) {
    while (!this.isAtEnd() && this.peek() !== end) {
      this.next();
    }
    if (this.peek() !== end) {
      throw new CustomError('#VALUE!');
    } else {
      this.next();
    }
    const text = this.list.slice(this.start + 1, this.current - 1).join('');
    if (end === "'" && this.match('!')) {
      this.tokens.push(new Token(TokenType.SHEET_NAME, text));
      return;
    }
    this.tokens.push(new Token(TokenType.STRING, text));
  }
  private getDigits() {
    while (!this.isAtEnd() && isDigit(this.peek())) {
      this.next();
    }
  }
  private getAlphas() {
    while (!this.isAtEnd() && isAlpha(this.peek())) {
      this.next();
    }
  }
  private matchR1C1() {
    if (this.match('[')) {
      this.match('-');
      if (isDigit(this.peek())) {
        this.getDigits();
      } else {
        throw new CustomError('#VALUE!');
      }
      if (this.peek() !== ']') {
        throw new CustomError('#VALUE!');
      } else {
        this.next();
      }
    } else {
      this.getDigits();
    }
  }
  private matchScientificCounting() {
    if (this.match('E') || this.match('e')) {
      // 1E-10 1E+10
      if (this.match('+') || this.match('-')) {
        this.getDigits();
        this.addToken(TokenType.NUMBER);
        return true;
      }
      if (isDigit(this.peek())) {
        this.getDigits();
        this.addToken(TokenType.NUMBER);
        return true;
      }
      // 1E or 1.1E not valid
      throw new CustomError('#VALUE!');
    }
    return false;
  }
  private number() {
    this.getDigits();
    const check1 = this.matchScientificCounting();
    if (check1) {
      return;
    }
    if (this.match('.')) {
      this.getDigits();
    }
    const check2 = this.matchScientificCounting();
    if (check2) {
      return;
    }
    this.addToken(TokenType.NUMBER);
  }
  private addIdentifier() {
    while (!this.isAtEnd() && this.anyChar(this.peek())) {
      this.next();
    }
    let text = this.list.slice(this.start, this.current).join('');
    const t = text.toUpperCase();
    if (BUILT_IN_FUNCTION_SET.has(t as BuiltInFormulas) && this.match('(')) {
      this.tokens.push(new Token(TokenType.EXCEL_FUNCTION, t));
      return;
    }
    if (['IF', 'CHOOSE'].includes(t) && this.match('(')) {
      this.tokens.push(new Token(TokenType.REF_FUNCTION_COND, t));
      return;
    }
    if (['INDEX', 'OFFSET', 'INDIRECT'].includes(t) && this.match('(')) {
      this.tokens.push(new Token(TokenType.REF_FUNCTION, t));
      return;
    }
    if (this.match('!')) {
      this.tokens.push(new Token(TokenType.SHEET_NAME, text));
      return;
    }
    let type: TokenType = TokenType.BOOL;
    if (t === 'TRUE' || t === 'FALSE') {
      text = t;
      type = TokenType.BOOL;
    } else if (ERROR_SET.has(t as ErrorTypes)) {
      text = t;
      type = t === '#REF!' ? TokenType.ERROR_REF : TokenType.ERROR;
    } else if (CELL_REG_EXP.test(t)) {
      type = TokenType.CELL;
    } else if (COLUMN_REG_EXP.test(t)) {
      type = TokenType.COLUMN;
    } else if (ROW_REG_EXP.test(t)) {
      type = TokenType.ROW;
    } else if (DEFINED_NAME_REG_EXP.test(t)) {
      type = TokenType.DEFINED_NAME;
    } else {
      throw new CustomError('#NAME?');
    }

    this.tokens.push(new Token(type, text));
  }
  private scanToken() {
    const c = this.next();
    switch (c) {
      case '$': {
        if (isAlpha(this.peek())) {
          this.getAlphas();
          if (this.match('$')) {
            if (isDigit(this.peek())) {
              // $A$1 absolute reference
              this.getDigits();
              this.addToken(TokenType.CELL);
            } else {
              this.addIdentifier();
            }
          } else if (isDigit(this.peek())) {
            // $A1 mixed reference
            this.getDigits();
            this.addToken(TokenType.CELL);
          } else {
            // $A
            this.addToken(TokenType.COLUMN);
          }
        } else if (isDigit(this.peek())) {
          // $1 absolute reference
          this.getDigits();
          this.addToken(TokenType.ROW);
        } else {
          this.addIdentifier();
        }
        break;
      }
      case 'r':
      case 'R': {
        this.matchR1C1();
        if (this.match('C') || this.match('c')) {
          this.matchR1C1();
          const text = this.list
            .slice(this.start, this.current)
            .join('')
            .toUpperCase();
          this.tokens.push(new Token(TokenType.R1C1, text));
        } else {
          this.addIdentifier();
        }
        break;
      }
      case '(':
        this.addToken(TokenType.LEFT_BRACKET);
        break;
      case ')':
        this.addToken(TokenType.RIGHT_BRACKET);
        break;
      case ',':
        this.addToken(TokenType.COMMA);
        break;
      case ':':
        this.addToken(TokenType.COLON);
        break;
      case FORMULA_PREFIX:
        this.addToken(TokenType.EQUAL);
        break;
      case '<':
        if (this.match('>')) {
          this.addToken(TokenType.NOT_EQUAL);
        } else if (this.match('=')) {
          this.addToken(TokenType.LESS_EQUAL);
        } else {
          this.addToken(TokenType.LESS);
        }
        break;
      case '>':
        if (this.match('=')) {
          this.addToken(TokenType.GREATER_EQUAL);
        } else {
          this.addToken(TokenType.GREATER);
        }
        break;
      case '+':
        this.addToken(TokenType.PLUS);
        break;
      case '-':
        this.addToken(TokenType.MINUS);
        break;
      case '*':
        this.addToken(TokenType.STAR);
        break;
      case '/':
        this.addToken(TokenType.SLASH);
        break;
      case '^':
        this.addToken(TokenType.EXPONENT);
        break;
      case '&':
        this.addToken(TokenType.CONCATENATE);
        break;
      case '%':
        this.addToken(TokenType.PERCENT);
        break;
      case '"':
        this.string(c);
        break;
      case "'":
        this.string(c);
        break;
      case '!':
        this.addToken(TokenType.EXCLAMATION);
        break;
      case ';':
        this.addToken(TokenType.SEMICOLON);
        break;
      case '{':
        this.addToken(TokenType.lEFT_BRACE);
        break;
      case '}':
        this.addToken(TokenType.RIGHT_BRACE);
        break;
      case ' ':
        // while (!this.isAtEnd() && this.peek() === ' ') {
        // this.next();
        // }
        // this.addToken(TokenType.EMPTY_CHAR);
        break;
      case '\r':
      case '\t':
      case '\n':
        break;
      default:
        if (isDigit(c)) {
          this.number();
        } else {
          this.addIdentifier();
        }
        break;
    }
  }
  private anyChar(c: string) {
    const text = '(),:=<>+-*/^&%"{}!';
    return !text.includes(c) && !this.isWhiteSpace(c);
  }
  private isWhiteSpace(c: string) {
    return c === ' ' || c === '\r' || c === '\n' || c === '\t';
  }
}
