export function isEmpty(value: unknown): boolean {
  const temp: any = value || {};
  return (
    [Object, Array].includes(temp.constructor) && !Object.entries(temp).length
  );
}
