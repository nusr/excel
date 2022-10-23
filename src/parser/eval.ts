import { Scanner } from './scanner';
import { Parser } from './parser';
import formulas from '../formula';
import { Interpreter } from './interpreter';
import {
  FunctionMap,
  CellDataMap,
  InterpreterResult,
  FormulaKeys,
  VariableMap,
} from '@/types';
import { CustomError } from './error';
import { isNumber, isString } from '@/util';

export function parseFormula(
  source: string,
  cellData: CellDataMap = new CellDataMapImpl(),
  variableMap: VariableMap = new VariableMapImpl(),
): InterpreterResult {
  const func = new FunctionMapImpl();
  const list = Object.keys(formulas) as Array<FormulaKeys>;
  for (const key of list) {
    func.set(key, (...args: any[]) => {
      const item = formulas[key];
      if (item === null) {
        throw new CustomError('#NAME?');
      }
      const { func, options } = item;
      const { paramsType, minParamsCount, maxParamsCount, resultType } =
        options;
      if (paramsType === 'number') {
        if (!args.every(isNumber)) {
          throw new CustomError('#VALUE!');
        }
      } else if (paramsType === 'string') {
        if (!args.every(isString)) {
          throw new CustomError('#VALUE!');
        }
      }
      if (args.length > maxParamsCount || args.length < minParamsCount) {
        throw new CustomError('#VALUE!');
      }
      const result = func(...args);
      if (resultType === 'number') {
        if (!isNumber(result)) {
          throw new CustomError('#NUM!');
        }
      } else if (resultType === 'string') {
        if (!isString(result)) {
          throw new CustomError('#NUM!');
        }
      }
      return result;
    });
  }
  return interpret(source, func, cellData, variableMap);
}

function interpret(
  source: string,
  func: FunctionMap,
  cellData: CellDataMap,
  variableMap: VariableMap,
): InterpreterResult {
  try {
    const list = new Scanner(source).scan();
    const expressions = new Parser(list).parse();
    const result = new Interpreter(
      expressions,
      func,
      cellData,
      variableMap,
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

export class FunctionMapImpl implements FunctionMap {
  private readonly map = new Map<string, any>();
  set(name: string, value: (...list: any[]) => any) {
    this.map.set(name.toLowerCase(), value);
  }
  get(name: string) {
    return this.map.get(name.toLowerCase());
  }
}

export class CellDataMapImpl implements CellDataMap {
  private readonly map = new Map<string, any>();
  private getKey(row: number, col: number, sheetId: string = '') {
    const key = `${row}_${col}_${sheetId}`;
    return key;
  }
  set(row: number, col: number, sheetId: string, value: any): void {
    const key = this.getKey(row, col, sheetId);
    this.map.set(key, value);
  }
  get(row: number, col: number, sheetId: string = ''): any {
    const key = this.getKey(row, col, sheetId);
    return this.map.get(key);
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
