import { IController, WorksheetData } from '@/types';
import {
  parseText,
  coordinateToString,
  CSV_SPLITTER,
  convertFileToTextOrBase64,
} from '@/util';

export async function importCSV(file: File, controller: IController) {
  const text = await convertFileToTextOrBase64(file, false);
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
  await controller.batchUpdate(() => {
    controller.deleteAll(sheetId);
    controller.setWorksheet(sheetData, sheetId);
    return true;
  });
}
