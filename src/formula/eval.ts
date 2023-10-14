import { Scanner } from './scanner';
import { Parser } from './parser';
import formulas, { CustomError } from './formula';
import { Interpreter } from './interpreter';
import {
  CellDataMap,
  InterpreterResult,
  DefinedNamesMap,
  FormulaData,
  IRange,
} from '@/types';

export function parseFormula(
  source: string,
  cellData: CellDataMap = new CellDataMapImpl(),
  definedNamesMap: DefinedNamesMap = new DefinedNamesMapImpl(),
  functionMap: FormulaData = formulas,
): InterpreterResult {
  let expressionStr = '';
  try {
    const list = new Scanner(source).scan();
    const expressions = new Parser(list).parse();
    const result = new Interpreter(
      expressions,
      cellData,
      definedNamesMap,
      functionMap,
    ).interpret();

    const strList: string[] = [];
    for (const item of expressions) {
      strList.push(item.toString());
    }
    expressionStr = strList.join('');

    return {
      result: result,
      error: null,
      expressionStr,
    };
  } catch (error) {
    if (error instanceof CustomError) {
      return {
        result: null,
        error: error.value,
        expressionStr,
      };
    }
  }
  return {
    result: null,
    error: '#ERROR!',
    expressionStr,
  };
}

export class CellDataMapImpl implements CellDataMap {
  private readonly map = new Map<string, any>();
  private sheetNameMap: Record<string, string> = {};
  private getKey(row: number, col: number, sheetId: string = '') {
    const key = `${row}_${col}_${sheetId}`;
    return key;
  }
  setSheetNameMap(sheetNameMap: Record<string, string>) {
    this.sheetNameMap = sheetNameMap;
  }
  set(row: number, col: number, sheetId: string, value: any): void {
    const key = this.getKey(row, col, sheetId);
    this.map.set(key, value);
  }
  get(row: number, col: number, sheetId: string = ''): any {
    const key = this.getKey(row, col, sheetId);
    return this.map.get(key);
  }
  convertSheetNameToSheetId(sheetName: string): string {
    if (!sheetName) {
      return '';
    }
    return this.sheetNameMap[sheetName] || '';
  }
}

export class DefinedNamesMapImpl implements DefinedNamesMap {
  private readonly map = new Map<string, IRange>();
  set(name: string, value: IRange): void {
    this.map.set(name, value);
  }
  get(name: string): IRange {
    return this.map.get(name)!;
  }
  has(name: string): boolean {
    return this.map.has(name);
  }
}
