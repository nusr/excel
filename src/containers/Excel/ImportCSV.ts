import { IController, WorksheetData } from '@/types';
import { parseText, coordinateToString, CSV_SPLITTER } from '@/util';
function convertFileToText(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = function (event) {
      const text = event.target?.result;
      if (text && typeof text === 'string') {
        resolve(text);
      } else {
        resolve('');
      }
    };
    reader.onerror = function (error) {
      reject(error);
    };
    reader.readAsText(file);
  });
}

export async function importCSV(file: File, controller: IController) {
  const text = await convertFileToText(file);
  const list = parseText(text, CSV_SPLITTER);
  const sheetData: WorksheetData = {};
  let r = 0;
  for (const item of list) {
    let c = 0;
    for (const col of item) {
      const key = coordinateToString(r, c++);
      sheetData[key] = {
        value: col,
      };
    }
    r++;
  }
  const sheetId = controller.getCurrentSheetId();
  controller.batchUpdate(() => {
    controller.deleteAll(sheetId);
    controller.setWorksheet(sheetData, sheetId);
    return true;
  });
}
