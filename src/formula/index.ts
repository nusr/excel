import { SUM, ABS } from "./math";
import type { ResultType } from "../types";
export type FormulasKeys = "SUM" | "ABS";
type FormulaContent = {
  func: (...data: ResultType[]) => number | string | boolean;
  options: {
    paramsType: "number" | "string" | "any";
    minParamsCount: number;
    maxParamsCount: number;
    resultType: "number" | "string";
  };
};

export type FormulaType = Record<FormulasKeys, FormulaContent>;
const formulas: FormulaType = {
  SUM: {
    func: SUM,
    options: {
      paramsType: "any",
      minParamsCount: 1,
      maxParamsCount: window.Infinity,
      resultType: "number",
    },
  },
  ABS: {
    func: ABS,
    options: {
      paramsType: "number",
      minParamsCount: 1,
      maxParamsCount: 1,
      resultType: "number",
    },
  },
};

export default formulas;
