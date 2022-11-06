import { WorkBookJSON, IHistory } from '@/types';
export class History implements IHistory {
  private undoList: string[] = [];
  private redoList: string[] = [];
  constructor() {
    this.reset();
  }
  private reset(): void {
    this.undoList = [];
    this.redoList = [];
  }
  onChange(sheetData: WorkBookJSON): void {
    this.addUndoData(sheetData);
    this.redoList = [];
  }
  private addUndoData(sheetData: WorkBookJSON): void {
    this.undoList.push(JSON.stringify(sheetData));
  }
  private addRedoData(sheetData: WorkBookJSON): void {
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
  redo(sheetData: WorkBookJSON): void {
    this.addUndoData(sheetData);
  }
  undo(sheetData: WorkBookJSON): void {
    this.addRedoData(sheetData);
  }
}
