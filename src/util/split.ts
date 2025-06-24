export function splitToWords(str: string): string[] {
  if (!str) {
    return [];
  }
  // unicode
  if (typeof Intl === 'undefined' || typeof Intl.Segmenter !== 'function') {
    // firefox
    return [...str];
  }
  const list = new Intl.Segmenter([], { granularity: 'word' }).segment(str);
  const arr = [...list];
  return arr.map((x) => x.segment);
}
