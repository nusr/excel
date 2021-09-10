import { SUM } from "./math";

const formulas = {
  SUM,
};
export type FormulaType = typeof formulas;
export type FormulasKeys = keyof FormulaType;
export default formulas;
