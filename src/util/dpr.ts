export function dpr(data = window.devicePixelRatio): number {
  return Math.max(Math.floor(data || 1), 1);
}

export function npx(px: number): number {
  return Math.floor(px * dpr());
}

export function thinLineWidth(): number {
  return 1;
}

export function isMac() {
  return navigator.userAgent.indexOf('Mac OS X') > -1;
}
