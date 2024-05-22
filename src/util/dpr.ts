let dprData: number | undefined = undefined;
export function dpr(
  data = typeof devicePixelRatio === 'undefined' ? undefined : devicePixelRatio,
): number {
  if (typeof dprData === 'number') {
    return dprData;
  }
  return Math.max(Math.floor(data || 1), 1);
}

export function npx(px: number): number {
  return Math.floor(px * dpr());
}

// for worker
export function setDpr(data: number) {
  dprData = Math.max(Math.floor(data || 1), 1);
}
