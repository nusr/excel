import type { ResultType } from "../types";
import { SUM, ABS } from "./math";
import { T, LOWER } from "./text";

export type FormulasKeys = "SUM" | "ABS" | "T" | "LOWER";
type FormulaContent = {
  func: (...data: ResultType[]) => number | string | boolean;
  options: {
    paramsType: "number" | "string" | "any";
    minParamsCount: number;
    maxParamsCount: number;
    resultType: "number" | "string";
  };
};

const MAX_PARAMS_COUNT = 256;

export type FormulaType = Record<FormulasKeys, FormulaContent>;
const formulas: FormulaType = {
  ABS: {
    func: ABS,
    options: {
      paramsType: "number",
      minParamsCount: 1,
      maxParamsCount: 1,
      resultType: "number",
    },
  },
  LOWER: {
    func: LOWER,
    options: {
      paramsType: "string",
      minParamsCount: 1,
      maxParamsCount: 1,
      resultType: "string",
    },
  },
  SUM: {
    func: SUM,
    options: {
      paramsType: "any",
      minParamsCount: 1,
      maxParamsCount: MAX_PARAMS_COUNT,
      resultType: "number",
    },
  },
  T: {
    func: T,
    options: {
      paramsType: "any",
      minParamsCount: 1,
      maxParamsCount: 1,
      resultType: "string",
    },
  },
};

export default formulas;

export function handleFormula(): void {
  if (process.env.NODE_ENV !== "development") {
    return;
  }
  const temp = JSON.stringify(formulas);
  console.log(temp);
  fetch(`/formula?data=${encodeURIComponent(temp)}`).then((data) => {
    console.log(data);
  });
}
handleFormula()