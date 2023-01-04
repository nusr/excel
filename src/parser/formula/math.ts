import { parseNumberArray, MAX_PARAMS_COUNT } from "@/util";
import type { ResultType, MathFormulaType } from "../../types";
export const ABS = (data: number): number => {
  return Math.abs(data);
};
export const ACOS = (data: number): number => {
  return Math.acos(data);
};

export const ACOSH = (data: number): number => {
  return Math.log(data + Math.sqrt(data * data - 1));
};

export const ACOT = (data: number): number => {
  return Math.atan(1 / data);
};

export const ACOTH = (data: number): number => {
  return 0.5 * Math.log((data + 1) / (data - 1));
};
export const ASIN = (data: number): number => {
  return Math.asin(data);
};

export const ASINH = (data: number): number => {
  return Math.log(data + Math.sqrt(data * data + 1));
};
export const ATAN = (data: number): number => Math.atan(data);
export const ATANH = (data: number): number =>
  Math.log((1 + data) / (data + 1)) / 2;
export const COS = (data: number): number => Math.cos(data);
export const COT = (data: number): number => 1 / Math.tan(data);
export const CSC = (data: number): number => 1 / Math.sin(data);
export const DECIMAL = (data: string, radix: number): number =>
  parseInt(data, radix);
export const DEGREES = (data: number): number => (data * 180) / Math.PI;
export const EXP = (data: number): number => Math.exp(data);
export const INT = (data: number): number => Math.floor(data);
export const LN10 = (): number => Math.log(10);
export const LN2 = (): number => Math.log(2);
export const LOG10E = (): number => Math.LOG10E;
export const LOG2E = (): number => Math.LOG2E;
export const LOG = (data: number, base = 10): number =>
  Math.log(data) / Math.log(base);
export const LOG10 = (data: number): number => Math.log(data) / Math.log(10);
export const PI = (): number => Math.PI;
export const E = (): number => Math.E;
export const SIN = (data: number): number => Math.sin(data);
export const SUM = (...rest: Array<ResultType>): number => {
  const list = parseNumberArray(rest);
  return list.reduce((sum, cur) => sum + cur, 0);
};

const formulas: MathFormulaType = {
  ABS: {
    func: ABS,
    options: {
      paramsType: "number",
      minParamsCount: 1,
      maxParamsCount: 1,
      resultType: "number",
    },
  },
  ACOS: {
    func: ACOS,
    options: {
      paramsType: "number",
      minParamsCount: 1,
      maxParamsCount: 1,
      resultType: "number",
    },
  },
  ACOSH: {
    func: ACOSH,
    options: {
      paramsType: "number",
      minParamsCount: 1,
      maxParamsCount: 1,
      resultType: "number",
    },
  },
  ACOT: {
    func: ACOT,
    options: {
      paramsType: "number",
      minParamsCount: 1,
      maxParamsCount: 1,
      resultType: "number",
    },
  },

  ACOTH: {
    func: ACOTH,
    options: {
      paramsType: "number",
      minParamsCount: 1,
      maxParamsCount: 1,
      resultType: "number",
    },
  },

  ASIN: {
    func: ASIN,
    options: {
      paramsType: "number",
      minParamsCount: 1,
      maxParamsCount: 1,
      resultType: "number",
    },
  },

  ASINH: {
    func: ASINH,
    options: {
      paramsType: "number",
      minParamsCount: 1,
      maxParamsCount: 1,
      resultType: "number",
    },
  },
  ATAN: {
    func: ATAN,
    options: {
      paramsType: "number",
      minParamsCount: 1,
      maxParamsCount: 1,
      resultType: "number",
    },
  },
  ATANH: {
    func: ATANH,
    options: {
      paramsType: "number",
      minParamsCount: 1,
      maxParamsCount: 1,
      resultType: "number",
    },
  },
  COT: {
    func: COT,
    options: {
      paramsType: "number",
      minParamsCount: 1,
      maxParamsCount: 1,
      resultType: "number",
    },
  },
  COS: {
    func: COS,
    options: {
      paramsType: "number",
      minParamsCount: 1,
      maxParamsCount: 1,
      resultType: "number",
    },
  },
  EXP: {
    func: EXP,
    options: {
      paramsType: "number",
      minParamsCount: 1,
      maxParamsCount: 1,
      resultType: "number",
    },
  },
  INT: {
    func: INT,
    options: {
      paramsType: "number",
      minParamsCount: 1,
      maxParamsCount: 1,
      resultType: "number",
    },
  },
  PI: {
    func: PI,
    options: {
      paramsType: "any",
      minParamsCount: 0,
      maxParamsCount: 0,
      resultType: "number",
    },
  },
  E: {
    func: INT,
    options: {
      paramsType: "any",
      minParamsCount: 0,
      maxParamsCount: 0,
      resultType: "number",
    },
  },
  SIN: {
    func: SIN,
    options: {
      paramsType: "number",
      minParamsCount: 1,
      maxParamsCount: 1,
      resultType: "number",
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
};

export default formulas;
