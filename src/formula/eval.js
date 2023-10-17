import { Scanner } from './scanner';
import { Parser } from './parser';
import formulas, { CustomError } from './formula';
import { Interpreter } from './interpreter';
export function parseFormula(source, cellData = new CellDataMapImpl(), definedNamesMap = new DefinedNamesMapImpl(), functionMap = formulas) {
    let expressionStr = '';
    try {
        const list = new Scanner(source).scan();
        const expressions = new Parser(list).parse();
        const result = new Interpreter(expressions, cellData, definedNamesMap, functionMap).interpret();
        const strList = [];
        for (const item of expressions) {
            strList.push(item.toString());
        }
        expressionStr = strList.join('');
        return {
            result: result,
            error: null,
            expressionStr,
        };
    }
    catch (error) {
        if (error instanceof CustomError) {
            return {
                result: null,
                error: error.value,
                expressionStr,
            };
        }
    }
    return {
        result: null,
        error: '#ERROR!',
        expressionStr,
    };
}
export class CellDataMapImpl {
    map = new Map();
    sheetNameMap = {};
    getKey(row, col, sheetId = '') {
        const key = `${row}_${col}_${sheetId}`;
        return key;
    }
    setSheetNameMap(sheetNameMap) {
        this.sheetNameMap = sheetNameMap;
    }
    set(row, col, sheetId, value) {
        const key = this.getKey(row, col, sheetId);
        this.map.set(key, value);
    }
    get(row, col, sheetId = '') {
        const key = this.getKey(row, col, sheetId);
        return this.map.get(key);
    }
    convertSheetNameToSheetId(sheetName) {
        if (!sheetName) {
            return '';
        }
        return this.sheetNameMap[sheetName] || '';
    }
}
export class DefinedNamesMapImpl {
    map = new Map();
    set(name, value) {
        this.map.set(name, value);
    }
    get(name) {
        return this.map.get(name);
    }
    has(name) {
        return this.map.has(name);
    }
}
//# sourceMappingURL=eval.js.map