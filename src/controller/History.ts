import { WorkBookJSON } from "@/types";
import { historyLog } from "@/util";
export class History {
  undoList: string[] = [];
  redoList: string[] = [];
  constructor() {
    this.reset();
  }
  reset(): void {
    this.undoList = [];
    this.redoList = [];
  }
  onChange(sheetData: WorkBookJSON): void {
    this.addUndoData(sheetData);
    this.redoList = [];
  }
  addUndoData(sheetData: WorkBookJSON): void {
    historyLog("addUndoData");
    this.undoList.push(JSON.stringify(sheetData));
  }
  addRedoData(sheetData: WorkBookJSON): void {
    historyLog("addRedoData");
    this.redoList.push(JSON.stringify(sheetData));
  }
  getUndoData(): WorkBookJSON | undefined {
    const temp = this.undoList.pop();
    return temp ? JSON.parse(temp) : temp;
  }
  getRedoData(): WorkBookJSON | undefined {
    const temp = this.redoList.pop();
    return temp ? JSON.parse(temp) : temp;
  }
  canRedo(): boolean {
    return this.redoList.length > 0;
  }
  canUndo(): boolean {
    return this.undoList.length > 0;
  }
  redo(sheetData: WorkBookJSON): Promise<WorkBookJSON | undefined> {
    return new Promise((resolve, reject) => {
      historyLog("redo");
      if (this.canRedo()) {
        this.addUndoData(sheetData);
        resolve(this.getRedoData());
        historyLog("redo success");
      }
      reject();
    });
  }
  undo(sheetData: WorkBookJSON): Promise<WorkBookJSON | undefined> {
    return new Promise((resolve, reject) => {
      historyLog("undo");
      if (this.canUndo()) {
        this.addRedoData(sheetData);
        const temp = this.getUndoData();
        resolve(temp);
        historyLog("undo success", temp);
      }
      reject();
    });
  }
}
