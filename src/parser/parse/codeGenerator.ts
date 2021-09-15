import type {
  Node,
  FunctionNode,
  CellNode,
  IParseFormulaOptions,
} from "../type";
import { parser } from "../ast";
import { tokenizer } from "../tokenize";
import type { FormulasKeys, FormulaType } from "@/formula";
import { throwError, isNumber, isString, parseCell } from "@/util";
import type { ResultType, QueryCellResult } from "@/types";

export class Environment {
  hooks?: IParseFormulaOptions;
  funcs = {} as FormulaType;
  constructor(hooks?: IParseFormulaOptions) {
    this.hooks = hooks;
  }
  queryCell(
    row: number,
    col: number,
    sheetId?: string
  ): QueryCellResult | undefined {
    if (this.hooks) {
      return this.hooks.queryCell(row, col, sheetId);
    }
  }

  setFunc<T extends FormulasKeys>(name: T, value: FormulaType[T]): void {
    this.funcs[name] = value;
  }
  getFunc<T extends FormulasKeys>(name: T): FormulaType[T] | undefined {
    if (name in this.funcs) {
      return this.funcs[name];
    }
  }
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

function handleCallExpression(ast: FunctionNode, env: Environment) {
  const args = ast.arguments.map((node) => codeGenerator(node, env));
  const funcName = ast.name.toUpperCase() as FormulasKeys;
  const func = env.getFunc(funcName);
  if (!func) {
    throwError(false, "#NAME?");
  }
  const { paramsType, minParamsCount, maxParamsCount, resultType } =
    func.options;
  if (paramsType === "number") {
    throwError(args.every(isNumber), "#VALUE!");
  } else if (paramsType === "string") {
    throwError(args.every(isString), "#VALUE!");
  }
  throwError(
    args.length <= maxParamsCount && args.length >= minParamsCount,
    "#VALUE!"
  );
  const result = func.func(...args);
  if (resultType === "number") {
    throwError(isNumber(result), "#NUM!");
  } else if (resultType === "string") {
    throwError(isString(result), "#NUM!");
  }
  return result;
}
export function generateAST(code: string): Node {
  const tokens = tokenizer(code);
  return parser(tokens);
}

export function handelCell(cell: CellNode, env: Environment): ResultType {
  const { key } = cell;
  const range = parseCell(key);
  if (!range) {
    throwError(false, "#REF!");
  }
  const data = env.queryCell(
    range.row,
    range.col,
    range.sheetId ? range.sheetId : undefined
  );
  if (data?.formula) {
    const newAst = generateAST(data?.formula);
    return codeGenerator(newAst, env);
  }
  return data?.value || "";
}

export function codeGenerator(ast: Node, env: Environment): ResultType {
  switch (ast.type) {
    case "StringLiteral":
    case "NumberLiteral":
    case "BooleanLiteral":
      return ast.value;
    case "Cell":
      return handelCell(ast, env);
    case "CallExpression":
      return handleCallExpression(ast, env);
    case "BinaryExpression":
      return applyOperator(
        ast.operator,
        codeGenerator(ast.left, env),
        codeGenerator(ast.right, env)
      );
    case "UnaryExpression": {
      const result = codeGenerator(ast.operand, env);
      if (ast.operator === "-") {
        throwError(typeof result === "number", "#VALUE!");
        return -result;
      } else {
        return result;
      }
    }
    default:
      throw new Error("codeGenerator: not found type" + ast.type);
  }
}
