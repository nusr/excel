import type { TextFormulaType } from "@/types";

export const T = (value: unknown): string => {
  return typeof value === "string" ? value : "";
};

export const LOWER = (value: string): string => value.toLowerCase();
export const CHAR = (value: number): string => String.fromCharCode(value);
export const CODE = (value: string): number => value.charCodeAt(0);
export const LEN = (value: string): number => value.length;

export const SPLIT = (value: string, sep: string): string[] => value.split(sep);
export const UNICHAR = CHAR;
export const UNICODE = CODE;
export const UPPER = (value: string): string => value.toUpperCase();
export const TRIM = (value: string): string => value.replace(/ +/g, " ").trim();

const textFormulas: TextFormulaType = {
  ASC: null,
  BAHTTEXT: null,
  CONCATENATE: null,
  CLEAN: null,
  DBCS: null,
  DOLLAR: null,
  EXACT: null,
  FIND: null,
  FIXED: null,
  HTML2TEXT: null,
  LEFT: null,
  MID: null,
  NUMBERVALUE: null,
  PRONETIC: null,
  PROPER: null,
  REGEXEXTRACT: null,
  REGEXMATCH: null,
  REGREPLACE: null,
  REPLACE: null,
  REPT: null,
  RIGHT: null,
  SEARCH: null,
  SPLIT: null,
  SUBSTITUTE: null,
  TEXT: null,
  VALUE: null,
  CHAR: {
    func: CHAR,
    options: {
      paramsType: "string",
      minParamsCount: 1,
      maxParamsCount: 1,
      resultType: "string",
    },
  },
  CODE: {
    func: CODE,
    options: {
      paramsType: "string",
      minParamsCount: 1,
      maxParamsCount: 1,
      resultType: "number",
    },
  },
  UNICHAR: {
    func: UNICHAR,
    options: {
      paramsType: "string",
      minParamsCount: 1,
      maxParamsCount: 1,
      resultType: "string",
    },
  },
  UNICODE: {
    func: UNICODE,
    options: {
      paramsType: "string",
      minParamsCount: 1,
      maxParamsCount: 1,
      resultType: "number",
    },
  },
  LEN: {
    func: LEN,
    options: {
      paramsType: "string",
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
  UPPER: {
    func: UPPER,
    options: {
      paramsType: "string",
      minParamsCount: 1,
      maxParamsCount: 1,
      resultType: "string",
    },
  },
  TRIM: {
    func: TRIM,
    options: {
      paramsType: "string",
      minParamsCount: 1,
      maxParamsCount: 1,
      resultType: "string",
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

export default textFormulas;
