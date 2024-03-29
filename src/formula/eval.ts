import { Scanner } from './scanner';
import { Parser } from './parser';
import allFormulas, { CustomError } from './formula';
import { Interpreter } from './interpreter';
import {
  CellDataMap,
  InterpreterResult,
  DefinedNamesMap,
  IRange,
  FormulaType,
  ResultType,
} from '@/types';

export function parseFormula(
  source: string,
  cellData: CellDataMap = new CellDataMapImpl(),
  definedNamesMap: DefinedNamesMap = new DefinedNamesMapImpl(),
  functionMap: FormulaType = allFormulas,
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
      result,
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
  private readonly map = new Map<string, ResultType>();
  private sheetNameMap: Record<string, string> = {};
  private getKey(row: number, col: number, sheetId = '1') {
    const key = `${row}_${col}_${sheetId}`;
    return key;
  }
  setSheetNameMap(sheetNameMap: Record<string, string>) {
    this.sheetNameMap = sheetNameMap;
  }
  set(range: IRange, value: ResultType[][]): void {
    const { row, col, sheetId } = range;
    for (let i = 0; i < value.length; i++) {
      for (let j = 0; j < value[i].length; j++) {
        const key = this.getKey(row + i, col + j, sheetId);
        this.map.set(key, value[i][j]);
      }
    }
  }
  get(range: IRange): ResultType[] {
    const list: ResultType[] = [];
    const { row, col, rowCount, colCount, sheetId } = range;
    for (let r = row, endRow = row + rowCount; r < endRow; r++) {
      for (let c = col, endCol = col + colCount; c < endCol; c++) {
        const key = this.getKey(r, c, sheetId);
        list.push(this.map.get(key));
      }
    }

    return list;
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
  get(name: string): IRange | undefined {
    return this.map.get(name)!;
  }
  has(name: string): boolean {
    return this.map.has(name);
  }
}
