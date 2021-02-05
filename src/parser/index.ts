import * as functionList from "../formula";
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

enum TokenType {
  EOF = 0,
  NA,
  LETTER,
  COMMA,
  LEFT_BRACKET,
  RIGHT_BRACKET,
}

type ParseResult = {
  result: number;
  error: ErrorType | null;
};

abstract class Lexer {
  input = "";
  index = 0;
  currentChar = "";
  constructor(value: string) {
    this.input = value;
    this.currentChar = value.charAt(this.index);
  }
}

class Token {
  type: number;
  text: string;
  constructor(type: number, text: string) {
    this.type = type;
    this.text = text;
  }
  toString(): string {
    const name = TokenType[this.type];
    return `<${this.text},${name}>`;
  }
}

class FormulaLexer extends Lexer {
  constructor(input: string) {
    super(input);
  }
  init(): Token[] {
    const result: Token[] = [];
    while (this.currentChar !== TokenType[0]) {
      const temp = this.nextToken();
      result.push(temp);
    }
    return result;
  }
  isLetter(): boolean {
    return (
      (this.currentChar >= "a" && this.currentChar <= "z") ||
      (this.currentChar >= "A" && this.currentChar <= "Z") ||
      (this.currentChar >= "0" && this.currentChar <= "9")
    );
  }
  consume(): void {
    this.index++;
    if (this.index >= this.input.length) {
      this.currentChar = TokenType[0];
      return;
    }
    this.currentChar = this.input.charAt(this.index);
  }
  whiteSpace(): void {
    while (
      this.currentChar === " " ||
      this.currentChar === "\r" ||
      this.currentChar === "\n" ||
      this.currentChar === "\t"
    ) {
      this.consume();
    }
  }
  character(): Token {
    const result = [];
    do {
      result.push(this.currentChar);
      this.consume();
    } while (this.isLetter());
    const temp = result.join("");
    return new Token(TokenType.LETTER, temp);
  }
  nextToken(): Token {
    while (this.currentChar !== TokenType[0]) {
      switch (this.currentChar) {
        case " ":
        case "\t":
        case "\n":
        case "\r":
          this.whiteSpace();
          continue;
        case ",":
          this.consume();
          return new Token(TokenType.COMMA, ",");
        case "(":
          this.consume();
          return new Token(TokenType.LEFT_BRACKET, "(");
        case ")":
          this.consume();
          return new Token(TokenType.RIGHT_BRACKET, ")");
        default:
          if (this.isLetter()) {
            return this.character();
          }
          throw new Error(`invalid character: ${this.currentChar}`);
      }
    }
    return new Token(TokenType.EOF, TokenType[0]);
  }
}

function formulaParser(text: string): ParseResult {
  const instance = new FormulaLexer(text);
  const result = instance.init();
  if (result.length < 4) {
    return { result: 0, error: "#ERROR!" };
  }
  const [functionName, leftBracket, ...rest] = result;
  if (
    functionName.type !== TokenType.LETTER ||
    leftBracket.type !== TokenType.LEFT_BRACKET
  ) {
    return { result: 0, error: "#ERROR!" };
  }
  if (rest[rest.length - 1].type !== TokenType.RIGHT_BRACKET) {
    return { result: 0, error: "#ERROR!" };
  }
  const params = [];
  for (let i = 0; i < rest.length - 1; i += 2) {
    if (rest[i].type === TokenType.LETTER) {
      params.push(rest[i].text);
    }

    if (i + 1 < rest.length - 1 && rest[i + 1].type !== TokenType.COMMA) {
      return { result: 0, error: "#ERROR!" };
    }
  }
  const funName = functionName.text.toUpperCase();
  const func = functionList[funName];
  if (typeof func === "function") {
    const temp = func(...params);
    return { result: temp, error: null };
  }
  return { result: 0, error: "#ERROR!" };
}

export { FormulaLexer, formulaParser };
