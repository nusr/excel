export function dpr(data = window.devicePixelRatio): number {
  return Math.max(Math.floor(data || 1), 1);
}

export function npx(px: number): number {
  return Math.floor(px * dpr());
}

export function thinLineWidth(): number {
  return dpr() - 0.5;
}
export function npxLine(px: number): number {
  const n = npx(px);
  return Math.max(0.5, n - 0.5);
}
