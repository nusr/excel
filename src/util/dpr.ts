export function dpr(data = window.devicePixelRatio): number {
  return Math.max(Math.floor(data || 1), 1);
}

export function npx(px: number): number {
  return Math.floor(px * dpr());
}

export function thinLineWidth(): number {
  return 1;
}

export function resizeCanvas(
  canvas: HTMLCanvasElement,
  width: number,
  height: number
): void {
  const size = dpr();
  canvas.getContext("2d")!.scale(size, size);

  canvas.style.width = width + "px";
  canvas.style.height = height + "px";
  canvas.width = npx(width);
  canvas.height = npx(height);
}

export function createCanvas() {
  const canvas = document.createElement("canvas");
  canvas.style.display = "none";
  document.body.appendChild(canvas);
  return canvas;
}
