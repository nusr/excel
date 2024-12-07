export function stringToUint8Array(str: string) {
  const binString = atob(str);
  // @ts-ignore
  return Uint8Array.from(binString, (m) => m.codePointAt(0));
}

export function uint8ArrayToString(bytes: Uint8Array) {
  const binString = Array.from(bytes, (byte) =>
    String.fromCodePoint(byte),
  ).join('');
  return btoa(binString);
}
