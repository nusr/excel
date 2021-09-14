import type { Node, FunctionNode } from "../type";
import type { FormulasKeys, FormulaType } from "../../formula";
import { throwError, isNumber, isString } from "../../util";
import type { ResultType } from "../../types";

export class Environment {
  funcs = {} as FormulaType;
  setFunc<T extends FormulasKeys>(name: T, value: FormulaType[T]): void {
    this.funcs[name] = value;
  }
  getFunc<T extends FormulasKeys>(name: T): FormulaType[T] {
    if (name in this.funcs) {
      return this.funcs[name];
    }
    throw new Error("Environment: Undefined function " + name);
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
    throw new Error("codeGenerator: not support function");
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

export function codeGenerator(ast: Node, env: Environment): ResultType {
  switch (ast.type) {
    case "StringLiteral":
    case "NumberLiteral":
    case "BooleanLiteral":
      return ast.value;
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
