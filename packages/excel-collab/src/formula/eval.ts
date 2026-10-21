import { Scanner } from './scanner';
import { Parser } from './parser';
import { Interpreter } from './interpreter';
import type {
  CellDataMap,
  InterpreterResult,
  IRange,
  ResultType,
  Coordinate,
  WorksheetType,
  ModelCellType,
  RequestFormulas,
  ResponseFormulas,
} from '../types';
import {
  isFormula,
  getWorksheetKey,
  convertWorksheetKey,
  SheetRange,
  getFunction,
  getCustomError,
  anyError,
} from '../util';

const dataSources = new WeakMap<CellDataMap, number>();
let nextDataSource = 0;
const MAX_FORMULA_DEPENDENCY_DEPTH = 1024;

export function renameFormulaSheetReferences(
  formula: string,
  oldName: string,
  newName: string,
): string {
  const scanner = new Scanner(formula);
  try {
    scanner.scan();
  } catch (error) {
    if (anyError(error)) return formula;
    throw error;
  }
  const replacement = /^[A-Za-z_][A-Za-z0-9_]*$/.test(newName)
    ? newName : `'${newName.replace(/'/g, "''")}'`;
  let result = formula;
  for (const reference of [...scanner.sheetReferences].reverse()) {
    if (reference.name.toLowerCase() === oldName.toLowerCase()) {
      result = result.slice(0, reference.start) + replacement + result.slice(reference.end);
    }
  }
  return result;
}

export function parseFormula(
  formula: string,
  currentCoord: Pick<IRange, 'sheetId' | 'row' | 'col'> = {
    row: 0,
    col: 0,
    sheetId: '',
  },
  cellData: CellDataMap = new CellDataMapImpl(),
  cache: Map<string, InterpreterResult> = new Map<string, InterpreterResult>(),
  errorCache: Map<string, Error> = new Map<string, Error>(),
): InterpreterResult {
  if (!dataSources.has(cellData)) dataSources.set(cellData, ++nextDataSource);
  const active = new Set<string>();
  const evaluate = (source: string, coord: typeof currentCoord): InterpreterResult => {
    const sheetId = coord.sheetId || cellData.getSheetInfo()?.sheetId || '';
    const key = JSON.stringify([dataSources.get(cellData), sheetId, coord.row, coord.col, source]);
    if (active.has(key)) throw getCustomError('#REF!');
    const cachedError = errorCache.get(key);
    if (cachedError) throw cachedError;
    const cached = cache.get(key);
    if (cached) return cached;
    if (active.size >= MAX_FORMULA_DEPENDENCY_DEPTH) {
      throw getCustomError('#NUM!');
    }
    active.add(key);
    try {
      const expressions = new Parser(new Scanner(source).scan()).parse();
      const result: InterpreterResult = {
        result: new Interpreter(expressions, { ...coord, sheetId }, cellData).interpret(),
        expressionStr: expressions.map((item) => item.toString()).join(''),
      };
      cache.set(key, result);
      return result;
    } catch (error) {
      const code = anyError(error);
      if (code) errorCache.set(key, getCustomError(code));
      throw error;
    } finally {
      active.delete(key);
    }
  };
  const handleCell = cellData.handleCell;
  cellData.handleCell = (value, coord): ResultType[] => {
    if (!value) return [];
    return value.formula ? evaluate(value.formula, coord).result : [value.value];
  };
  try {
    return evaluate(formula, currentCoord);
  } catch (error) {
    const value = anyError(error);
    if (value) return { result: [value] };
    throw error;
  } finally {
    cellData.handleCell = handleCell;
  }
}

const defaultSheetId = '_test_';
export class CellDataMapImpl implements CellDataMap {
  private readonly map = new Map<string, ModelCellType>();
  private readonly definedNameMap = new Map<string, SheetRange>();
  private currentSheetId = defaultSheetId;
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
    const key = `${row}_${col}_${sheetId || this.currentSheetId}`;
    return key;
  }
  getFunction = getFunction;
  setSheetList(list: WorksheetType[]) {
    this.sheetList = list;
    if (!list.some((sheet) => sheet.sheetId === this.currentSheetId)) {
      this.currentSheetId = list[0]?.sheetId ?? defaultSheetId;
    }
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
      return this.sheetList.find((v) => v.name.toLowerCase() === sheetName.toLowerCase());
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
    const r = SheetRange.makeRange(value);
    this.definedNameMap.set(name.toLowerCase(), r);
  }
  getDefinedName(name: string) {
    const range = this.definedNameMap.get(name.toLowerCase());
    return range ? SheetRange.makeRange(range) : undefined;
  }
}

export function computeFormulas(
  eventData: RequestFormulas,
  cb: (data: ResponseFormulas) => boolean,
) {
  const { currentSheetId, worksheets, workbook, definedNames } = eventData;
  const formulaCache = new Map<string, InterpreterResult>();
  const formulaErrorCache = new Map<string, Error>();
  const names = new Map(Object.entries(definedNames).map(([name, range]) => [name.toLowerCase(), range]));
  const result: ResponseFormulas = {
    list: [],
  };
  const cellDataMap: CellDataMap = {
    handleCell: () => {
      return [];
    },
    getFunction,
    getCell: (range: IRange) => {
      const { row, col, sheetId } = range;
      const key = getWorksheetKey(sheetId || currentSheetId, row, col);
      return worksheets[key];
    },
    set: () => {
      throw getCustomError('#REF!');
    },
    getSheetInfo: (sheetId?: string, sheetName?: string) => {
      if (sheetName) {
        return workbook.find((v) => v.name.toLowerCase() === sheetName.toLowerCase());
      }
      const realSheetId = sheetId || currentSheetId;
      return workbook.find((v) => v.sheetId === realSheetId);
    },
    setDefinedName: () => {
      throw getCustomError('#REF!');
    },
    getDefinedName: (name: string) => {
      const r = names.get(name.toLowerCase());
      if (!r) {
        return r;
      }
      return SheetRange.makeRange(r);
    },
  };
  for (const [k, data] of Object.entries(worksheets)) {
    const range = convertWorksheetKey(k);
    if (!range || !data?.formula) {
      continue;
    }
    const temp = parseFormula(data.formula, range, cellDataMap, formulaCache, formulaErrorCache);
    if (!temp) {
      continue;
    }
    const r = temp.result[0];
    if (r !== data.value) {
      result.list.push({
        key: k,
        newValue: r,
        sheetId: range.sheetId,
      });
    }
  }
  return cb(result);
}
