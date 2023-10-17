export const debounce = (fn) => {
    let timer;
    return (...rest) => {
        cancelAnimationFrame(timer);
        timer = requestAnimationFrame(() => {
            fn(...rest);
        });
    };
};
export function get(obj, path, defaultValue) {
    const result = obj == null
        ? undefined
        : path
            .replace(/\[/g, '.')
            .replace(/\]/g, '')
            .split('.')
            .reduce((res, key) => {
            return res == null ? res : res[key];
        }, obj);
    return (result === undefined ? defaultValue : result);
}
export function isEmpty(value) {
    const temp = value || {};
    return ([Object, Array].includes(temp.constructor) && !Object.entries(temp).length);
}
export function setWith(obj, path, value) {
    if (obj == null || typeof obj !== 'object') {
        return obj;
    }
    path
        .replace(/\[/g, '.')
        .replace(/\]/g, '')
        .split('.')
        .reduce((res, key, index, arr) => {
        if (index === arr.length - 1) {
            res[key] = value;
        }
        else {
            if (res[key] == null) {
                res[key] = {};
            }
        }
        return res[key];
    }, obj);
    return obj;
}
export function isObjectEqual(a, b) {
    if (a === b && a === null) {
        return true;
    }
    if (typeof a === 'object' && typeof b === 'object') {
        const list1 = Object.keys(a);
        const list2 = Object.keys(b);
        if (list1.length === list2.length) {
            for (const key of list1) {
                if (a[key] !== b[key]) {
                    return false;
                }
            }
            return true;
        }
    }
    return a === b;
}
export function deepEqual(x, y) {
    if (x === y) {
        return true;
    }
    if (typeof x == 'object' && x != null && typeof y == 'object' && y != null) {
        if (Object.keys(x).length != Object.keys(y).length)
            return false;
        for (let key in x) {
            if (y.hasOwnProperty(key)) {
                if (!deepEqual(x[key], y[key])) {
                    return false;
                }
            }
            else {
                return false;
            }
        }
        return true;
    }
    return false;
}
export function isPlainObject(value) {
    if (typeof value !== 'object' || value === null) {
        return false;
    }
    const prototype = Object.getPrototypeOf(value);
    return ((prototype === null ||
        prototype === Object.prototype ||
        Object.getPrototypeOf(prototype) === null) &&
        !(Symbol.toStringTag in value) &&
        !(Symbol.iterator in value));
}
//# sourceMappingURL=lodash.js.map