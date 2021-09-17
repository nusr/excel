import type {
  Node,
  FunctionNode,
  CellNode,
  IParseFormulaOptions,
  CellRangeNode,
} from "../type";
import { parser } from "../ast";
import { tokenizer } from "../tokenize";
import type { FormulasKeys, FormulaType } from "@/formula";
import {
  throwError,
  isNumber,
  isString,
  parseCell,
  parseReference,
  Range,
} from "@/util";
import type { ResultType, QueryCellResult } from "@/types";

export class Environment {
  protected hooks?: IParseFormulaOptions;
  protected funcs = {} as FormulaType;
  protected variables: Record<string, ResultType> = {};
  setVariable(key: string, value: ResultType): void {
    this.variables[key] = value;
  }
  getVariable(key: string): ResultType {
    return this.variables[key];
  }
  setHooks(hooks?: IParseFormulaOptions): void {
    this.hooks = hooks;
  }
  queryCells(range: Range): QueryCellResult[] | undefined {
    if (this.hooks) {
      return this.hooks.queryCells(range);
    }
  }
  getSheetId(): string {
    if (this.hooks) {
      return this.hooks.currentSheetId;
    }
    return "";
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

function applyOperator(op: string, a: ResultType, b: ResultType): ResultType {
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

function handleCallExpression(ast: FunctionNode, env: Environment): ResultType {
  const args = ast.arguments
    .map((node) => codeGenerator(node, env))
    .reduce((sum, cur) => {
      return sum.concat(cur);
    }, []);
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

function handelCell(cell: CellNode, env: Environment): ResultType {
  const { key } = cell;
  const range = parseCell(key);
  if (!range) {
    throwError(false, "#REF!");
  }
  const data = env.queryCells(range);
  if (data === undefined) {
    return "";
  }
  const [result] = data;
  if (result?.formula) {
    const newAst = generateAST(result?.formula);
    const [temp] = codeGenerator(newAst, env);
    return temp;
  }
  return result?.value;
}

function handelCellRange(ast: CellRangeNode, env: Environment): ResultType[] {
  const { left, right } = ast;
  const range = parseReference(`${left.key}:${right.key}`, env.getSheetId());
  if (!range) {
    throwError(false, "#REF!");
  }
  const data = env.queryCells(range);
  if (data === undefined) {
    return [];
  }
  return data.map((item) => {
    if (item?.formula) {
      const newAst = generateAST(item?.formula);
      const [temp] = codeGenerator(newAst, env);
      return temp;
    }
    return item?.value;
  });
}

export function codeGenerator(ast: Node, env: Environment): ResultType[] {
  switch (ast.type) {
    case "StringLiteral":
    case "NumberLiteral":
    case "BooleanLiteral":
      return [ast.value];
    case "DefineName": {
      const temp = env.getVariable(ast.value);
      throwError(temp !== undefined, "#NAME?");
      return [temp];
    }

    case "Cell": {
      const result = handelCell(ast, env);
      return [result || 0];
    }
    case "CellRange":
      return handelCellRange(ast, env);
    case "CallExpression": {
      const result = handleCallExpression(ast, env);
      return [result];
    }
    case "BinaryExpression": {
      const [left] = codeGenerator(ast.left, env);
      const [right] = codeGenerator(ast.right, env);
      const result = applyOperator(ast.operator, left, right);
      return [result];
    }
    case "UnaryExpression": {
      const [result] = codeGenerator(ast.operand, env);
      if (ast.operator === "-") {
        throwError(typeof result === "number", "#VALUE!");
        return [-result];
      } else {
        return [result];
      }
    }
    default:
      throw new Error("codeGenerator: not found ast: " + JSON.stringify(ast));
  }
}
