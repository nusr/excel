import { getDefaultSheetInfo, assert, modelLog, Range, DEFAULT_ROW_COUNT, DEFAULT_COL_COUNT, isEmpty, get, setWith, isSameRange, } from '@/util';
import { parseFormula, CustomError } from '@/formula';
const CELL_HEIGHT = 19;
const CELL_WIDTH = 68;
const XLSX_MAX_COL_COUNT = 16384;
const XLSX_MAX_ROW_COUNT = 1048576;
function convertToNumber(list) {
    const result = list
        .map((item) => parseInt(item, 10))
        .filter((v) => !isNaN(v));
    result.sort((a, b) => a - b);
    return result;
}
export class Model {
    currentSheetId = '';
    workbook = [];
    worksheets = {};
    mergeCells = [];
    customHeight = {};
    customWidth = {};
    history;
    definedNames = {};
    constructor(history) {
        this.history = history;
    }
    getSheetList() {
        return this.workbook.slice();
    }
    setActiveCell(range) {
        const index = this.workbook.findIndex((v) => v.sheetId === range.sheetId);
        if (index < 0) {
            return;
        }
        const { row, col } = range;
        const sheet = this.workbook[index];
        if (row < 0 || col < 0 || row >= sheet.rowCount || col >= sheet.colCount) {
            return;
        }
        const oldValue = sheet.activeCell;
        if (isSameRange(oldValue, range)) {
            return;
        }
        const key = `workbook.${index}.activeCell`;
        this.history.pushRedo('set', key, {
            ...oldValue,
        });
        setWith(this, key, { ...range });
    }
    addSheet() {
        const item = getDefaultSheetInfo(this.workbook);
        const sheet = {
            ...item,
            isHide: false,
            colCount: DEFAULT_COL_COUNT,
            rowCount: DEFAULT_ROW_COUNT,
            activeCell: {
                row: 0,
                col: 0,
                rowCount: 1,
                colCount: 1,
                sheetId: item.sheetId,
            },
        };
        const index = this.workbook.findIndex((item) => item.sheetId === this.currentSheetId);
        if (index < 0) {
            this.workbook.push(sheet);
        }
        else {
            this.workbook.splice(index + 1, 0, sheet);
        }
        this.currentSheetId = sheet.sheetId;
    }
    getSheetIndex(sheetId) {
        const id = sheetId || this.currentSheetId;
        const index = this.workbook.findIndex((item) => item.sheetId === id);
        assert(index >= 0);
        let lastIndex = (index + 1) % this.workbook.length;
        while (lastIndex !== index) {
            if (this.workbook[lastIndex].isHide) {
                lastIndex = (lastIndex + 1) % this.workbook.length;
            }
            else {
                break;
            }
        }
        return {
            index,
            lastIndex,
        };
    }
    deleteSheet(sheetId) {
        const list = this.workbook.filter((v) => !v.isHide);
        assert(list.length >= 2, 'A workbook must contains at least on visible worksheet');
        const { index, lastIndex } = this.getSheetIndex(sheetId);
        this.currentSheetId = this.workbook[lastIndex].sheetId;
        this.workbook.splice(index, 1);
    }
    hideSheet(sheetId) {
        const list = this.workbook.filter((v) => !v.isHide);
        assert(list.length >= 2, 'A workbook must contains at least on visible worksheet');
        const { index, lastIndex } = this.getSheetIndex(sheetId);
        this.workbook[index].isHide = true;
        this.currentSheetId = this.workbook[lastIndex].sheetId;
    }
    unhideSheet(sheetId) {
        const item = this.getSheetInfo(sheetId);
        item.isHide = false;
        this.currentSheetId = item.sheetId;
    }
    renameSheet(sheetName, sheetId) {
        assert(!!sheetName, 'You typed a invalid name for a sheet.');
        const sheetInfo = this.getSheetInfo(sheetId);
        sheetInfo.name = sheetName;
    }
    getSheetInfo(id = this.currentSheetId) {
        const item = this.workbook.find((item) => item.sheetId === id);
        assert(item !== undefined);
        return item;
    }
    setCurrentSheetId(id) {
        this.currentSheetId = id;
        this.computeAllCell();
    }
    getCurrentSheetId() {
        return this.currentSheetId;
    }
    getSheetId() {
        const list = this.workbook.filter((v) => !v.isHide);
        return list[0].sheetId;
    }
    fromJSON = (json) => {
        modelLog('fromJSON', json);
        const { worksheets = {}, workbook = [], mergeCells = [], customHeight = {}, customWidth = {}, definedNames = {}, } = json;
        this.worksheets = worksheets;
        this.workbook = workbook;
        this.currentSheetId = this.getSheetId() || this.currentSheetId;
        this.mergeCells = mergeCells;
        this.customWidth = customWidth;
        this.customHeight = customHeight;
        this.definedNames = definedNames;
        this.computeAllCell();
        this.history.clear();
    };
    toJSON = () => {
        const { worksheets, workbook, mergeCells, customHeight, customWidth, definedNames, } = this;
        return {
            workbook,
            worksheets,
            mergeCells,
            customHeight,
            customWidth,
            definedNames,
        };
    };
    setCellValue(value, range) {
        const { row, col } = range;
        const key = `worksheets[${this.currentSheetId}][${row}][${col}].value`;
        this.history.pushRedo('set', key, get(this, key, undefined));
        setWith(this, key, value);
    }
    setCellFormula(formula, range) {
        const { row, col } = range;
        const key = `worksheets[${this.currentSheetId}][${row}][${col}].formula`;
        this.history.pushRedo('set', key, get(this, key, undefined));
        setWith(this, key, formula);
    }
    setCellValues(value, style, ranges) {
        const [range] = ranges;
        const { row, col } = range;
        for (let r = 0; r < value.length; r++) {
            for (let c = 0; c < value[r].length; c++) {
                const t = value[r][c];
                const temp = {
                    row: row + r,
                    col: col + c,
                };
                if (style[r] && style[r][c]) {
                    this.setStyle(style[r][c], temp);
                }
                if (t.startsWith('=')) {
                    this.setCellFormula(t, temp);
                }
                else {
                    this.setCellFormula('', temp);
                    this.setCellValue(t, temp);
                }
            }
        }
        this.computeAllCell();
    }
    setStyle(style, range) {
        const stylePath = `worksheets[${this.currentSheetId}][${range.row}][${range.col}].style`;
        this.history.pushRedo('set', stylePath, get(this, stylePath, {}));
        setWith(this, stylePath, style);
    }
    setCellStyle(style, ranges) {
        const [range] = ranges;
        const { row, col, rowCount, colCount } = range;
        for (let r = row, endRow = row + rowCount; r < endRow; r++) {
            for (let c = col, endCol = col + colCount; c < endCol; c++) {
                this.setStyle(style, { row: r, col: c });
            }
        }
    }
    getCell = (range) => {
        const { row, col, sheetId } = range;
        const realSheetId = sheetId || this.currentSheetId;
        const cellData = get(this, `worksheets[${realSheetId}][${row}][${col}]`, {});
        return {
            ...cellData,
            row,
            col,
        };
    };
    computeAllCell() {
        const sheetData = this.worksheets[this.currentSheetId];
        if (isEmpty(sheetData)) {
            return [];
        }
        const rowKeys = Object.keys(sheetData);
        for (const rowKey of rowKeys) {
            const colKeys = Object.keys(sheetData[rowKey]);
            for (const colKey of colKeys) {
                const temp = sheetData[rowKey][colKey];
                if (temp?.formula) {
                    temp.value = this.parseFormula(temp.formula);
                }
            }
        }
    }
    parseFormula(formula) {
        const self = this;
        const result = parseFormula(formula, {
            get: (row, col, sheetId) => {
                const sheetInfo = this.getSheetInfo(sheetId || this.currentSheetId);
                if (row >= sheetInfo.rowCount || col >= sheetInfo.colCount) {
                    throw new CustomError('#REF!');
                }
                const temp = self.getCell(new Range(row, col, 1, 1, sheetId));
                return temp.value;
            },
            set: () => { },
            convertSheetNameToSheetId: (sheetName) => {
                const item = self.workbook.find((v) => v.name === sheetName);
                return item?.sheetId || '';
            },
        }, {
            set() {
                throw new CustomError('#REF!');
            },
            get(name) {
                return self.definedNames[name];
            },
            has(name) {
                return name in self.definedNames;
            },
        });
        return result.error ? result.error : result.result;
    }
    addRow(rowIndex, count) {
        const sheetData = this.worksheets[this.currentSheetId];
        if (isEmpty(sheetData)) {
            return;
        }
        const rowKeys = convertToNumber(Object.keys(sheetData));
        for (let i = rowKeys.length - 1; i >= 0; i--) {
            const rowKey = rowKeys[i];
            if (rowKey < rowIndex) {
                continue;
            }
            const key = String(rowKey + count);
            sheetData[key] = {
                ...sheetData[rowKey],
            };
            sheetData[rowKey] = {};
        }
        const sheetInfo = this.getSheetInfo();
        if (sheetInfo.rowCount >= XLSX_MAX_ROW_COUNT) {
            return;
        }
        sheetInfo.rowCount += count;
    }
    addCol(colIndex, count) {
        const sheetData = this.worksheets[this.currentSheetId];
        if (isEmpty(sheetData)) {
            return;
        }
        const sheetInfo = this.getSheetInfo();
        const rowKeys = Object.keys(sheetData);
        for (const rowKey of rowKeys) {
            const colKeys = convertToNumber(Object.keys(sheetData[rowKey]));
            for (let i = colKeys.length - 1; i >= 0; i--) {
                const colKey = colKeys[i];
                if (colKey < colIndex) {
                    continue;
                }
                const key = String(colKey + count);
                sheetData[rowKey][key] = {
                    ...sheetData[rowKey][colKey],
                };
                sheetData[rowKey][colKey] = {};
            }
        }
        if (sheetInfo.colCount >= XLSX_MAX_COL_COUNT) {
            return;
        }
        sheetInfo.colCount += count;
    }
    deleteCol(colIndex, count) {
        const sheetData = this.worksheets[this.currentSheetId];
        if (isEmpty(sheetData)) {
            return;
        }
        const sheetInfo = this.getSheetInfo();
        const rowKeys = Object.keys(sheetData);
        for (const rowKey of rowKeys) {
            const colKeys = convertToNumber(Object.keys(sheetData[rowKey]));
            for (let i = 0; i < colKeys.length; i++) {
                const colKey = colKeys[i];
                if (colKey < colIndex) {
                    continue;
                }
                const key = String(colKey - count);
                sheetData[rowKey][key] = {
                    ...sheetData[rowKey][colKey],
                };
                sheetData[rowKey][colKey] = {};
            }
        }
        sheetInfo.colCount -= count;
    }
    deleteRow(rowIndex, count) {
        const sheetData = this.worksheets[this.currentSheetId];
        if (isEmpty(sheetData)) {
            return;
        }
        const rowKeys = convertToNumber(Object.keys(sheetData));
        for (let i = 0; i < rowKeys.length; i++) {
            const rowKey = rowKeys[i];
            if (rowKey < rowIndex) {
                continue;
            }
            const key = String(rowKey - count);
            sheetData[key] = {
                ...sheetData[rowKey],
            };
            sheetData[rowKey] = {};
        }
        const sheetInfo = this.getSheetInfo();
        sheetInfo.rowCount -= count;
    }
    getColWidth(col) {
        const temp = this.customWidth[this.currentSheetId];
        if (!temp) {
            return CELL_WIDTH;
        }
        if (typeof temp[col] === 'number') {
            return temp[col];
        }
        return CELL_WIDTH;
    }
    setColWidth(col, width) {
        this.customWidth[this.currentSheetId] =
            this.customWidth[this.currentSheetId] || {};
        this.customWidth[this.currentSheetId][col] = width;
    }
    getRowHeight(row) {
        const temp = this.customHeight[this.currentSheetId];
        if (!temp) {
            return CELL_HEIGHT;
        }
        if (typeof temp[row] === 'number') {
            return temp[row];
        }
        return CELL_HEIGHT;
    }
    setRowHeight(row, height) {
        this.customHeight[this.currentSheetId] =
            this.customHeight[this.currentSheetId] || {};
        this.customHeight[this.currentSheetId][row] = height;
    }
    canRedo() {
        return this.history.canRedo();
    }
    canUndo() {
        return this.history.canUndo();
    }
    undo() {
        if (!this.canUndo()) {
            return;
        }
        this.executeOperate(this.history.undo());
    }
    redo() {
        if (!this.canRedo()) {
            return;
        }
        this.executeOperate(this.history.redo());
    }
    record() {
        this.history.onChange();
    }
    executeOperate(list) {
        for (const item of list) {
            const { op, path, value } = item;
            switch (op) {
                case 'set': {
                    this.history.pushUndo(op, path, get(this, path, undefined));
                    this.record();
                    setWith(this, path, value);
                    break;
                }
                default:
                    console.error(`not support type: ${op}`);
                    break;
            }
        }
    }
    pasteRange(fromRange, isCut) {
        const currentSheetId = this.currentSheetId;
        const { activeCell } = this.getSheetInfo(currentSheetId);
        const { row, col, rowCount, colCount, sheetId } = fromRange;
        for (let r = row, i = 0, endRow = row + rowCount; r < endRow; r++, i++) {
            for (let c = col, j = 0, endCol = col + colCount; c < endCol; c++, j++) {
                const oldPath = `worksheets[${sheetId || currentSheetId}][${r}][${c}]`;
                const temp = get(this, oldPath, {});
                const realRow = activeCell.row + i;
                const realCol = activeCell.col + j;
                const path = `worksheets[${currentSheetId}][${realRow}][${realCol}]`;
                setWith(this, path, { ...temp });
                if (isCut) {
                    setWith(this, oldPath, {});
                }
            }
        }
        this.computeAllCell();
        const range = {
            ...activeCell,
            rowCount,
            colCount,
        };
        return range;
    }
    getSheetData(sheetId) {
        const id = sheetId || this.currentSheetId;
        return this.worksheets[id];
    }
}
//# sourceMappingURL=Model.js.map