export const tokenTypes: Record<string, string> = {
  EOF: "eof",
  PLUS: "+",
  MINUS: "-",
  ASTERISK: "*",
  SLASH: "/",
  LPAREN: "(",
  RPAREN: ")",
  POWER: "^",
  NUMBER: "number",
};
type ErrorType =
  | "#NULL!"
  | "#DIV/0!"
  | "#VALUE!"
  | "#REF!"
  | "#NAME?"
  | "#NUM!"
  | "#N/A"
  | "#ERROR!"
  | "#GETTING_DATA";

const LOWEST = 1;
const SUM = 4;
const PRODUCT = 5;
const CALL = 7;

const precedence: Record<string, number> = {
  [tokenTypes.PLUS]: SUM,
  [tokenTypes.MINUS]: SUM,
  [tokenTypes.ASTERISK]: PRODUCT,
  [tokenTypes.SLASH]: PRODUCT,
  [tokenTypes.POWER]: PRODUCT,
  [tokenTypes.LPAREN]: CALL,
};

interface ITokenType {
  type: string;
  value: string;
}

function generateToken(type: string, value: string): ITokenType {
  return {
    type,
    value,
  };
}
function isDigit(ch: string) {
  return ch >= "0" && ch <= "9";
}

export class Lexer {
  ch = "";
  at = 0;
  input = "";
  constructor(input = "") {
    this.input = input;
    this.at = 0;
    this.ch = "";
    this.readChar();
  }
  readChar(): void {
    const char = this.input[this.at] || "";
    if (this.at < this.input.length) {
      this.at++;
    }
    this.ch = char;
  }
  peekChar(): string {
    return this.input[this.at];
  }
  nextToken(): ITokenType {
    let tok: ITokenType;
    this.skipWhitespace();
    switch (this.ch) {
      case "":
        tok = generateToken(tokenTypes.EOF, this.ch);
        break;
      case "+":
        tok = generateToken(tokenTypes.PLUS, this.ch);
        break;
      case "-":
        tok = generateToken(tokenTypes.MINUS, this.ch);
        break;
      case "^":
        tok = generateToken(tokenTypes.POWER, this.ch);
        break;
      case "*":
        tok = generateToken(tokenTypes.ASTERISK, this.ch);
        break;
      case "/":
        tok = generateToken(tokenTypes.SLASH, this.ch);
        break;
      case "(":
        tok = generateToken(tokenTypes.LPAREN, this.ch);
        break;
      case ")":
        tok = generateToken(tokenTypes.RPAREN, this.ch);
        break;
      default:
        if (this.ch === "." || isDigit(this.ch)) {
          tok = generateToken(tokenTypes.NUMBER, this.readNumber());
          return tok;
        }
        throw new SyntaxError("Invalid Input.");
    }
    this.readChar();
    return tok;
  }
  readNumber(): string {
    let hasDot = false;
    let letter = "";
    while (this.ch === "." || isDigit(this.ch)) {
      if (hasDot && this.ch === ".") {
        throw new SyntaxError("Invalid Number.");
      }
      if (this.ch === ".") {
        if (!letter.length) {
          letter = "0";
        }
        letter += this.ch;
        hasDot = true;
      } else {
        letter += this.ch;
      }
      this.readChar();
    }
    return letter;
  }
  skipWhitespace(): void {
    while (
      this.ch === " " ||
      this.ch === "\t" ||
      this.ch === "\n" ||
      this.ch === "\r"
    ) {
      this.readChar();
    }
  }
}

function createPrefixExpression(token: ITokenType, op: string, right: any) {
  return {
    token,
    op,
    right,
  };
}

function createInfixExpression(
  token: ITokenType,
  op: string,
  left: any,
  right: any
) {
  return {
    token,
    op,
    left,
    right,
  };
}

export class Parser {
  curToken: ITokenType = generateToken("", "");
  peekToken: ITokenType = generateToken("", "");
  lexer: Lexer;
  prefixParseFns: Record<string, any> = {};
  infixParseFns: Record<string, any> = {};
  constructor(lexer: Lexer) {
    this.lexer = lexer;
    this.registerPrefix(tokenTypes.NUMBER, this.parseNumberLiteral);
    this.registerPrefix(tokenTypes.MINUS, this.parsePrefixExpression);
    this.registerPrefix(tokenTypes.PLUS, this.parsePrefixExpression);
    this.registerPrefix(tokenTypes.LPAREN, this.parseGroupedExpression);
    this.registerInfix(tokenTypes.MINUS, this.parseInfixExpression);
    this.registerInfix(tokenTypes.PLUS, this.parseInfixExpression);
    this.registerInfix(tokenTypes.POWER, this.parseInfixExpression);
    this.registerInfix(tokenTypes.ASTERISK, this.parseInfixExpression);
    this.registerInfix(tokenTypes.SLASH, this.parseInfixExpression);
    this.nextToken();
    this.nextToken();
  }
  registerPrefix(tokenType: string, fn: any): void {
    this.prefixParseFns[tokenType] = fn.bind(this);
  }
  registerInfix(tokenType: string, fn: any): void {
    this.infixParseFns[tokenType] = fn.bind(this);
  }
  parse() {
    return this.parseExpression(LOWEST);
  }
  nextToken(): void {
    this.curToken = this.peekToken;
    this.peekToken = this.lexer.nextToken();
  }
  parseNumberLiteral() {
    return {
      token: this.curToken,
      value: Number(this.curToken.value),
    };
  }
  curPrecedence(): number {
    const p = precedence[this.curToken.type];
    if (p !== undefined) {
      return p;
    }
    return LOWEST;
  }
  peekPrecedence(): number {
    const p = precedence[this.peekToken.type];
    if (p !== undefined) {
      return p;
    }
    return LOWEST;
  }
  parseExpression(precedence: number): any {
    const prefix = this.prefixParseFns[this.curToken.type];
    if (!prefix) {
      throw new Error("No prefix parse function.");
    }
    let leftExp = prefix();

    while (
      this.curToken.type !== tokenTypes.EOF &&
      precedence < this.peekPrecedence()
    ) {
      const infix = this.infixParseFns[this.peekToken.type];
      if (!infix) {
        return leftExp;
      }
      this.nextToken();
      leftExp = infix(leftExp);
    }

    return leftExp;
  }
  parsePrefixExpression() {
    const token = this.curToken;
    const op = this.curToken.value;
    this.nextToken();
    return createPrefixExpression(token, op, this.parseExpression(LOWEST));
  }
  parseInfixExpression(left: any) {
    const token = this.curToken;
    const op = this.curToken.value;
    const p = this.curPrecedence();
    this.nextToken();
    return createInfixExpression(token, op, left, this.parseExpression(p));
  }
  expectPeek(tokenType: string): boolean {
    if (this.peekToken.type === tokenType) {
      this.nextToken();
      return true;
    }
    return false;
  }
  parseGroupedExpression() {
    this.nextToken();
    const exp = this.parseExpression(LOWEST);
    if (!this.expectPeek(tokenTypes.RPAREN)) {
      throw new Error("Invalid Grouped Expression.");
    }
    return exp;
  }
}
