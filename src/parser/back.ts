import formulas from "../formula";

type ErrorTypes =
  | "#ERROR!"
  | "#DIV/0!"
  | "#NAME?"
  | "#N/A"
  | "#NULL!"
  | "#NUM!"
  | "#REF!"
  | "#VALUE!";
const FORMULA_ERRORS: ErrorTypes[] = [
  "#ERROR!",
  "#DIV/0!",
  "#NAME?",
  "#N/A",
  "#NULL!",
  "#NUM!",
  "#REF!",
  "#VALUE!",
];
function throwError(isOk: boolean, type: ErrorTypes): void {
  if (!isOk) {
    throw new Error(type);
  }
}
function parseError(type: string): ErrorTypes | null {
  if (FORMULA_ERRORS.some((item) => item === type)) {
    return type as ErrorTypes;
  }
  return null;
}
interface IInputStreamResult {
  next: () => string;
  peek: () => string;
  eof: () => boolean;
  croak: (message: string) => void;
}
type TokenTypes =
  | "StringLiteral"
  | "NumberLiteral"
  | "VariableLiteral"
  | "keyword"
  | "string"
  | "punctuation"
  | "operator"
  | "BooleanLiteral";
interface ITokenType {
  type: TokenTypes;
  value: string | number;
}
interface NumberLiteral {
  type: "NumberLiteral";
  value: number;
}
interface StringLiteral {
  type: "StringLiteral";
  value: string;
}
interface BooleanLiteral {
  type: "BooleanLiteral";
  value: boolean;
}
interface VariableLiteral {
  type: "VariableLiteral";
  value: string;
}
interface ITokenStreamResult extends Pick<IInputStreamResult, "croak" | "eof"> {
  next: () => ITokenType | null;
  peek: () => ITokenType | null;
}

interface Program {
  type: "Program";
  body: any[];
}

function InputStream(input: string): IInputStreamResult {
  let pos = 0;
  let line = 1;
  let col = 0;

  function next() {
    const ch = input.charAt(pos++);
    if (ch == "\n") line++, (col = 0);
    else col++;
    return ch;
  }
  function peek() {
    return input.charAt(pos);
  }
  function eof() {
    return peek() == "";
  }
  function croak(message: string) {
    throw new Error(message + " (" + line + ":" + col + ")");
  }
  return {
    next: next,
    peek: peek,
    eof: eof,
    croak: croak,
  };
}

function TokenStream(
  input: IInputStreamResult,
  handleIdentifier: (data: string) => ITokenType
): ITokenStreamResult {
  let current: ITokenType | null = null;
  function isDigit(ch: string) {
    return ch >= "0" && ch <= "9";
  }
  function isIdentifierStart(ch: string) {
    return /[a-zλ_]/i.test(ch);
  }
  function isIdentifier(ch: string) {
    return isIdentifierStart(ch) || "?!-<>=0123456789".indexOf(ch) >= 0;
  }
  function isOperatorChar(ch: string) {
    return "+-*/%=&|<>^".indexOf(ch) >= 0;
  }
  function isPunctuation(ch: string) {
    return ",()".indexOf(ch) >= 0;
  }
  function isWhitespace(ch: string) {
    return " \t\n\r".indexOf(ch) >= 0;
  }
  function readWhile(predicate: (char: string) => boolean) {
    let str = "";
    while (!input.eof() && predicate(input.peek())) str += input.next();
    return str;
  }
  function readNumber(): NumberLiteral {
    let has_dot = false;
    const number = readWhile(function (ch) {
      if (ch == ".") {
        if (has_dot) return false;
        has_dot = true;
        return true;
      }
      return isDigit(ch);
    });
    return { type: "NumberLiteral", value: parseFloat(number) };
  }
  function readIdentifier(): ITokenType {
    const id = readWhile(isIdentifier);
    return handleIdentifier(id);
  }
  function readEscaped(end: string) {
    let escaped = false;
    let str = "";
    input.next();
    while (!input.eof()) {
      const ch = input.next();
      if (escaped) {
        str += ch;
        escaped = false;
      } else if (ch == "\\") {
        escaped = true;
      } else if (ch == end) {
        break;
      } else {
        str += ch;
      }
    }
    return str;
  }
  function readString(): StringLiteral {
    return { type: "StringLiteral", value: readEscaped('"') };
  }

  function readNext(): ITokenType | null {
    readWhile(isWhitespace);
    if (input.eof()) return null;
    const ch = input.peek();
    if (ch == '"') return readString();
    if (isDigit(ch)) return readNumber();
    if (isIdentifierStart(ch)) return readIdentifier();
    if (isPunctuation(ch))
      return {
        type: "punctuation",
        value: input.next(),
      };
    if (isOperatorChar(ch))
      return {
        type: "operator",
        value: readWhile(isOperatorChar),
      };
    input.croak("TokenStream: Can't handle character: " + ch);
    return null;
  }
  function peek() {
    return current || (current = readNext());
  }
  function next() {
    const tok = current;
    current = null;
    return tok || readNext();
  }
  function eof() {
    return peek() == null;
  }
  return {
    next: next,
    peek: peek,
    eof: eof,
    croak: input.croak,
  };
}

