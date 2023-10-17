export class History {
    undoList = [];
    redoList = [];
    undoItem = [];
    redoItem = [];
    constructor() {
        this.clear();
    }
    clearItem() {
        this.undoItem = [];
        this.redoItem = [];
    }
    onChange() {
        if (this.undoItem.length > 0) {
            this.undoList.push(this.undoItem.slice());
        }
        if (this.redoItem.length > 0) {
            this.redoList.push(this.redoItem.slice());
        }
        this.clearItem();
    }
    pushRedo(op, key, value) {
        this.redoItem.push({
            op,
            path: key,
            value,
        });
    }
    pushUndo(op, key, value) {
        this.undoItem.push({
            op,
            path: key,
            value,
        });
    }
    clear() {
        this.undoList = [];
        this.redoList = [];
        this.clearItem();
    }
    canRedo() {
        return this.redoList.length > 0;
    }
    canUndo() {
        return this.undoList.length > 0;
    }
    redo() {
        return this.redoList.pop();
    }
    undo() {
        return this.undoList.pop();
    }
}
//# sourceMappingURL=History.js.map