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
        list,
      );
      if (result.result !== data.value) {
        list.push({
          key: k,
          newValue: result.result,
          sheetId: currentSheetId,
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
  list: ResponseMessageType['list'],
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
        const realSheetId = sheetId || currentSheetId;
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
            const oldValue = sheetData[key].value;
            if (f) {
              const t = parse(f, eventData, cache, { row: r, col: c }, list);
              if (t.result !== oldValue) {
                list.push({ key, newValue: t.result, sheetId: realSheetId });
              }
              result.push(t?.result);
            } else {
              result.push(oldValue);
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
