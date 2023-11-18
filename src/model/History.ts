import { IHistory, UndoRedoItem, UndoRedoType } from '@/types';

export class History implements IHistory {
  private undoList: UndoRedoItem[][] = [];
  private redoList: UndoRedoItem[][] = [];
  private undoItem: UndoRedoItem[] = [];
  private redoItem: UndoRedoItem[] = [];
  constructor() {
    this.clear();
  }
  private clearItem(): void {
    this.undoItem = [];
    this.redoItem = [];
  }
  onChange(): void {
    if (this.undoItem.length > 0) {
      this.undoList.push(this.undoItem.slice());
    }
    if (this.redoItem.length > 0) {
      this.redoList.push(this.redoItem.slice());
    }
    this.clearItem();
  }
  pushRedo(op: UndoRedoType, key: string, value: any): void {
    this.redoItem.push({
      op,
      path: key,
      value,
    });
  }
  pushUndo(op: UndoRedoType, key: string, value: any): void {
    this.undoItem.push({
      op,
      path: key,
      value,
    });
  }
  clear(): void {
    this.undoList = [];
    this.redoList = [];
    this.clearItem();
  }
  canRedo(): boolean {
    return this.redoList.length > 0;
  }
  canUndo(): boolean {
    return this.undoList.length > 0;
  }
  redo() {
    return this.redoList.pop()!;
  }
  undo() {
    return this.undoList.pop()!;
  }
}
