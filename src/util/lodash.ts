export const debounce = (fn: (...params: any[]) => void) => {
  let timer: ReturnType<typeof requestAnimationFrame>;
  return (...rest: any[]) => {
    cancelAnimationFrame(timer);
    timer = requestAnimationFrame(() => {
      fn(...rest);
    });
  };
};

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
      } else if (res[key] == null) {
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
  if (
    typeof x === 'object' &&
    x != null &&
    typeof y === 'object' &&
    y != null
  ) {
    if (Object.keys(x).length !== Object.keys(y).length) return false;

    for (const key in x) {
      if (Object.prototype.hasOwnProperty.call(y, key)) {
        if (!deepEqual(x[key], y[key])) {
          return false;
        }
      } else {
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
