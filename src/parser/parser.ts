import { isNumber, parseNumber } from "@/util";
import functionList from "../formula";
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
  result: unknown;
  error: ErrorType | null;
};
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

class FormulaLexer {
  input = "";
  index = 0;
  init(input = ""): Token[] {
    this.index = 0;
    this.input = input;
    const result: Token[] = [];
    for (; this.index < this.input.length; ) {
      const temp = this.nextToken();
      if (temp.type !== TokenType.EOF) {
        result.push(temp);
      }
    }
    // console.log(result);
    return result;
  }
  isLetter(currentChar: string): boolean {
    return (
      (currentChar >= "a" && currentChar <= "z") ||
      (currentChar >= "A" && currentChar <= "Z") ||
      (currentChar >= "0" && currentChar <= "9")
    );
  }
  character(): Token {
    const result = [];
    for (; this.index < this.input.length; ) {
      const currentChar = this.input[this.index];
      if (this.isLetter(currentChar)) {
        result.push(currentChar);
        this.index++;
      } else {
        break;
      }
    }
    const temp = result.join("");
    return new Token(TokenType.LETTER, temp);
  }
  nextToken(): Token {
    for (; this.index < this.input.length; ) {
      const currentChar = this.input[this.index];
      switch (currentChar) {
        case " ":
        case "\t":
        case "\n":
        case "\r":
          this.index++;
          continue;
        case ",":
          this.index++;
          return new Token(TokenType.COMMA, ",");
        case "(":
          this.index++;
          return new Token(TokenType.LEFT_BRACKET, "(");
        case ")":
          this.index++;
          return new Token(TokenType.RIGHT_BRACKET, ")");
        default:
          if (this.isLetter(currentChar)) {
            return this.character();
          }
          throw new Error(`invalid character: ${currentChar}`);
      }
    }
    return new Token(TokenType.EOF, TokenType[0]);
  }
}
const emptyFunction = (...params: Array<number | string>): unknown => {
  console.log(params);
  throw new Error("error function");
};
class FormulaParser {
  lexer: FormulaLexer = new FormulaLexer();
  params: string[] = [];
  functionUtil = emptyFunction;
  init(text: string, convert?: (item: string) => string | number): ParseResult {
    const result = this.parse(text);
    if (result.error !== null) {
      return result;
    }
    const data = this.params.map((item) => {
      if (isNumber(item)) {
        return parseNumber(item);
      }
      if (convert === undefined) {
        return item;
      }
      return convert(item);
    });
    const temp = this.compute(data);
    if (isNaN(temp as number)) {
      return { result: 0, error: "#ERROR!" };
    }
    return { result: temp, error: null };
  }
  compute(data: Array<number | string>): unknown {
    return this.functionUtil(...data);
  }
  parse(text: string): ParseResult {
    this.functionUtil = emptyFunction;
    this.params = [];
    const result = this.lexer.init(text);
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
    for (let i = 0; i < rest.length - 1; i += 2) {
      if (rest[i].type === TokenType.LETTER) {
        this.params.push(rest[i].text);
      }

      if (i + 1 < rest.length - 1 && rest[i + 1].type !== TokenType.COMMA) {
        return { result: 0, error: "#ERROR!" };
      }
    }
    const funcName = functionName.text.toUpperCase();
    const temp = functionList[funcName];
    if (typeof temp === "function") {
      this.functionUtil = temp as typeof emptyFunction;
      return { result: 0, error: null };
    }
    return { result: 0, error: "#ERROR!" };
  }
}

export { FormulaLexer, FormulaParser };
