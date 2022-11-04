import textFormulas from "./text";
import mathFormulas from "./math";
import type { FormulaType } from "@/types";

export type FormulasKeys = "SUM" | "ABS" | "T" | "LOWER";

const formulas: FormulaType = {
  ...textFormulas,
  ...mathFormulas,
};
export default formulas;

export function handleFormula(): void {
  if (process.env.NODE_ENV !== "development") {
    return;
  }
  const temp = JSON.stringify(formulas);
  fetch(`/formula?data=${encodeURIComponent(temp)}`);
}
// handleFormula();
