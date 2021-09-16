import type { Token, TokenType, TokenSubType } from "../type";

// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
export function tokenStream(tokens: Token[]) {
  const placeholderToken: Token = {
    type: "unknown",
    value: "",
    subtype: "start",
  };
  const arr: Token[] = [...tokens, placeholderToken];
  let index = 0;

  return {
    consume() {
      index += 1;
      if (index >= arr.length) {
        throw new Error("Invalid Syntax");
      }
    },
    getNext() {
      return arr[index];
    },
    nextIs(type: TokenType, subtype?: TokenSubType) {
      if (this.getNext().type !== type) return false;
      if (subtype && this.getNext().subtype !== subtype) return false;
      return true;
    },
    nextIsOpenParen() {
      return this.nextIs("sub-expression", "start");
    },
    nextIsTerminal() {
      if (this.nextIsNumber()) return true;
      if (this.nextIsText()) return true;
      if (this.nextIsLogical()) return true;
      if (this.nextIsDefineName()) return true;
      if (this.nextIsRange()) return true;
      return false;
    },
    nextIsFunctionCall() {
      return this.nextIs("function", "start");
    },
    nextIsFunctionArgumentSeparator() {
      return this.nextIs("argument");
    },
    nextIsEndOfFunctionCall() {
      return this.nextIs("function", "stop");
    },
    nextIsBinaryOperator() {
      return this.nextIs("operator-infix");
    },
    nextIsPrefixOperator() {
      return this.nextIs("operator-prefix");
    },
    nextIsPostfixOperator() {
      return this.nextIs("operator-postfix");
    },
    nextIsRange() {
      return this.nextIs("operand", "range");
    },
    nextIsNumber() {
      return this.nextIs("operand", "number");
    },
    nextIsText() {
      return this.nextIs("operand", "text");
    },
    nextIsDefineName() {
      return this.nextIs("operand", "define-name");
    },
    nextIsLogical() {
      return this.nextIs("operand", "logical");
    },
    pos() {
      return index;
    },
  };
}
export type StreamResult = ReturnType<typeof tokenStream>;
