import { TokenType } from '@/types';
import { Token } from './token';
import { isLetter }  from '@/util'
const emptyData = '';
const identifierMap = new Map<string, TokenType>([
  ['true', TokenType.TRUE],
  ['false', TokenType.FALSE],
]);

export class Scanner {
  private readonly list: string[];
  private current = 0;
  private start = 0;
  private readonly tokens: Token[] = [];
  constructor(source: string) {
    // unicode
    this.list = [...source];
  }
  scan(): Token[] {
    while (!this.isAtEnd()) {
      this.start = this.current;
      this.scanToken();
    }
    this.tokens.push(new Token(TokenType.EOF, ''));
    return this.tokens;
  }
  private peek() {
    if (this.isAtEnd()) {
      return emptyData;
    }
    return this.list[this.current];
  }
  private previous() {
    return this.list[this.current - 1];
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
    let realType = type;
    if (type === TokenType.IDENTIFIER) {
      const temp = identifierMap.get(text.toLowerCase());
      if (temp) {
        realType = temp;
      }
    }
    this.tokens.push(new Token(realType, text));
  }
  private string(end: string) {
    while (!this.isAtEnd() && this.peek() !== end) {
      this.next();
    }
    if (this.peek() !== end) {
      throw new Error('unterminated string');
    } else {
      this.next();
    }
    const text = this.list.slice(this.start + 1, this.current - 1).join('');
    this.tokens.push(new Token(TokenType.STRING, text));
  }
  private number() {
    while (!this.isAtEnd() && this.isDigit(this.peek())) {
      this.next();
    }
    if (this.peek() === '.') {
      while (!this.isAtEnd() && this.isDigit(this.peek())) {
        this.next();
      }
    }
    this.addToken(TokenType.NUMBER);
  }
  private isDigit(char: string) {
    return char >= '0' && char <= '9';
  }
  private isLetter(char: string) {
    return isLetter(char)
  }
  private identifier() {
    while (!this.isAtEnd() && this.isLetter(this.peek())) {
      this.next();
    }
    if (this.peek() === '$') {
      this.next();
      if (this.isDigit(this.peek())) {
        while (!this.isAtEnd() && this.isDigit(this.peek())) {
          this.next();
        }
        this.addToken(TokenType.MIXED_CELL);
      } else {
        throw new Error('error MIXED_CELL');
      }
    } else if (this.isDigit(this.peek())) {
      while (!this.isAtEnd() && this.isDigit(this.peek())) {
        this.next();
      }
      this.addToken(TokenType.RELATIVE_CELL);
    } else {
      this.addToken(TokenType.IDENTIFIER);
    }
  }
  private scanToken() {
    const c = this.next();
    switch (c) {
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
      case '=':
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
      case '"':
        this.string(c);
        break;
      case ' ':
      case '\r':
      case '\t':
      case '\n':
        break;
      case '$':
        while (!this.isAtEnd() && this.isLetter(this.peek())) {
          this.next();
        }
        const isLetter = this.isLetter(this.previous());
        if (isLetter) {
          if (this.isDigit(this.peek())) {
            while (!this.isAtEnd() && this.isDigit(this.peek())) {
              this.next();
            }
            this.addToken(TokenType.MIXED_CELL);
          } else if (this.match('$')) {
            if (this.isDigit(this.peek())) {
              while (!this.isAtEnd() && this.isDigit(this.peek())) {
                this.next();
              }
              this.addToken(TokenType.ABSOLUTE_CELL);
            } else {
              throw new Error('error ABSOLUTE_CELL');
            }
          } else {
            this.addToken(TokenType.ABSOLUTE_CELL);
          }
        } else {
          while (!this.isAtEnd() && this.isDigit(this.peek())) {
            this.next();
          }
          if (this.isDigit(this.previous())) {
            this.addToken(TokenType.ABSOLUTE_CELL);
          } else {
            throw new Error('error ABSOLUTE_CELL');
          }
        }
        break;
      case '#':
        while (!this.isAtEnd() && this.isLetter(this.peek())) {
          this.next();
        }
        if (this.peek() === '!' || this.peek() === '?') {
          this.next();
        }
        this.addToken(TokenType.ERROR);
        break;
      default:
        if (this.isDigit(c)) {
          this.number();
        } else if (this.isLetter(c)) {
          this.identifier();
        }
        break;
    }
  }
}
