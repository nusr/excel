export function get<T>(
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  obj: Record<string, any> | null | undefined,
  path: string,
  defaultValue?: T
): T {
  const result =
    obj == null
      ? undefined
      : path
          .replace(/\[/g, ".")
          .replace(/\]/g, "")
          .split(".")
          .reduce((res, key) => {
            return res == null ? res : res[key];
          }, obj);
  return (result === undefined ? defaultValue : result) as T;
}
