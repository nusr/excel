import { parseNumber } from "@/util";

export const SUM = (...rest: string[]): number => {
  if (rest.length === 0) {
    throw new Error("error params");
  }
  if (rest.length === 1) {
    const temp = parseNumber(rest[0]);
    if (isNaN(temp)) {
      throw new Error("error params");
    }
    return temp;
  }
  let result = 0;
  for (const item of rest) {
    const temp = parseNumber(item);
    if (!isNaN(temp)) {
      result += temp;
    }
  }
  return result;
};
