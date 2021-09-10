import { parser } from "../ast";
import { tokenizer } from "../tokenize";
import type { CellNode, CellRangeNode } from "../type";
import formulas, { FormulasKeys } from "../../formula";
import { parseError } from "../../util";
import { codeGenerator, Environment } from "./codeGenerator";
import type { ResultType, ErrorTypes } from "../../types";

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

export function compiler(code: string, env: Environment): ResultType {
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
