import {
  RequestMessageType,
  IRange,
  ResultType,
  ResponseMessageType,
  InterpreterResult,
  Coordinate,
} from './types';
import { parseFormula, CustomError } from './formula';
import { iterateRange } from '@/util/range';
import { coordinateToString, stringToCoordinate } from '@/util/util';

self.addEventListener('message', (event: MessageEvent<RequestMessageType>) => {
  const list = parseAllFormulas(event.data);
  const data: ResponseMessageType = {
    list,
    sheetId: event.data.currentSheetId,
  };
  self.postMessage(data);
});

function parseAllFormulas(eventData: RequestMessageType) {
  const { currentSheetId, worksheets } = eventData;
  const formulaCache = new Map<string, InterpreterResult>();
  const sheetData = worksheets[currentSheetId] || {};
  const list: ResponseMessageType['list'] = [];
  for (const [k, data] of Object.entries(sheetData)) {
    if (data?.formula) {
      const result = parse(
        data.formula,
        eventData,
        formulaCache,
        stringToCoordinate(k),
      );
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
  coord: Coordinate,
): InterpreterResult {
  const temp = cache.get(formula);
  if (temp) {
    return temp;
  }
  const { currentSheetId, worksheets, definedNames, workbook } = eventData;
  const result = parseFormula(
    formula,
    {
      getCurrentCell: () => {
        return coord;
      },
      get: (range: IRange) => {
        const { row, col, sheetId } = range;
        const realSheetId = sheetId || currentSheetId
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
              const t = parse(f, eventData, cache, { row: r, col: c });
              result.push(t?.result);
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
