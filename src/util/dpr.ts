let dprData: number | undefined = undefined;

const MIN_DPR = 2;

const getDprData = (data?: number) => {
  return Math.max(Math.floor(data || 1), MIN_DPR);
};

export function dpr(
  data = typeof devicePixelRatio === 'undefined' ? undefined : devicePixelRatio,
): number {
  if (typeof dprData === 'number') {
    return dprData;
  }
  return getDprData(data);
}

export function npx(px: number): number {
  return Math.floor(px * dpr());
}

// for worker
export function setDpr(data: number) {
  dprData = getDprData(data);
}
