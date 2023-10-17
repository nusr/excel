import { IHistory, UndoRedoItem, UndoRedoType } from '@/types';
export declare class History implements IHistory {
    private undoList;
    private redoList;
    private undoItem;
    private redoItem;
    constructor();
    private clearItem;
    onChange(): void;
    pushRedo(op: UndoRedoType, key: string, value: any): void;
    pushUndo(op: UndoRedoType, key: string, value: any): void;
    clear(): void;
    canRedo(): boolean;
    canUndo(): boolean;
    redo(): UndoRedoItem[];
    undo(): UndoRedoItem[];
}
