import { Scanner } from './scanner';
import { Parser } from './parser';
import { Interpreter, FunctionMapImpl, CellDataMapImpl } from './interpreter';
import { FunctionMap, CellDataMap } from '@/types';

export { parseFormula, globalEnv } from './parse';

export function interpret(
  source: string,
  func: FunctionMap = new FunctionMapImpl(),
  cellData: CellDataMap = new CellDataMapImpl(),
): any[] {
  const list = new Scanner(source).scan();
  const expressions = new Parser(list).parse();
  // const func = new FunctionMapImpl();
  // const cellData = new CellDataMapImpl();
  func.set('sum', function (...list: any[]) {
    return list.reduce((a, b) => a + b, 0);
  });
  // func.set('now', function () {
  // return new Date().toDateString();
  // });
  // cellData.set(0, 0, '', 1);
  // cellData.set(1, 0, '', 2.0);
  return new Interpreter(expressions, func, cellData).interpret();
}

export { FunctionMapImpl, CellDataMapImpl };
