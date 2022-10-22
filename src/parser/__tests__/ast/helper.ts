import { Parser } from '../../parser';
import { Scanner } from '../../scanner';
import type { Expression } from '../../expression';

export function buildTree(source: string): Expression {
  const tokens = new Scanner(source).scan();
  const list = new Parser(tokens).parse();
  return list[0];
}
