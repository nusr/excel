import textFormulas from './text';
import mathFormulas from './math';
import type { FormulaType } from '@/types';

const allFormulas: FormulaType = {
  ...textFormulas,
  ...mathFormulas,
};
export * from './error';
export default allFormulas;
export * from './float';
