import textFormulas from './text';
import mathFormulas from './math';
import { BuiltInFormulas } from '@/util/constant';

type MergeType<T, A> = {
  [K in keyof T | keyof A as K extends BuiltInFormulas
    ? K
    : never]: K extends keyof T ? T[K] : K extends keyof A ? A[K] : never;
};

export type FormulaMap = MergeType<typeof textFormulas, typeof mathFormulas>;

export type FormulaKeys = keyof FormulaMap;

const allFormulas: FormulaMap = {
  ...textFormulas,
  ...mathFormulas,
};
export * from './error';
export default allFormulas;
export * from './float';
