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
  private getUndoData(): WorkBookJSON | undefined {
    const temp = this.undoList.pop();
    return temp ? JSON.parse(temp) : temp;
  }
  private getRedoData(): WorkBookJSON | undefined {
    const temp = this.redoList.pop();
    return temp ? JSON.parse(temp) : temp;
  }
  canRedo(): boolean {
    return this.redoList.length > 0;
  }
  canUndo(): boolean {
    return this.undoList.length > 0;
  }
  redo(sheetData: WorkBookJSON): WorkBookJSON | undefined {
    if (this.canRedo()) {
      this.addUndoData(sheetData);
      return this.getRedoData();
    }
    return undefined;
  }
  undo(sheetData: WorkBookJSON): WorkBookJSON | undefined {
    if (this.canUndo()) {
      this.addRedoData(sheetData);
      return this.getUndoData();
    }
    return undefined;
  }
}
