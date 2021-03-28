export function isEmpty(value: unknown): boolean {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const temp: any = value || {};
  return (
    [Object, Array].includes(temp.constructor) && !Object.entries(temp).length
  );
}
