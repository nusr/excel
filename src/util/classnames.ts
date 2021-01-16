export function classnames(
  className = "",
  config: Record<string, boolean> = {}
): string {
  let result = className || "";
  for (const key of Object.keys(config)) {
    if (config[key]) {
      result += ` ${key}`;
    }
  }
  return result;
}
