import { controllerLog, Range, isEmpty, PLAIN_FORMAT, HTML_FORMAT, generateHTML, convertCanvasStyleToString, parseStyle, } from '@/util';
const ROW_TITLE_HEIGHT = 19;
const COL_TITLE_WIDTH = 34;
const defaultScrollValue = {
    top: 0,
    left: 0,
    row: 0,
    col: 0,
    scrollLeft: 0,
    scrollTop: 0,
};
export class Controller {
    scrollValue = {};
    model;
    changeSet = new Set();
    copyRanges = [];
    isCut = false;
    hooks = {
        modelChange() { },
        async cut() {
            return '';
        },
        async copy() {
            return '';
        },
        async paste() {
            return {
                [HTML_FORMAT]: '',
                [PLAIN_FORMAT]: '',
            };
        },
    };
    viewSize = {
        width: 0,
        height: 0,
    };
    headerSize = {
        width: COL_TITLE_WIDTH,
        height: ROW_TITLE_HEIGHT,
    };
    mainDom = {};
    constructor(model) {
        this.model = model;
    }
    getCurrentSheetId() {
        return this.model.getCurrentSheetId();
    }
    getSheetList() {
        return this.model.getSheetList();
    }
    getSheetInfo(sheetId) {
        return this.model.getSheetInfo(sheetId);
    }
    setHooks(hooks) {
        this.hooks = hooks;
    }
    emitChange() {
        const result = this.changeSet;
        this.changeSet = new Set();
        this.hooks.modelChange(result);
        this.model.record();
    }
    getActiveCell() {
        const currentSheetId = this.model.getCurrentSheetId();
        const { activeCell } = this.getSheetInfo(currentSheetId);
        return {
            ...activeCell,
            sheetId: activeCell.sheetId || currentSheetId,
        };
    }
    setSheetCell(range) {
        const id = range.sheetId || this.model.getCurrentSheetId();
        range.sheetId = id;
        this.model.setActiveCell(range);
    }
    setActiveCell(range) {
        this.setSheetCell(range);
        this.changeSet.add('setActiveCell');
        this.emitChange();
    }
    setCurrentSheetId(id) {
        if (id === this.getCurrentSheetId()) {
            return;
        }
        this.model.setCurrentSheetId(id);
        this.changeSet.add('currentSheetId');
        const pos = this.getActiveCell();
        this.setSheetCell(pos);
        this.computeViewSize();
        this.setScroll(this.getScroll());
    }
    addSheet = () => {
        this.changeSet.add('sheetList');
        this.changeSet.add('currentSheetId');
        this.model.addSheet();
        this.setSheetCell({
            row: 0,
            col: 0,
            rowCount: 1,
            colCount: 1,
            sheetId: '',
        });
        this.computeViewSize();
        this.setScroll({
            top: 0,
            left: 0,
            row: 0,
            col: 0,
            scrollLeft: 0,
            scrollTop: 0,
        });
    };
    deleteSheet = (sheetId) => {
        this.model.deleteSheet(sheetId);
        this.changeSet.add('sheetList');
        this.changeSet.add('currentSheetId');
        this.changeSet.add('setActiveCell');
        this.emitChange();
    };
    hideSheet(sheetId) {
        this.model.hideSheet(sheetId);
        this.changeSet.add('sheetList');
        this.changeSet.add('currentSheetId');
        this.changeSet.add('setActiveCell');
        this.emitChange();
    }
    unhideSheet(sheetId) {
        this.model.unhideSheet(sheetId);
        this.changeSet.add('sheetList');
        this.changeSet.add('currentSheetId');
        this.changeSet.add('setActiveCell');
        this.emitChange();
    }
    renameSheet(sheetName, sheetId) {
        this.model.renameSheet(sheetName, sheetId);
        this.changeSet.add('sheetList');
        this.emitChange();
    }
    fromJSON(json) {
        controllerLog('loadJSON', json);
        this.model.fromJSON(json);
        const activeCell = this.getActiveCell();
        this.changeSet.add('sheetList');
        this.changeSet.add('currentSheetId');
        this.changeSet.add('setActiveCell');
        this.setSheetCell(activeCell);
        this.computeViewSize();
        this.emitChange();
    }
    toJSON() {
        return this.model.toJSON();
    }
    setCellValues(value, style, ranges) {
        this.model.setCellValues(value, style, ranges);
        this.changeSet.add('setCellValues');
        this.emitChange();
    }
    setCellStyle(style, ranges) {
        if (isEmpty(style)) {
            return;
        }
        this.model.setCellStyle(style, ranges);
        this.changeSet.add('setCellStyle');
        this.emitChange();
    }
    getCell = (range) => {
        const result = this.model.getCell(range);
        return result;
    };
    canRedo() {
        return this.model.canRedo();
    }
    canUndo() {
        return this.model.canUndo();
    }
    undo() {
        this.model.undo();
        this.changeSet.add('setCellValues');
        this.changeSet.add('setCellStyle');
        this.emitChange();
    }
    redo() {
        this.model.redo();
        this.changeSet.add('setCellValues');
        this.changeSet.add('setCellStyle');
        this.emitChange();
    }
    getColWidth(col) {
        return this.model.getColWidth(col);
    }
    setColWidth(col, width) {
        this.model.setColWidth(col, width);
        this.computeViewSize();
        this.changeSet.add('content');
    }
    getRowHeight(row) {
        return this.model.getRowHeight(row);
    }
    setRowHeight(row, height) {
        this.model.setRowHeight(row, height);
        this.computeViewSize();
        this.changeSet.add('content');
    }
    computeViewSize() {
        const headerSize = this.getHeaderSize();
        const sheetInfo = this.model.getSheetInfo(this.model.getCurrentSheetId());
        let width = headerSize.width;
        let height = headerSize.height;
        for (let i = 0; i < sheetInfo.colCount; i++) {
            width += this.getColWidth(i);
        }
        for (let i = 0; i < sheetInfo.rowCount; i++) {
            height += this.getRowHeight(i);
        }
        this.viewSize = {
            width,
            height,
        };
    }
    getViewSize() {
        return {
            ...this.viewSize,
        };
    }
    getCellSize(row, col) {
        return { width: this.getColWidth(col), height: this.getRowHeight(row) };
    }
    getHeaderSize() {
        return {
            ...this.headerSize,
        };
    }
    computeCellPosition(row, col) {
        const size = this.getHeaderSize();
        const scroll = this.getScroll();
        let resultX = size.width;
        let resultY = size.height;
        let r = scroll.row;
        let c = scroll.col;
        while (c < col) {
            resultX += this.getColWidth(c);
            c++;
        }
        while (r < row) {
            resultY += this.getRowHeight(r);
            r++;
        }
        const cellSize = this.getCellSize(row, col);
        return { ...cellSize, top: resultY, left: resultX };
    }
    addRow(rowIndex, count) {
        this.model.addRow(rowIndex, count);
        this.changeSet.add('content');
        this.emitChange();
    }
    addCol(colIndex, count) {
        this.model.addCol(colIndex, count);
        this.changeSet.add('content');
        this.emitChange();
    }
    deleteCol(colIndex, count) {
        this.model.deleteCol(colIndex, count);
        this.changeSet.add('content');
        this.emitChange();
    }
    deleteRow(rowIndex, count) {
        this.model.deleteRow(rowIndex, count);
        this.changeSet.add('content');
        this.emitChange();
    }
    getChangeSet() {
        const result = this.changeSet;
        this.changeSet = new Set();
        return result;
    }
    getScroll() {
        const sheetId = this.model.getCurrentSheetId();
        const result = this.scrollValue[sheetId] || defaultScrollValue;
        return result;
    }
    setScroll(data) {
        const sheetId = this.model.getCurrentSheetId();
        this.scrollValue[sheetId] = {
            ...data,
        };
        if (data.row > 9999) {
            this.headerSize = {
                width: Math.floor(COL_TITLE_WIDTH * 2),
                height: ROW_TITLE_HEIGHT,
            };
        }
        else {
            this.headerSize = {
                width: COL_TITLE_WIDTH,
                height: ROW_TITLE_HEIGHT,
            };
        }
        this.changeSet.add('content');
        this.changeSet.add('scroll');
        this.emitChange();
    }
    parseText(text) {
        let list;
        if (text.indexOf('\r\n') > -1) {
            list = text
                .split('\r\n')
                .map((item) => item)
                .map((item) => item.split('\t'));
        }
        else {
            list = text
                .split('\n')
                .map((item) => item)
                .map((item) => item.split('\t'));
        }
        if (list[0].length !== list[list.length - 1].length) {
            const last = list[list.length - 1];
            if (last.length === 1 && !last[0]) {
                list.pop();
            }
        }
        const rowCount = list.length;
        let colCount = 0;
        for (let item of list) {
            if (item.length > colCount) {
                colCount = item.length;
            }
        }
        const activeCell = this.getActiveCell();
        return {
            value: list,
            style: [],
            range: {
                ...activeCell,
                rowCount,
                colCount,
            },
        };
    }
    parseHTML(htmlString) {
        const parser = new DOMParser();
        const text = htmlString
            .replace('<style>\r\n<!--table', '<style>')
            .replace('-->\r\n</style>', '</style>');
        const doc = parser.parseFromString(text, 'text/html');
        const trList = doc.querySelectorAll('tr');
        const styleList = doc.querySelectorAll('style');
        const result = [];
        const resultStyle = [];
        const rowCount = trList.length;
        let colCount = 0;
        for (const item of trList) {
            const tdList = item.querySelectorAll('td');
            const temp = [];
            const list = [];
            for (const td of tdList) {
                let itemStyle = {};
                if (td.className) {
                    itemStyle = parseStyle(styleList, '.' + td.className);
                }
                else {
                    itemStyle = parseStyle(styleList, td.tagName.toLowerCase());
                }
                list.push(itemStyle);
                temp.push(td.textContent || '');
            }
            result.push(temp);
            resultStyle.push(list);
            if (temp.length > colCount) {
                colCount = temp.length;
            }
        }
        const activeCell = this.getActiveCell();
        return {
            value: result,
            style: resultStyle,
            range: {
                ...activeCell,
                rowCount,
                colCount,
            },
        };
    }
    getCopyData() {
        const activeCell = this.getActiveCell();
        const { row, col, rowCount, colCount } = activeCell;
        const result = [];
        const html = [];
        let index = 1;
        const classList = [];
        const currentSheetId = this.model.getCurrentSheetId();
        for (let r = row, endRow = row + rowCount; r < endRow; r++) {
            const temp = [];
            const t = [];
            for (let c = col, endCol = col + colCount; c < endCol; c++) {
                const a = this.model.getCell(new Range(r, c, 1, 1, currentSheetId));
                const str = String(a.value || '');
                temp.push(str);
                if (a.style) {
                    let text = convertCanvasStyleToString(a.style);
                    if (!str) {
                        text += 'mso-pattern:black none;';
                    }
                    const className = `xl${index++}`;
                    classList.push(`.${className}{${text}}`);
                    t.push(`<td class="${className}"> ${str} </td>`);
                }
                else {
                    t.push(`<td> ${str} </td>`);
                }
            }
            result.push(temp);
            html.push(t);
        }
        const htmlData = generateHTML(classList.join('\n'), html.map((item) => `<tr>${item.join('\n')}</tr>`).join('\n'));
        const text = result.map((item) => item.join('\t')).join('\r\n') + '\r\n';
        return {
            [PLAIN_FORMAT]: text,
            [HTML_FORMAT]: htmlData,
        };
    }
    async paste(event) {
        let html = '';
        let text = '';
        if (!event) {
            const data = await this.hooks.paste();
            html = data[HTML_FORMAT];
            text = data[PLAIN_FORMAT];
        }
        else {
            html = event.clipboardData?.getData(HTML_FORMAT) || '';
            text = event.clipboardData?.getData(PLAIN_FORMAT) || '';
        }
        let activeCell = this.getActiveCell();
        this.changeSet.add('setCellValues');
        controllerLog('paste data', this.copyRanges);
        if (this.copyRanges.length > 0) {
            const [range] = this.copyRanges.slice();
            this.changeSet.add('setCellStyle');
            activeCell = this.model.pasteRange(range, this.isCut);
        }
        else if (html) {
            const result = this.parseHTML(html);
            activeCell = result.range;
            this.changeSet.add('setCellStyle');
            this.model.setCellValues(result.value, result.style, [result.range]);
        }
        else {
            const result = this.parseText(text);
            activeCell = result.range;
            this.model.setCellValues(result.value, [], [result.range]);
        }
        if (this.isCut) {
            this.copyRanges = [];
            this.isCut = false;
            this.hooks.copy({
                [PLAIN_FORMAT]: '',
                [HTML_FORMAT]: '',
            });
        }
        this.setActiveCell(activeCell);
    }
    copy(event) {
        this.copyRanges = [this.getActiveCell()];
        this.isCut = false;
        const data = this.getCopyData();
        if (event) {
            const keyList = Object.keys(data);
            for (const key of keyList) {
                event.clipboardData?.setData(key, data[key]);
            }
        }
        else {
            this.hooks.copy(data);
        }
        this.changeSet.add('antLine');
        this.emitChange();
    }
    cut(event) {
        this.copyRanges = [this.getActiveCell()];
        this.isCut = true;
        this.copy(event);
    }
    getCopyRanges() {
        return this.copyRanges.slice();
    }
    getDomRect() {
        const canvas = this.getMainDom().canvas;
        if (!canvas) {
            return {
                top: 0,
                left: 0,
                width: 0,
                height: 0,
            };
        }
        const size = canvas.parentElement.getBoundingClientRect();
        return {
            top: size.top,
            left: size.left,
            width: size.width,
            height: size.height,
        };
    }
    setMainDom(dom) {
        this.mainDom = Object.assign(this.mainDom, dom);
    }
    getMainDom() {
        return this.mainDom;
    }
    getSheetData(sheetId) {
        return this.model.getSheetData(sheetId);
    }
}
//# sourceMappingURL=Controller.js.map