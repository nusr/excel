import { SHEET_NAME_PREFIX } from './constant';
export const isString = (value) => {
    return typeof value === 'string';
};
export function isNumber(value) {
    if (typeof value === 'number' && !window.isNaN(value)) {
        return true;
    }
    if (typeof value !== 'string') {
        return false;
    }
    const temp = parseFloat(value);
    return !window.isNaN(temp);
}
export function parseNumber(value) {
    if (isNumber(value)) {
        return Number(value);
    }
    return 0;
}
export function parseNumberArray(list) {
    const result = [];
    for (let i = 0; i < list.length; i++) {
        const temp = parseNumber(list[i]);
        if (!window.isNaN(temp)) {
            result.push(temp);
        }
    }
    return result;
}
export function getListMaxNum(list = []) {
    const idList = list
        .map((item) => {
        if (isNumber(item)) {
            return parseInt(item, 10);
        }
        return 0;
    })
        .filter((v) => !isNaN(v));
    return Math.max(Math.max(...idList), 0);
}
export function getDefaultSheetInfo(list = []) {
    const sheetId = getListMaxNum(list.map((item) => item.sheetId)) + 1;
    return {
        name: `${SHEET_NAME_PREFIX}${sheetId}`,
        sheetId: String(sheetId),
    };
}
export function isTestEnv() {
    return process.env.NODE_ENV === 'test';
}
export function isDevEnv() {
    return process.env.NODE_ENV === 'development';
}
//# sourceMappingURL=util.js.map