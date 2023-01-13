import { Scanner } from './scanner';
import { Parser } from './parser';
import formulas, { CustomError } from './formula';
import { Interpreter } from './interpreter';
import {
  CellDataMap,
  InterpreterResult,
  VariableMap,
  FormulaData,
} from '@/types';

export function parseFormula(
  source: string,
  cellData: CellDataMap = new CellDataMapImpl(),
  variableMap: VariableMap = new VariableMapImpl(),
  functionMap: FormulaData = formulas,
): InterpreterResult {
  try {
    const list = new Scanner(source).scan();
    const expressions = new Parser(list).parse();
    const result = new Interpreter(
      expressions,
      cellData,
      variableMap,
      functionMap,
    ).interpret();
    return {
      result: result,
      error: null,
    };
  } catch (error) {
    if (error instanceof CustomError) {
      return {
        result: null,
        error: error.value,
      };
    }
  }
  return {
    result: null,
    error: '#ERROR!',
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

export class VariableMapImpl implements VariableMap {
  private readonly map = new Map<string, any>();
  set(name: string, value: any): void {
    this.map.set(name, value);
  }
  get(name: string): any {
    return this.map.get(name);
  }
  has(name: string): boolean {
    return this.map.has(name);
  }
}
