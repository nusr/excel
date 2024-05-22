import {
  RequestMessageType,
  IRange,
  ResultType,
  ResponseMessageType,
  InterpreterResult,
  ResponseFormula,
  Coordinate,
  RequestFormula,
} from './types';
import { parseFormula, CustomError } from './formula';
import { iterateRange } from '@/util/range';
import { coordinateToString, stringToCoordinate } from '@/util/util';
import { OffScreenWorker } from './canvas/offScreenWorker';
import { setDpr } from '@/util/dpr';

let offScreen: OffScreenWorker;
self.addEventListener('message', (event: MessageEvent<RequestMessageType>) => {
  if (event.data.status === 'formula') {
    const list = parseAllFormulas(event.data);
    const data: ResponseFormula = {
      list,
      status: 'formula',
    };
    self.postMessage(data);
  } else if (event.data.status === 'init') {
    offScreen = new OffScreenWorker(event.data.canvas);
    setDpr(event.data.dpr);
  } else if (event.data.status === 'render') {
    const result = offScreen.render(event.data);
    if (result) {
      const data: ResponseMessageType = {
        ...result,
        status: 'render',
      };
      self.postMessage(data);
    }
  } else if (event.data.status === 'resize') {
    offScreen.resize(event.data);
  }
});

function parseAllFormulas(eventData: RequestFormula) {
  const { currentSheetId, worksheets } = eventData;
  const formulaCache = new Map<string, InterpreterResult>();
  const sheetData = worksheets[currentSheetId] || {};
  const list: ResponseFormula['list'] = [];
  for (const [k, data] of Object.entries(sheetData)) {
    if (data?.formula) {
      const result = parseFormulaItem(
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

function parseFormulaItem(
  formula: string,
  eventData: RequestFormula,
  cache: Map<string, InterpreterResult>,
  coord: Coordinate,
  list: ResponseFormula['list'],
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
              const t = parseFormulaItem(
                f,
                eventData,
                cache,
                { row: r, col: c },
                list,
              );
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
