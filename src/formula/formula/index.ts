import textFormulas from './text';
import mathFormulas from './math';
import type { FormulaType } from '@/types';

const formulas: FormulaType = {
  ...textFormulas,
  ...mathFormulas,
};
export * from './error';
export default formulas;
