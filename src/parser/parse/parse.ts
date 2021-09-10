import { parser } from "../ast";
import { tokenizer } from "../tokenize";
import type {
  Node,
  CellNode,
  CellRangeNode,
  FunctionNode,
  NumberNode,
  UnaryExpressionNode,
  ResultType,
} from "../type";
import formulas, { FormulasKeys, FormulaType } from "../../formula";

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
function throwError(condition: boolean, type: ErrorTypes): asserts condition {
  if (!condition) {
    throw new Error(type);
  }
}
function parseError(type: string): ErrorTypes | null {
  if (FORMULA_ERRORS.some((item) => item === type)) {
    return type as ErrorTypes;
  }
  return null;
}

function applyOperator(op: string, a: ResultType, b: ResultType) {
  function num(x: ResultType) {
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

function parseTree(expr: string) {
  const tokens = tokenizer(expr);
  return parser(tokens);
}
export function parseCell(cell: CellNode): void {
  const { key } = cell;
  const index = key.indexOf("!");
  if (index > -1) {
    const node = parseTree(key.substr(index + 1)) as CellNode;
    cell.ns = key.substr(0, index).trim();
    cell.refType = node.refType;
    cell.key = node.key;
  }
  if (cell.ns === "") {
    delete cell.ns;
  }
}
export function parseCellRange(range: CellRangeNode): void {
  const { left, right } = range;
  const leftKey = left.key.trim();
  const index = leftKey.indexOf("!");
  if (index < 0) {
    return;
  }
  const sheet = leftKey.substr(0, index).trim();
  range.sheet = sheet;
  right.key = `${sheet}!${right.key}`;
}
export function parseFunction(func: FunctionNode): void {
  parseFuncNameSpace(func);
  parseFuncArguments(func);
}
function parseFuncNameSpace(func: FunctionNode) {
  const { name } = func;
  const parts = name.split(".");
  if (parts.length === 1) {
    return;
  }
  func.name = parts[parts.length - 1];
  func.ns = parts.slice(0, parts.length - 1).join(".");
}
function parseFuncArguments(func: FunctionNode) {
  parseFuncNegativeNumberArguments(func);
  parseFuncBooleanArguments(func);
}
function parseFuncNegativeNumberArguments(func: FunctionNode) {
  const isNegativeUnary = (node: UnaryExpressionNode) => {
    return (
      node.type === "unary-expression" &&
      node.operator === "-" &&
      node.operand.type === "number"
    );
  };
  func.arguments = func.arguments.map((node) => {
    const arg = node as UnaryExpressionNode;
    if (!isNegativeUnary(arg)) {
      return arg;
    }
    const value = -(arg.operand as NumberNode).value;
    const num: NumberNode = {
      type: "number",
      value,
    };
    return num;
  });
}
function toBool(value?: ResultType, defaultValue?: any) {
  if (value === null || value === undefined) {
    return defaultValue;
  }
  if (typeof value === "boolean") {
    return value;
  }
  const str = value.toString().trim().toLowerCase();
  if (str === "true") {
    return true;
  }
  if (str === "false") {
    return false;
  }
  return defaultValue;
}
function parseFuncBooleanArguments(func: FunctionNode) {
  const booleanRefType = (node: Node): boolean | null => {
    const arg = node as CellNode;
    const isMatch =
      arg.type === "cell" &&
      arg.refType === undefined &&
      (arg.key === "true" || arg.key === "false");
    return isMatch ? toBool(arg.key) : null;
  };
  func.arguments = func.arguments.map((node) => {
    const value = booleanRefType(node);
    return value === null
      ? node
      : {
          type: "boolean",
          value,
        };
  });
}

class Environment {
  funcs: Partial<FormulaType> = {};
  setFunc<T extends FormulasKeys>(name: T, value: FormulaType[T]) {
    return (this.funcs[name] = value);
  }
  getFunc<T extends FormulasKeys>(name: T) {
    if (this.funcs[name]) {
      return this.funcs[name];
    }
    throw new Error("Environment: Undefined function " + name);
  }
}
function codeGenerator(ast: Node, env: Environment): ResultType {
  switch (ast.type) {
    case "string":
    case "number":
    case "boolean":
      return ast.value;
    case "function": {
      const args = ast.arguments.map((node) => codeGenerator(node, env));
      const funcName = ast.name.toUpperCase() as FormulasKeys;
      const func = env.getFunc(funcName);
      if (!func) {
        throw new Error("not support function");
      }
      return func(...(args as any[]));
    }
    case "binary-expression":
      return applyOperator(
        ast.operator,
        codeGenerator(ast.left, env),
        codeGenerator(ast.right, env)
      );
    case "unary-expression": {
      const result = codeGenerator(ast.operand, env);
      if (ast.operator === "-") {
        throwError(typeof result === "number", "#VALUE!");
        return -result;
      } else {
        return result;
      }
    }
    default:
      throw new Error("codeGenerator not found type" + ast.type);
  }
}
function compiler(code: string, env: Environment) {
  const tokens = tokenizer(code);
  const ast = parser(tokens);
  const result = codeGenerator(ast, env);
  return result;
}

export function parseFormula(code: string): {
  result: ResultType;
  error: ErrorTypes | null;
} {
  let result: ResultType = null;
  let error: ErrorTypes | null = null;
  try {
    if (code === "") {
      result = "";
    } else {
      const env = new Environment();
      const list = Object.keys(formulas) as Array<FormulasKeys>;
      for (const key of list) {
        env.setFunc(key, formulas[key]);
      }
      result = compiler(code, env);
    }
  } catch (e: any) {
    const message = parseError(e.message);
    if (message) {
      error = message;
    } else {
      console.log(e);
      error = "#ERROR!";
    }
  }
  return {
    result,
    error,
  };
}
