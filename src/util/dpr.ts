export function dpr(): number {
  return window.devicePixelRatio || 1;
}

export function npx(px: number): number {
  return Math.floor(px * dpr());
}

export function thinLineWidth(): number {
  return dpr() - 0.5;
}
export function npxLine(px: number): number {
  const n = npx(px);
  return n > 0 ? n - 0.5 : 0.5;
}
