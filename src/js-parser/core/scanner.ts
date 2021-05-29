import { globalData, tokenTypes, Token } from "./token";
import { printError } from "../init/commons";
import { validIdentifier, isNumber, isBlankChar } from "../utils/utils";
import { defineKeywords } from "./define";

function scanKeyword(str: string) {
  if (defineKeywords[str]) {
    return defineKeywords[str];
  }
  return tokenTypes.T_IDENTIFIER;
}

function scanString(endStr: string) {
  let s = "";
  let c = nextChar();
  while (c !== endStr) {
    if (c === "\\") {
      c = nextChar();
    }
    s += c;
    c = nextChar();
  }

  return s;
}

function scanIdent(s: string) {
  let str = s;
  let c = nextChar();
  if (c) {
    while (isNumber(c) || validIdentifier(c)) {
      if (str.length > globalData.KEYWORD_MAX_LENGTH) {
        printError(`Identifier too long : ${str}`);
        return "";
      }
      str += c;
      c = nextChar();
    }
    putBack(c);
  }
  return str;
}

function scanInt(s: string) {
  let n = Number(s);
  let c = nextChar();
  while (isNumber(c)) {
    n = n * 10 + Number(c);
    c = nextChar();
  }
  putBack(c);
  return n;
}

function skipBlank() {
  // eslint-disable-next-line no-constant-condition
  while (1) {
    const value = nextChar();
    if (!value) {
      return;
    }
    if (!isBlankChar(value)) {
      putBack(value);
      return;
    }
  }
}

function skipOneLine() {
  const line = globalData.line;
  while (line === globalData.line) {
    nextChar();
  }
}

function scan(): boolean {
  skipBlank();
  const { content, index, token, nextToken } = globalData;
  token.value = null;

  if (nextToken) {
    globalData.token.type = nextToken.type;
    globalData.token.value = nextToken.value;
    globalData.nextToken = null;
    return !!globalData.token;
  }
  if (index >= content.length) {
    token.type = tokenTypes.T_EOF;
    return false;
  }
  let value = nextChar();
  let next;

  switch (value) {
    case "+":
      token.type = tokenTypes.T_ADD;
      break;
    case "-":
      token.type = tokenTypes.T_SUB;
      break;
    case "*":
      next = nextChar();
      if (next === "/") {
        token.type = tokenTypes.T_RIGHT_BLOCK_COMMENT;
      } else {
        putBack(next);
        token.type = tokenTypes.T_MUL;
      }

      break;
    case "/":
      next = nextChar();
      if (next === "*") {
        token.type = tokenTypes.T_LEFT_BLOCK_COMMENT;
      } else if (next === "/") {
        token.type = tokenTypes.T_LINE_COMMENT;
      } else {
        putBack(next);
        token.type = tokenTypes.T_DIV;
      }
      break;

    case ",":
      token.type = tokenTypes.T_COMMA;
      break;
    case "=":
      next = nextChar();
      if (next === "=") {
        token.type = tokenTypes.T_EQUAL;
        next = nextChar();
        if (next !== "=") {
          putBack(next);
        }
      } else {
        token.type = tokenTypes.T_ASSIGN;
        putBack(next);
      }
      break;
    case ";":
      token.type = tokenTypes.T_SEMICOLON;
      break;
    case "!":
      next = nextChar();
      if (next === "=") {
        token.type = tokenTypes.T_NOT_EQUAL;
      }
      printError(`Unrecognised char : ${value}${next}`);
      break;
    case ">":
      next = nextChar();
      if (next === "=") {
        token.type = tokenTypes.T_GE;
      } else {
        token.type = tokenTypes.T_GT;
        putBack(next);
      }
      break;
    case "<":
      next = nextChar();
      if (next === "=") {
        token.type = tokenTypes.T_LE;
      } else {
        token.type = tokenTypes.T_LT;
        putBack(next);
      }
      break;
    case "&":
      next = nextChar();
      if (next === "&") {
        token.type = tokenTypes.T_AND;
      } else {
        //todo
        putBack(next);
      }
      break;
    case "|":
      next = nextChar();
      if (next === "|") {
        token.type = tokenTypes.T_OR;
      } else {
        //todo
        putBack(next);
      }
      break;
    case "(":
      token.type = tokenTypes.T_LEFT_BRACKET;
      break;
    case ")":
      token.type = tokenTypes.T_RIGHT_BRACKET;
      break;
    case "{":
      token.type = tokenTypes.T_LEFT_CURLY_BRACKET;
      break;
    case "}":
      token.type = tokenTypes.T_RIGHT_CURLY_BRACKET;
      break;
    case "[":
      token.type = tokenTypes.T_LEFT_SQUARE_BRACKET;
      break;
    case "]":
      token.type = tokenTypes.T_RIGHT_SQUARE_BRACKET;
      break;
    case "?":
      token.type = tokenTypes.TERNARY_EXPRESSION;
      break;
    case ":":
      token.type = tokenTypes.COLON;
      break;
    case '"':
      token.type = tokenTypes.T_STRING;
      token.value = scanString('"');
      break;
    case "'":
      token.type = tokenTypes.T_STRING;
      token.value = scanString("'");
      break;

    default:
      if (isNumber(value)) {
        token.value = scanInt(value);
        token.type = tokenTypes.INTEGER;
      } else if (validIdentifier(value)) {
        value = scanIdent(value);
        token.type = scanKeyword(value);
        token.value = value;
      } else {
        printError(`Unrecognised char : (${value})`);
      }
      break;
  }
  if (token.type === tokenTypes.T_LINE_COMMENT) {
    skipOneLine();
    scan();
  }
  return true;
}

function match(type: string, text: string): boolean {
  if (globalData.token.type === type) {
    scan();
    return true;
  } else {
    printError(
      `Exception : (${globalData.token.type},${globalData.token.value}) !== (${type},${text})`
    );
    return false;
  }
}

function nextChar(): string {
  const { content, putBack } = globalData;

  if (putBack) {
    const c = putBack;
    globalData.putBack = "";
    return c;
  }
  globalData.index += 1;
  if (globalData.index <= content.length - 1) {
    const value = content[globalData.index];
    if (value.indexOf("\r\n") > -1 || value.indexOf("\n") > -1) {
      globalData.line += 1;
    }
    return value;
  }
  return "";
}

function putBackToken(token: Token): void {
  globalData.nextToken = JSON.parse(JSON.stringify(token));
}
function putBack(char: string) {
  globalData.putBack = char;
}

function matchLeftCurlyBracket(): boolean {
  return match(tokenTypes.T_LEFT_CURLY_BRACKET, "{");
}

function matchRightCurlyBracket(): boolean {
  return match(tokenTypes.T_RIGHT_CURLY_BRACKET, "}");
}

function matchLeftBracket(): boolean {
  return match(tokenTypes.T_LEFT_BRACKET, "(");
}

function matchRightBracket(): boolean {
  return match(tokenTypes.T_RIGHT_BRACKET, ")");
}

function matchSemicolon(): boolean {
  return match(tokenTypes.T_SEMICOLON, ";");
}

export {
  scan,
  match,
  matchLeftCurlyBracket,
  matchRightCurlyBracket,
  matchLeftBracket,
  matchRightBracket,
  matchSemicolon,
  putBackToken,
};
