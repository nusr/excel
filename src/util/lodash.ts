type Params = any[];
export const debounce = (
  fn: (...params: Params) => void,
  wait: number = 500,
) => {
  let timer: ReturnType<typeof setTimeout> | null = null;
  return function (...rest: Params) {
    if (timer) {
      clearTimeout(timer);
    }
    timer = setTimeout(() => {
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      fn.apply(this, rest);
      timer = null;
    }, wait);
  };
};
export function throttle(fn: (...params: Params) => void, wait: number = 500) {
  let check = false;
  let lastArgs: Params | null = null;
  return function (...args: Params) {
    if (check) {
      lastArgs = args;
    } else {
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      fn.apply(this, args);
      setTimeout(() => {
        if (lastArgs) {
          // eslint-disable-next-line @typescript-eslint/ban-ts-comment
          // @ts-ignore
          fn.apply(this, lastArgs);
        }
        check = false;
      }, wait);
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

export function setWith<ValueType>(
  obj: Record<string, any> | null | undefined,
  path: string,
  value: ValueType,
): Record<string, any> | null | undefined {
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
      } else if (res[key] === null || res[key] === undefined) {
        res[key] = {};
      }
      return res[key];
    }, obj);
  return obj;
}

export function deepEqual(x: any, y: any) {
  if (x === y) {
    return true;
  }
  if (x && typeof x === 'object' && y && typeof y === 'object') {
    if (Object.keys(x).length !== Object.keys(y).length) {
      return false;
    }
    const keys1 = Object.keys(x);
    const keys2 = Object.keys(y);
    for (let i = 0; i < keys1.length; i++) {
      const key1 = keys1[i];
      const key2 = keys2[i];
      if (key1 !== key2 || !deepEqual(x[key1], y[key2])) {
        return false;
      }
    }
    return true;
  }
  return false;
}

export function camelCase(str: string) {
  const a = str
    .toLowerCase()
    .replace(/[-_\s.]+(.)?/g, (_, c) => (c ? c.toUpperCase() : ''));
  return a.substring(0, 1).toLowerCase() + a.substring(1);
}

export function noop() {}