function parse(input: ITokenStreamResult) {
  const PRECEDENCE: Record<string, number> = {
    "=": 1,
    "<=": 2,
    ">=": 2,
    "<>": 2,
    NOT: 2,
    "||": 2,
    "<": 3,
    ">": 3,
    "+": 4,
    "-": 4,
    "*": 5,
    "/": 5,
    "^": 6,
    "&": 7,
    "%": 8,
  };

  function isPunctuation(ch: string) {
    const tok = input.peek();
    return tok && tok.type == "punctuation" && (!ch || tok.value == ch) && tok;
  }
  function isKeyword(kw: string) {
    const tok = input.peek();
    return tok && tok.type == "keyword" && (!kw || tok.value == kw) && tok;
  }
  function isOperator(op?: string) {
    const tok = input.peek();
    return tok && tok.type == "operator" && (!op || tok.value == op) && tok;
  }
  function skipPunctuation(ch: string) {
    if (isPunctuation(ch)) input.next();
    else input.croak('parse: Expecting punctuation: "' + ch + '"');
  }

  function maybeBinary(left: any, pre: number): any {
    const tok = isOperator();
    if (tok) {
      const newPre = PRECEDENCE[tok.value];
      if (newPre > pre) {
        input.next();
        return maybeBinary(
          {
            type: "binary",
            operator: tok.value,
            left: left,
            right: maybeBinary(parseAtom(), newPre),
          },
          pre
        );
      }
    }
    return left;
  }
  function delimited(
    start: string,
    stop: string,
    separator: string,
    parser: () => any
  ) {
    const a = [];
    let first = true;
    skipPunctuation(start);
    while (!input.eof()) {
      if (isPunctuation(stop)) break;
      if (first) first = false;
      else skipPunctuation(separator);
      if (isPunctuation(stop)) break;
      a.push(parser());
    }
    skipPunctuation(stop);
    return a;
  }
  function parseCall(func: (data: any) => any): any {
    return {
      type: "call",
      func: func,
      args: delimited("(", ")", ",", parseExpression),
    };
  }

  function parseBool(): BooleanLiteral {
    return {
      type: "BooleanLiteral",
      value: input.next()?.value == "true",
    };
  }
  function maybeCall(expr: any) {
    expr = expr();
    return isPunctuation("(") ? parseCall(expr) : expr;
  }
  function parseAtom() {
    return maybeCall(() => {
      if (isPunctuation("(")) {
        input.next();
        const exp = parseExpression();
        skipPunctuation(")");
        return exp;
      }
      if (isKeyword("true") || isKeyword("false")) {
        return parseBool();
      }
      const tok = input.next();
      if (
        tok?.type == "VariableLiteral" ||
        tok?.type == "NumberLiteral" ||
        tok?.type == "StringLiteral"
      ) {
        return tok;
      }
      input.croak("parse: Unexpected token: " + JSON.stringify(input.peek()));
    });
  }
  function parse(): Program {
    const prog = [];
    while (!input.eof()) {
      prog.push(parseExpression());
    }
    return { type: "Program", body: prog };
  }

  function parseExpression() {
    return maybeCall(() => {
      return maybeBinary(parseAtom(), 0);
    });
  }
  return parse();
}

