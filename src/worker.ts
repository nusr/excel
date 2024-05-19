import {
  RequestMessageType,
  IRange,
  ResultType,
  ResponseMessageType,
  InterpreterResult,
} from './types';
import { parseFormula, CustomError } from './formula';
import { iterateRange } from '@/util/range';
import { coordinateToString } from '@/util/util';

self.addEventListener('message', (event: MessageEvent<RequestMessageType>) => {
  const { activeCell } = event.data;
  const list = parseAllFormulas(event.data);

  const data: ResponseMessageType = {
    list,
    sheetId: activeCell.sheetId,
  };
  self.postMessage(data);
});

function parseAllFormulas(eventData: RequestMessageType) {
  const { activeCell, worksheets } = eventData;
  const formulaCache = new Map<string, InterpreterResult>();
  const sheetData = worksheets[activeCell.sheetId] || {};
  const list: ResponseMessageType['list'] = [];
  for (const [k, data] of Object.entries(sheetData)) {
    if (data?.formula) {
      const result = parse(data.formula, eventData, formulaCache);
      const newValue = result.result;
      const oldValue = data.value;
      if (newValue !== oldValue) {
        list.push({
          key: k,
          newValue,
        });
      }
    }
  }
  return list;
}

function parse(
  formula: string,
  eventData: RequestMessageType,
  cache: Map<string, InterpreterResult>,
): InterpreterResult {
  const temp = cache.get(formula);
  if (temp) {
    return temp;
  }
  const { activeCell, worksheets, definedNames, workbook } = eventData;
  const result = parseFormula(
    formula,
    {
      getActiveRange: () => {
        return activeCell;
      },
      get: (range: IRange) => {
        const { row, col, sheetId } = range;
        const realSheetId = sheetId || activeCell.sheetId;
        const result: ResultType[] = [];
        const sheetInfo = workbook.find((v) => v.sheetId === realSheetId);
        if (
          !sheetInfo ||
          row >= sheetInfo.rowCount ||
          col >= sheetInfo.colCount
        ) {
          throw new CustomError('#REF!');
        }
        const sheetData = worksheets[realSheetId] || {};
        iterateRange(range, sheetInfo, (r, c) => {
          const key = coordinateToString(r, c);
          if (sheetData[key]) {
            const f = sheetData[key].formula;
            if (f) {
              const r = parse(f, eventData, cache);
              result.push(r?.result);
            } else {
              result.push(sheetData[key].value);
            }
          }
          return false;
        });
        return result;
      },
      set: () => {
        throw new CustomError('#REF!');
      },
      convertSheetNameToSheetId: (sheetName: string) => {
        return workbook.find((v) => v.name === sheetName)?.sheetId || '';
      },
    },
    {
      set: () => {
        throw new CustomError('#REF!');
      },
      get: (name: string) => {
        return definedNames[name];
      },
    },
  );
  cache.set(formula, result);
  return result;
}
