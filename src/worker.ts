import {
  RequestMessageType,
  IRange,
  ResultType,
  ResponseMessageType,
} from './types';
import { parseFormula, CustomError } from './formula';
import { iterateRange } from '@/util/range';
import { coordinateToString } from '@/util/util';

self.addEventListener('message', (event: MessageEvent<RequestMessageType>) => {
  const { currentSheetId, worksheets, definedNames, workbook } = event.data;
  const sheetData = worksheets[currentSheetId] || {};
  const list: ResponseMessageType['list'] = [];
  for (const [k, data] of Object.entries(sheetData)) {
    if (data?.formula) {
      const result = parse(
        data.formula,
        worksheets,
        definedNames,
        workbook,
        currentSheetId,
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

  const data: ResponseMessageType = {
    list,
    sheetId: currentSheetId,
  };
  self.postMessage(data);
});

function parse(
  formula: string,
  worksheets: RequestMessageType['worksheets'],
  definedNames: RequestMessageType['definedNames'],
  workbook: RequestMessageType['workbook'],
  currentSheetId: string,
) {
  const result = parseFormula(
    formula,
    {
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
            result.push(sheetData[key].value);
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
  return result;
}
