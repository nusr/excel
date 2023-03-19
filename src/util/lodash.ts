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
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
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
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const temp: any = value || {};
  return (
    [Object, Array].includes(temp.constructor) && !Object.entries(temp).length
  );
}

export function setWith<ValueType>(
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  obj: Record<string, any> | null | undefined,
  path: string,
  value: ValueType,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
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
      } else {
        if (res[key] == null) {
          res[key] = {};
        }
      }
      return res[key];
    }, obj);
  return obj;
}

export function isObjectEqual(a: any, b: any): boolean {
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

export function isArrayEqual(a: any[], b: any[]): boolean {
  if (
    a.length === b.length &&
    a.every((item, index) => isObjectEqual(item, b[index]))
  ) {
    return true;
  }
  return false;
}
