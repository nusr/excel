export function classnames(...rest: Array<string | Record<string, unknown>>): string {
  let result = '';
  for (const temp of rest) {
    if (typeof temp === 'string' && temp) {
      result += `${temp} `;
    }
    if (typeof temp === 'object') {
      for (const key of Object.keys(temp)) {
        if (temp[key]) {
          result += `${key} `;
        }
      }
    }
  }
  return result.trim();
}
