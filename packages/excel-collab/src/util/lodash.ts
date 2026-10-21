type Params = any[];

export function throttle(fn: (...params: Params) => void, wait: number) {
  let check = false;
  let pending: { args: Params; receiver: unknown } | undefined;
  return function invoke(this: unknown, ...args: Params) {
    if (check) {
      pending = { args, receiver: this };
    } else {
      check = true;
      setTimeout(() => {
        check = false;
        if (pending) {
          const call = pending;
          pending = undefined;
          invoke.apply(call.receiver, call.args);
        }
      }, wait);
      fn.apply(this, args);
    }
  };
}

export function get<T>(
  obj: Record<string, any> | null | undefined,
  path: string,
  defaultValue?: T,
): T {
  const result =
    obj == null
      ? undefined
      : path
          .replace(/\[/g, '.')
          .replace(/\]/g, '')
          .split('.')
          .reduce((res, key) => {
            return res == null ? res : res[key];
          }, obj);
  return (result === undefined ? defaultValue : result) as T;
}

export function isEmpty(value: unknown): boolean {
  const temp: any = value || {};
  return (
    [Object, Array].includes(temp.constructor) && !Object.entries(temp).length
  );
}

export function deepEqual(x: any, y: any) {
  if (x === y) {
    return true;
  }
  if (x && typeof x === 'object' && y && typeof y === 'object') {
    if (Array.isArray(x) !== Array.isArray(y) ||
      (Array.isArray(x) && x.length !== y.length)) {
      return false;
    }
    if (Object.keys(x).length !== Object.keys(y).length) {
      return false;
    }
    const keys1 = Object.keys(x);
    for (let i = 0; i < keys1.length; i++) {
      const key1 = keys1[i];
      if (!Object.prototype.hasOwnProperty.call(y, key1) || !deepEqual(x[key1], y[key1])) {
        return false;
      }
    }
    return true;
  }
  return false;
}

export function noop() {}

export function camelCase(str: string) {
  const a = str
    .toLowerCase()
    .replace(/[-_\s.]+(.)?/g, (_, c) => (c ? c.toUpperCase() : ''));
  return a.substring(0, 1).toLowerCase() + a.substring(1);
}

export function omit<T, K extends keyof T>(obj: T, keys: K[]): Omit<T, K> {
  const result = { ...obj };
  keys.forEach((key) => {
    delete result[key];
  });
  return result;
}
