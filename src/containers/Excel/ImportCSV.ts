import { IController, WorksheetData } from '../../types';
import { parseText, CSV_SPLITTER, convertFileToTextOrBase64 } from '../../util';

export async function importCSV(file: File, controller: IController) {
  const text = await convertFileToTextOrBase64(file, false);
  const list = parseText(text, CSV_SPLITTER);
  const sheetData: WorksheetData = [];
  const sheetId = controller.getCurrentSheetId();
  let r = 0;
  for (const item of list) {
    let c = 0;
    for (const col of item) {
      sheetData.push({ row: r, col: c, value: col, sheetId });
      c++;
    }
    r++;
  }

  controller.transaction(() => {
    controller.deleteAll();
    controller.setWorksheet(sheetData);
  });
}
