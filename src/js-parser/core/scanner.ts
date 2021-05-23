import { globalData, tokenTypes, Token } from "./token";
import { errPrint } from "../init/commons";
import { validVar, validNumber, validBlank } from "../utils/utils";
import { defineKeywords } from "./define";

function scanKeyword(str: string) {
  if (defineKeywords[str]) {
    return defineKeywords[str];
  }
  return tokenTypes.T_IDENT;
}

function scanStr(endStr: string) {
  let s = "";
  let c = nextChar();
  // eslint-disable-next-line no-constant-condition
  while (1) {
    if (c === endStr) {
      break;
    }
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
    while (
      typeof c !== "undefined" &&
      !validBlank(c) &&
      (validNumber(c) || validVar(c))
    ) {
      if (str.length > globalData.KEYWORD_MAX_LENGTH) {
        errPrint(`Identifier too long : ${str}`);
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
  while (validNumber(c)) {
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
    if (
      value !== " " &&
      value.indexOf("\r\n") === -1 &&
      value.indexOf("\n") === -1 &&
      value.indexOf("\r") === -1
    ) {
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
        token.type = tokenTypes.T_RCMT;
      } else {
        putBack(next);
        token.type = tokenTypes.T_MUL;
      }

      break;
    case "/":
      next = nextChar();
      if (next === "*") {
        token.type = tokenTypes.T_LCMT;
      } else if (next === "/") {
        token.type = tokenTypes.T_LINE_CMT;
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
        token.type = tokenTypes.T_EQ;
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
      token.type = tokenTypes.T_SEMI;
      break;
    case "!":
      next = nextChar();
      if (next === "=") {
        token.type = tokenTypes.T_NEQ;
      }
      errPrint(`Unrecognised char : ${value}${next}`);
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
      token.type = tokenTypes.T_LPT;
      break;
    case ")":
      token.type = tokenTypes.T_RPT;
      break;
    case "{":
      token.type = tokenTypes.T_LBR;
      break;
    case "}":
      token.type = tokenTypes.T_RBR;
      break;
    case "[":
      token.type = tokenTypes.T_LMBR;
      break;
    case "]":
      token.type = tokenTypes.T_RMBR;
      break;
    case "?":
      token.type = tokenTypes.T_QST;
      break;
    case ":":
      token.type = tokenTypes.T_COL;
      break;
    case '"':
      token.type = tokenTypes.T_STRING;
      token.value = scanStr('"');
      break;
    case "'":
      token.type = tokenTypes.T_STRING;
      token.value = scanStr("'");
      break;

    default:
      if (validNumber(value)) {
        token.value = scanInt(value);
        token.type = tokenTypes.T_INT;
        break;
      } else if (validVar(value)) {
        value = scanIdent(value);
        token.type = scanKeyword(value);
        token.value = value;
        break;
      }
      errPrint(`Unrecognised char : (${value})`);
  }
  if (token.type === tokenTypes.T_LINE_CMT) {
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
    errPrint(
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

function leftBrace(): boolean {
  return match(tokenTypes.T_LBR, "{");
}

function rightBrace(): boolean {
  return match(tokenTypes.T_RBR, "}");
}

function leftPt(): boolean {
  return match(tokenTypes.T_LPT, "(");
}

function rightPt(): boolean {
  return match(tokenTypes.T_RPT, ")");
}

function semicolon(): boolean {
  return match(tokenTypes.T_SEMI, ";");
}

export {
  scan,
  match,
  leftBrace,
  rightBrace,
  leftPt,
  rightPt,
  semicolon,
  putBackToken,
};