class Environment {
  variables: Record<string, any> = {};
  extend = () => {
    return new Environment();
  };

  get = (name: string) => {
    if (name in this.variables) {
      return this.variables[name];
    }
    throw new Error("Environment: Undefined variable " + name);
  };
  set = (name: string, value: any) => {
    return (this.variables[name] = value);
  };
  def = (name: string, value: any) => {
    return (this.variables[name] = value);
  };
}

const evaluateMap: Record<string, (ast: any, scope: Environment) => any> = {
  NumberLiteral: (ast: NumberLiteral) => ast.value,
  StringLiteral: (ast: StringLiteral) => ast.value,
  BooleanLiteral: (ast: BooleanLiteral) => ast.value,
  VariableLiteral: (ast: VariableLiteral, scope: Environment) => {
    scope.get(ast.value);
  },
  assign: (ast: any, scope: Environment) => {
    if (ast.left.type !== "variable") {
      throw new Error(
        "evaluateMap: Can not assign to " + JSON.stringify(ast.left)
      );
    }
    return scope.set(ast.left.value, evaluate(ast.left, scope));
  },
  binary: (ast: any, scope: Environment) => {
    return applyOperator(
      ast.operator,
      evaluate(ast.left, scope),
      evaluate(ast.right, scope)
    );
  },

  Program: (ast: Program, scope: Environment) => {
    let val = false;
    ast.body.forEach((element: any) => {
      val = evaluate(element, scope);
    });
    return val;
  },
  call: (ast: any, scope: Environment) => {
    const func = evaluate(ast.func, scope);
    const args = ast.args.map((arg: any) => evaluate(arg, scope));
    return func(...args);
  },
};

function evaluate(ast: any, scope: Environment) {
  const func = evaluateMap[ast.type];
  if (!func) {
    throw new Error(`evaluate: I don't know how to evaluate ${ast.type}`);
  }
  return func(ast, scope);
}

function applyOperator(op: string, a: any, b: any) {
  function num(x: number) {
    throwError(typeof x === "number", "#VALUE!");
    return x;
  }
  switch (op) {
    case "=":
      return a == b;
    case "<=":
      return num(a) <= num(b);
    case ">=":
      return num(a) >= num(b);
    case "<>":
      return a != b;
    case "<":
      return num(a) < num(b);
    case ">":
      return num(a) > num(b);
    case "+":
      return num(a) + num(b);
    case "-":
      return num(a) - num(b);
    case "*":
      return num(a) * num(b);
    case "/": {
      throwError(num(b) !== 0, "#DIV/0!");
      return num(a) / num(b);
    }
    case "^":
      return Math.pow(num(a), num(b));
    case "&":
      return `${a}${b}`;
    case "%":
      return num(a) * 0.01;
  }
  throw new Error("applyOperator: Can't apply operator " + op);
}

function parser(code: string, globalEnv: Environment) {
  const ast = parse(
    TokenStream(InputStream(code), (value: string) => {
      if (value === "true" || value === "false") {
        return {
          type: "keyword",
          value,
        };
      }
      const key = value.toUpperCase();
      if (formulas[key]) {
        return {
          type: "VariableLiteral",
          value: key,
        };
      }
      return {
        type: "VariableLiteral",
        value,
      };
    })
  );

  return evaluate(ast, globalEnv);
}
export function parseFormula(code: string): {
  result: any;
  error: ErrorTypes | null;
} {
  let result: any = null;
  let error: ErrorTypes | null = null;
  try {
    if (code === "") {
      result = "";
    } else {
      const globalEnv = new Environment();
      Object.keys(formulas).forEach((key) => {
        globalEnv.def(key, formulas[key]);
      });
      result = parser(code, globalEnv);
    }
  } catch (e) {
    const message = parseError(e.message);
    if (message) {
      error = message;
    } else {
      console.log(e);
      error = "#ERROR!";
    }
  }
  if (result instanceof Error) {
    error = parseError(result.message) || "#ERROR!";
    result = null;
  }
  return {
    result,
    error,
  };
}
