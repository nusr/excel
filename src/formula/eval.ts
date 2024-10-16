import { Scanner } from './scanner';
import { Parser } from './parser';
import allFormulas, { CustomError, roundNumber } from './formula';
import { Interpreter } from './interpreter';
import {
  CellDataMap,
  InterpreterResult,
  IRange,
  ResultType,
  Coordinate,
  WorksheetType,
  ModelCellType,
  FormulaKeys,
  RequestFormulas,
  ResponseFormulas,
} from '@/types';
import { isFormula, coordinateToString, stringToCoordinate } from '@/util/util';

export function parseFormula(
  formula: string,
  currentCoord: Coordinate = { row: 0, col: 0 },
  cellData: CellDataMap = new CellDataMapImpl(),
  cache: Map<string, InterpreterResult> = new Map<string, InterpreterResult>(),
): InterpreterResult {
  if (cache.has(formula)) {
    return cache.get(formula)!;
  }
  try {
    cellData.handleCell = (
      value: ModelCellType | undefined,
      coord: Coordinate,
    ): ResultType[] => {
      if (value) {
        if (value.formula) {
          const t = parseFormula(value.formula, coord, cellData, cache);
          return t.result;
        } else {
          return [value.value];
        }
      }
      return [];
    };
    const result: InterpreterResult = {
      result: [],
      expressionStr: '',
    };
    cache.set(formula, result);
    const list = new Scanner(formula).scan();
    const expressions = new Parser(list).parse();
    const resultList = new Interpreter(
      expressions,
      currentCoord,
      cellData,
    ).interpret();

    const strList: string[] = [];
    for (const item of expressions) {
      strList.push(item.toString());
    }
    result.expressionStr = strList.join('');
    for (const item of resultList) {
      if (typeof item === 'number' && !isNaN(item)) {
        result.result.push(roundNumber(item));
      } else {
        result.result.push(item);
      }
    }
    return result;
  } catch (error) {
    if (error instanceof CustomError) {
      const result: InterpreterResult = {
        result: [error.value],
      };
      cache.set(formula, result);
      return result;
    }
    throw error;
  }
}

const defaultSheetId = '_test_';
export class CellDataMapImpl implements CellDataMap {
  private readonly map = new Map<string, ModelCellType>();
  private readonly definedNameMap = new Map<string, IRange>();
  private readonly currentSheetId = defaultSheetId;
  private sheetList: WorksheetType[] = [
    {
      sheetId: defaultSheetId,
      name: '_test_',
      rowCount: 200,
      colCount: 30,
      isHide: false,
      sort: 1,
    },
  ];
  private getKey(row: number, col: number, sheetId: string) {
    const key = `${row}_${col}_${sheetId || defaultSheetId}`;
    return key;
  }
  getFunction = (name: string) => {
    return allFormulas[name as FormulaKeys];
  };
  setSheetList(list: WorksheetType[]) {
    this.sheetList = list;
  }
  set(range: IRange, value: ResultType[][]): void {
    const { row, col, sheetId } = range;
    for (let i = 0; i < value.length; i++) {
      for (let j = 0; j < value[i].length; j++) {
        const key = this.getKey(row + i, col + j, sheetId);
        const t = value[i][j];
        if (typeof t === 'string' && isFormula(t)) {
          this.map.set(key, { formula: t, value: '' });
        } else {
          this.map.set(key, { value: t });
        }
      }
    }
  }
  getCell(range: IRange) {
    const { row, col, sheetId } = range;
    const key = this.getKey(row, col, sheetId);
    const item = this.map.get(key);
    return item;
  }
  getSheetInfo(sheetId?: string, sheetName?: string) {
    if (sheetName) {
      return this.sheetList.find((v) => v.name === sheetName);
    }
    const realSheetId = sheetId || this.currentSheetId;
    return this.sheetList.find((v) => v.sheetId === realSheetId);
  }
  handleCell = (value: ModelCellType | undefined, _coord: Coordinate) => {
    if (value) {
      return [value.value];
    }
    return [];
  };
  setDefinedName(name: string, value: IRange) {
    this.definedNameMap.set(name, value);
  }
  getDefinedName(name: string) {
    return this.definedNameMap.get(name);
  }
}


export function computeFormulas(eventData: RequestFormulas, cb: (data: ResponseFormulas) => void) {
  const { currentSheetId, worksheets, workbook, definedNames } = eventData;
  const formulaCache = new Map<string, InterpreterResult>();
  const sheetData = worksheets[currentSheetId] || {};
  const result: ResponseFormulas = {
    list: [],
  }
  const cellDataMap: CellDataMap = {
    handleCell: () => {
      return [];
    },
    getFunction: (name: string) => {
      return allFormulas[name as FormulaKeys];
    },
    getCell: (range: IRange) => {
      const { row, col, sheetId } = range;
      const realSheetId = sheetId || currentSheetId;
      const sheetData = worksheets[realSheetId] || {};
      const key = coordinateToString(row, col);
      return sheetData[key];
    },
    set: () => {
      throw new CustomError('#REF!');
    },
    getSheetInfo: (sheetId?: string, sheetName?: string) => {
      if (sheetName) {
        return workbook.find((v) => v.name === sheetName);
      }
      const realSheetId = sheetId || currentSheetId;
      return workbook.find((v) => v.sheetId === realSheetId);
    },
    setDefinedName: () => {
      throw new CustomError('#REF!');
    },
    getDefinedName: (name: string) => {
      return definedNames[name];
    },
  };
  for (const [k, data] of Object.entries(sheetData)) {
    if (!data?.formula) {
      continue;
    }
    const temp = parseFormula(
      data?.formula,
      stringToCoordinate(k),
      cellDataMap,
      formulaCache,
    );
    if (!temp) {
      continue;
    }
    const r = temp.result[0];
    if (r !== data.value) {
      result.list.push({
        key: k,
        newValue: r,
        sheetId: currentSheetId,
      });
    }
  }
  cb(result);
}

