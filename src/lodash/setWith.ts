export function setWith<T>(
  obj: Record<string, any> | null | undefined,
  path: string,
  value: T
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
