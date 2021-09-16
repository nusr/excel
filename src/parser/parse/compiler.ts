import type { IParseFormulaOptions } from "../type";
import formulas, { FormulasKeys } from "../../formula";
import { parseError } from "../../util";
import { codeGenerator, Environment, generateAST } from "./codeGenerator";
import type { ResultType, ErrorTypes } from "@/types";

export function compiler(code: string, env: Environment): ResultType {
  const ast = generateAST(code);
  const result = codeGenerator(ast, env);
  if (Array.isArray(result)) {
    return result[0];
  }
  return result;
}

const globalEnv = new Environment();
const list = Object.keys(formulas) as Array<FormulasKeys>;
for (const key of list) {
  globalEnv.setFunc(key, formulas[key]);
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
      globalEnv.setHooks(options);
      result = compiler(code, globalEnv);
    }
  } catch (e) {
    const message = parseError((e as Error).message);
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

export { globalEnv };
