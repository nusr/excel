import { Parser } from '../../parser';
import { Scanner } from '../../scanner';
import type { Expression } from '../../expression';
import formulas from '../../formula';
import { getFunctionName } from '@/util';

export function buildTree(source: string): Expression {
  return buildTreeList(source)[0];
}

export function buildTreeList(source: string): Expression[] {
  const tokens = new Scanner(source).scan();
  const isFunc = (value: string): boolean => {
    const name = getFunctionName(value);
    return Boolean((formulas as any)[name]);
  };
  const list = new Parser(tokens, isFunc).parse();
  return list;
}
