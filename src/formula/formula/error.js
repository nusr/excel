export class CustomError extends Error {
    value;
    constructor(value) {
        super(value);
        this.value = value;
    }
}
export const paramsError = new CustomError('#VALUE!');
export const resultError = new CustomError('#NUM!');
export function assert(condition, message = '#VALUE!') {
    if (!condition) {
        throw new CustomError(message);
    }
}
export function mustOne(list) {
    assert(list.length === 1);
    const [value] = list;
    return value;
}
export function mustOneString(list) {
    const value = mustOne(list);
    assert(typeof value === 'string');
    return value;
}
export function mustOneNumber(list) {
    const value = mustOne(list);
    assert(typeof value === 'number' && !isNaN(value));
    return value;
}
export function mustEmpty(list) {
    assert(list.length === 0);
}
//# sourceMappingURL=error.js.map