import { Token } from './token';

import {
  FORMULA_PREFIX,
  BUILT_IN_FUNCTION_SET,
  CELL_REG_EXP,
  COLUMN_REG_EXP,
  DEFINED_NAME_REG_EXP,
  type BuiltInFormulas,
  ROW_REG_EXP,
  isDigit,
  isAlpha,
  getCustomError,
  ERROR_SET,
} from '../util';
import { TokenType } from '../types';

const emptyData = '';

export interface SheetReference {
  name: string;
  /** UTF-16 source offsets; end excludes the following exclamation mark. */
  start: number;
  end: number;
}

export class Scanner {
  private readonly list: string[];
  private readonly offsets: number[];
  readonly sheetReferences: SheetReference[] = [];
  private current = 0;
  private start = 0;
  private readonly tokens: Token[] = [];
  constructor(source: string) {
    this.list = [...source];
    let offset = 0;
    this.offsets = this.list.map((char) => {
      const start = offset;
      offset += char.length;
      return start;
    });
    this.offsets.push(source.length);
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
  private addSheetName(name: string) {
    this.tokens.push(new Token(TokenType.SHEET_NAME, name));
    this.sheetReferences.push({
      name,
      start: this.offsets[this.start],
      end: this.offsets[this.current - 1],
    });
  }
  private string(end: string) {
    let text = '';
    let closed = false;
    while (!this.isAtEnd()) {
      const char = this.next();
      if (char !== end) {
        text += char;
      } else if (this.match(end)) {
        text += end;
      } else {
        closed = true;
        break;
      }
    }
    if (!closed) throw getCustomError('#VALUE!');
    if (end === "'" && this.match('!')) {
      this.addSheetName(text);
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
        throw getCustomError('#VALUE!');
      }
      if (this.peek() !== ']') {
        throw getCustomError('#VALUE!');
      } else {
        this.next();
      }
    } else {
      this.getDigits();
    }
  }
  private number() {
    this.getDigits();
    if (this.list[this.start] !== '.' && this.match('.')) {
      this.getDigits();
    }
    if (this.match('E') || this.match('e')) {
      if (!this.match('+')) this.match('-');
      if (!isDigit(this.peek())) throw getCustomError('#VALUE!');
      this.getDigits();
    }
    this.addToken(TokenType.NUMBER);
  }
  private addIdentifier() {
    while (!this.isAtEnd() && this.anyChar(this.peek())) {
      this.next();
    }
    let text = this.list.slice(this.start, this.current).join('');
    const t = text.toUpperCase();
    const functionName = t.replace(/^_XLFN\./, '').replace(/^_XLWS\./, '');
    const end = this.current;
    while (!this.isAtEnd() && this.isWhiteSpace(this.peek())) this.next();
    if (this.match('(')) {
      let type = TokenType.EXCEL_FUNCTION;
      if (!BUILT_IN_FUNCTION_SET.has(functionName as BuiltInFormulas)) {
        if (['IF', 'CHOOSE'].includes(functionName)) type = TokenType.REF_FUNCTION_COND;
        if (['INDEX', 'OFFSET', 'INDIRECT'].includes(functionName)) type = TokenType.REF_FUNCTION;
      }
      this.tokens.push(new Token(type, functionName));
      return;
    }
    this.current = end;
    if (this.match('!')) {
      this.addSheetName(text);
      return;
    }
    let type: TokenType = TokenType.BOOL;
    if (t === 'TRUE' || t === 'FALSE') {
      text = t;
      type = TokenType.BOOL;
    } else if (CELL_REG_EXP.test(t)) {
      type = TokenType.CELL;
    } else if (COLUMN_REG_EXP.test(t)) {
      type = TokenType.COLUMN;
    } else if (ROW_REG_EXP.test(t)) {
      type = TokenType.ROW;
    } else if (DEFINED_NAME_REG_EXP.test(t)) {
      type = TokenType.DEFINED_NAME;
    } else {
      throw getCustomError('#NAME?');
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
          if (this.peek() === '!' || (!this.isAtEnd() && this.anyChar(this.peek()))) {
            this.current = this.start + 1;
            this.addIdentifier();
            break;
          }
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
      case '#': {
        const remaining = this.list.slice(this.start).join('').toUpperCase();
        const error = [...ERROR_SET].find((value) => remaining.startsWith(value));
        if (!error) throw getCustomError('#NAME?');
        this.current = this.start + error.length;
        this.tokens.push(new Token(error === '#REF!' ? TokenType.ERROR_REF : TokenType.ERROR, error));
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
        if (isDigit(c) || (c === '.' && isDigit(this.peek()))) {
          this.number();
        } else {
          this.addIdentifier();
        }
        break;
    }
  }
  private anyChar(c: string) {
    const text = '(),;:=<>+-*/^&%"{}!\'';
    return !text.includes(c) && !this.isWhiteSpace(c);
  }
  private isWhiteSpace(c: string) {
    return c === ' ' || c === '\r' || c === '\n' || c === '\t';
  }
}
