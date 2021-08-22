import formulas from "../formula";
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
    input.croak("Can't handle character: " + ch);
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
    "<": 7,
    ">": 7,
    "<=": 7,
    ">=": 7,
    "<>": 7,
    "=": 7,
    "+": 10,
    "-": 10,
    "*": 20,
    "/": 20,
    "%": 20,
    "^": 20,
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
    else input.croak('Expecting punctuation: "' + ch + '"');
  }

  function maybeBinary(left: any, pre: number): any {
    const tok = isOperator();
    if (tok) {
      const newPre = PRECEDENCE[tok.value];
      if (newPre > pre) {
        input.next();
        return maybeBinary(
          {
            type: tok.value == "=" ? "assign" : "binary",
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
      input.croak("Unexpected token: " + JSON.stringify(input.peek()));
    });
  }
  function parse(): Program {
    const prog = [];
    while (!input.eof()) {
      prog.push(parseExpression());
      if (!input.eof()) skipPunctuation(";");
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
  vars: any;
  parent: Environment | null;
  constructor(parent: Environment | null) {
    this.parent = parent;
    this.vars = Object.create(parent ? parent.vars : null);
  }
  extend = () => {
    return new Environment(this);
  };
  lookup = (name: string) => {
    // eslint-disable-next-line @typescript-eslint/no-this-alias
    let scope: any = this;
    while (scope) {
      if (Object.prototype.hasOwnProperty.call(scope.vars, name)) {
        return scope;
      }
      scope = scope.parent;
    }
  };
  get = (name: string) => {
    if (name in this.vars) {
      return this.vars[name];
    }
    throw new Error("Undefined variable " + name);
  };
  set = (name: string, value: any) => {
    const scope = this.lookup(name);
    if (!scope || this.parent) {
      throw new Error("undefined variable " + name);
    }
    return ((scope || this).vars[name] = value);
  };
  def = (name: string, value: any) => {
    return (this.vars[name] = value);
  };
}

const evaluateMap: Record<string, (ast: any, scope: Environment) => any> = {
  NumberLiteral: (ast: NumberLiteral) => ast.value,
  StringLiteral: (ast: StringLiteral) => ast.value,
  BooleanLiteral: (ast: BooleanLiteral) => ast.value,
  VariableLiteral: (ast: VariableLiteral, scope: Environment) => scope.get(ast.value),
  assign: (ast: any, scope: Environment) => {
    if (ast.left.type !== "variable") {
      throw new Error("Can not assign to " + JSON.stringify(ast.left));
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
    throw new Error(`I don't know how to evaluate ${ast.type}`);
  }
  return func(ast, scope);
}

function applyOperator(op: string, a: any, b: any) {
  function num(x: number) {
    if (typeof x != "number") throw new Error("Expected number but got " + x);
    return x;
  }
  function div(x: number) {
    if (num(x) == 0) throw new Error("Divide by zero");
    return x;
  }
  switch (op) {
    case "+":
      return num(a) + num(b);
    case "-":
      return num(a) - num(b);
    case "*":
      return num(a) * num(b);
    case "/":
      return num(a) / div(b);
    case "%":
      return num(a) % div(b);
    case "<":
      return num(a) < num(b);
    case ">":
      return num(a) > num(b);
    case "<=":
      return num(a) <= num(b);
    case ">=":
      return num(a) >= num(b);
    case "^":
      return Math.pow(num(a), num(b));
    case "=":
      return a === b;
    case "<>":
      return a !== b;
  }
  throw new Error("Can't apply operator " + op);
}

function init(): void {
  const globalEnv = new Environment(null);
  Object.keys(formulas).forEach((key) => {
    globalEnv.def(key, formulas[key]);
  });
  const code = "sum(1,3,45)";
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
  const result = evaluate(ast, globalEnv);
  console.log(result);
}
init();
