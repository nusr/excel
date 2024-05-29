import {
  RequestMessageType,
  IRange,
  ResponseMessageType,
  InterpreterResult,
  ResponseFormula,
  RequestFormula,
  CellDataMap,
  FormulaKeys,
} from './types';
import { parseFormula, CustomError, allFormulas } from './formula';
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
  const { currentSheetId, worksheets, workbook, definedNames } = eventData;
  const formulaCache = new Map<string, InterpreterResult>();
  const sheetData = worksheets[currentSheetId] || {};
  const list: ResponseFormula['list'] = [];
  const cellDataMap: CellDataMap = {
    handleCell: () => {
      return undefined;
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
    const result = parseFormula(
      data?.formula,
      stringToCoordinate(k),
      cellDataMap,
      formulaCache,
    );
    if (!result) {
      continue;
    }
    if (result.result !== data.value) {
      list.push({
        key: k,
        newValue: result.result,
        sheetId: currentSheetId,
      });
    }
  }
  return list;
}
