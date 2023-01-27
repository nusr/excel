import { IUndoRedo, UndoRedoItem, UndoRedoType } from '@/types';
export class History implements IUndoRedo {
  private undoList: UndoRedoItem[][] = [];
  private redoList: UndoRedoItem[][] = [];
  private undoItem: UndoRedoItem[] = [];
  private redoItem: UndoRedoItem[] = [];
  constructor() {
    this.clear();
  }
  clearItem(): void {
    this.undoItem = [];
    this.redoItem = [];
  }
  record(): void {
    if (this.undoItem.length > 0) {
      this.undoList.push(this.undoItem);
    }
    if (this.redoItem.length > 0) {
      this.redoList.push(this.redoItem);
    }
    this.clearItem();
    console.log('undoList', this.undoList);
    console.log('redoList', this.redoList);
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
