import { SENTINEL, Operator } from "./Operator";
import { Stack } from "./Stack";
export type CreateStackResult = {
  operands: Stack;
  operators: Stack;
};
export function createStack(): CreateStackResult {
  const operands = new Stack();
  const operators = new Stack();
  operators.push(SENTINEL);
  return {
    operands,
    operators,
  };
}

export { SENTINEL, Operator };
