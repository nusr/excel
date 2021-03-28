// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function pick<T extends Record<string, any>, U extends keyof T>(
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
