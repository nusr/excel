export function setWith<ValueType>(
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  obj: Record<string, any> | null | undefined,
  path: string,
  value: ValueType
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
): Record<string, any> | null | undefined {
  if (obj == null || typeof obj !== "object") {
    return obj;
  }
  path
    .replace(/\[/g, ".")
    .replace(/\]/g, "")
    .split(".")
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
