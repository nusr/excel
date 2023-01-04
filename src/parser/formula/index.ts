import textFormulas from "./text";
import mathFormulas from "./math";
import type { FormulaType } from "@/types";

export type FormulasKeys = "SUM" | "ABS" | "T" | "LOWER";

const formulas: FormulaType = {
  ...textFormulas,
  ...mathFormulas,
};
export default formulas;