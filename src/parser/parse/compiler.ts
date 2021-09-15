import type { CellRangeNode, IParseFormulaOptions } from "../type";
import formulas, { FormulasKeys } from "../../formula";
import { parseError } from "../../util";
import { codeGenerator, Environment, generateAST } from "./codeGenerator";
import type { ResultType, ErrorTypes } from "@/types";

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

export function compiler(code: string, env: Environment): ResultType {
  const ast = generateAST(code);
  const result = codeGenerator(ast, env);
  return result;
}

export function parseFormula(
  code: string,
  options?: IParseFormulaOptions
): {
  result: ResultType;
  error: ErrorTypes | null;
} {
  let result: ResultType = null;
  let error: ErrorTypes | null = null;
  try {
    if (code === "") {
      result = "";
    } else {
      const env = new Environment(options);
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
