import type { ResultType } from "../types";
import { throwError } from "@/util";

export const T = (value: ResultType): string => {
  return typeof value === "string" ? value : "";
};

export const LOWER = (value: ResultType): string => {
  if (typeof value === "string") {
    return value.toLowerCase();
  }
  throwError(false, "#VALUE!");
};
