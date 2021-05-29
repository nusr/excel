import { Scope } from "./scope";

const T_ADD = "+";
const T_SUB = "-";
const T_MUL = "*";
const T_DIV = "/";

const TERNARY_EXPRESSION = "?";
const COLON = ":";
const T_LEFT_BLOCK_COMMENT = "/*";
const T_RIGHT_BLOCK_COMMENT = "*/";
const T_LINE_COMMENT = "//";

const T_GT = ">";
const T_GE = ">=";
const T_LT = "<";
const T_LE = "<=";
const T_EQUAL = "==";
const T_NOT_EQUAL = "!=";

const T_AND = "&&";
const T_OR = "||";

const T_EOF = "";
const T_SEMICOLON = ";";
const T_COMMA = ",";

const T_ASSIGN = "=";

const T_VAR = "var";
const T_IDENTIFIER = "identifier";
const T_LEFT_VALUE = "leftValue";

const T_LEFT_BRACKET = "(";
const T_RIGHT_BRACKET = ")";
const T_LEFT_CURLY_BRACKET = "{";
const T_RIGHT_CURLY_BRACKET = "}";
const T_LEFT_SQUARE_BRACKET = "[";
const T_RIGHT_SQUARE_BRACKET = "]";

const T_OBJECT = "[object object]";
const T_ARRAY = "array";
const T_VISIT = "visit key";

const T_STRING = "string";
const T_NULL = "null";
const T_UNDEFINED = "undefined";
const T_BOOLEAN = "BOOL";

const INTEGER = "integer";
const T_FUNCTION = "function";
const T_NATIVE_FUN = "native function";
const T_FUNCTION_CALL = "execute function";
const T_FUNCTION_ARGUMENTS = "args";
const T_ARGUMENT = "argument";
const T_RETURN = "return";

const T_IF = "if";
const T_ELSE = "else";
const T_WHILE = "while_loop";
const T_FOR = "for_loop";

const T_GLUE = "_glue";

const precedenceList = {
  "": 0,
  assign: 1,
  condition: 2,
  and: 2.5,
  compare: 3,
  sum: 4,
  product: 5,
  prefix: 6,
  postfix: 7,
  call: 8,
};

const tokenTypes = {
  T_ADD,
  T_SUB,
  T_MUL,
  T_DIV,
  T_RIGHT_BLOCK_COMMENT,
  T_LEFT_BLOCK_COMMENT,
  T_LINE_COMMENT,
  TERNARY_EXPRESSION,
  COLON,
  T_ASSIGN,
  T_VAR,
  T_IDENTIFIER,
  T_EOF,
  T_SEMICOLON,
  T_COMMA,
  T_AND,
  T_OR,
  T_GT,
  T_GE,
  T_LT,
  T_LE,
  T_EQUAL,
  T_NOT_EQUAL,
  T_IF,
  T_ELSE,
  T_LEFT_BRACKET,
  T_RIGHT_BRACKET,
  T_LEFT_CURLY_BRACKET,
  T_RIGHT_CURLY_BRACKET,
  T_LEFT_SQUARE_BRACKET,
  T_RIGHT_SQUARE_BRACKET,
  T_WHILE,
  T_FOR,
  T_FUNCTION,
  T_FUNCTION_CALL,
  T_RETURN,
  T_ARGUMENT,
  INTEGER,
  T_STRING,
  T_NULL,
  T_UNDEFINED,
  T_BOOLEAN,
  T_OBJECT,
  T_ARRAY,
};

const ASTNodeTypes = {
  T_ADD,
  T_SUB,
  T_MUL,
  T_DIV,
  T_VAR,
  T_ASSIGN,
  INTEGER,
  T_IDENTIFIER,
  T_STRING,
  T_NULL,
  T_UNDEFINED,
  T_BOOLEAN,
  T_OBJECT,
  T_LEFT_VALUE,
  T_GT,
  T_GE,
  T_LT,
  T_LE,
  T_EQUAL,
  T_NOT_EQUAL,
  T_AND,
  T_OR,
  T_IF,
  T_ELSE,
  T_LEFT_BRACKET,
  T_RIGHT_BRACKET,
  T_LEFT_CURLY_BRACKET,
  T_RIGHT_CURLY_BRACKET,
  T_GLUE,
  T_WHILE,
  T_FOR,
  T_FUNCTION,
  T_FUNCTION_CALL,
  T_FUNCTION_ARGUMENTS,
  T_RETURN,
  T_NATIVE_FUN,
  T_ARGUMENT,
  T_ARRAY,
  T_VISIT,
};

class Token {
  type: string;
  value: unknown;
  constructor(tokenType: string, initValue: unknown) {
    this.type = tokenType;
    this.value = initValue;
  }
}

interface IData {
  line: number;
  index: number;
  putBack: string;
  content: string;
  nextToken: null | Token;
  token: Token;
  KEYWORD_MAX_LENGTH: number;
  globalScope: Scope;
  reset(): void;
}
const DEFAULT_CONFIG = {
  line: 1,
  index: -1,
  putBack: "",
  content: "",
  nextToken: null,
  token: new Token("", null),
  KEYWORD_MAX_LENGTH: 512,
  globalScope: new Scope(),
};
const globalData: IData = {
  ...DEFAULT_CONFIG,
  reset() {
    Object.assign(globalData, {
      ...DEFAULT_CONFIG,
    });
  },
};

export { tokenTypes, globalData, Token, precedenceList, ASTNodeTypes };
