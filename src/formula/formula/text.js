import { MAX_PARAMS_COUNT } from '@/util';
import { assert, mustOneString, mustOneNumber, mustOne } from './error';
export const T = (...list) => {
    const value = mustOne(list);
    return typeof value === 'string' ? value : '';
};
export const LOWER = (...list) => {
    const value = mustOneString(list);
    return value.toLowerCase();
};
export const CHAR = (...list) => {
    const value = mustOneNumber(list);
    return String.fromCharCode(value);
};
export const CODE = (...list) => {
    const value = mustOneString(list);
    return value.charCodeAt(0);
};
export const LEN = (...list) => {
    const value = mustOneString(list);
    return value.length;
};
export const SPLIT = (...list) => {
    assert(list.length === 2);
    const [value, sep] = list;
    assert(typeof value === 'string');
    assert(typeof sep === 'string');
    return value.split(sep);
};
export const UPPER = (...list) => {
    const value = mustOneString(list);
    return value.toUpperCase();
};
export const TRIM = (...list) => {
    const value = mustOneString(list);
    return value.replace(/ +/g, ' ').trim();
};
export const CONCAT = (...list) => {
    assert(list.length <= MAX_PARAMS_COUNT);
    return list.join('');
};
const textFormulas = {
    CONCAT,
    CONCATENATE: CONCAT,
    SPLIT,
    CHAR,
    CODE,
    UNICHAR: CHAR,
    UNICODE: CODE,
    LEN,
    LOWER,
    UPPER,
    TRIM,
    T,
};
export default textFormulas;
//# sourceMappingURL=text.js.map