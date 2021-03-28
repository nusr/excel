export function pick<T extends Record<string, unknown>, U extends keyof T>(
  object: T | null | undefined,
  keys: Array<U>
): Pick<T, U> {
  const result = keys.reduce((res, key) => {
    if (object && key in object) {
      res[key] = object[key];
    }
    return res;
  }, {} as Pick<T, U>);
  return result;
}
