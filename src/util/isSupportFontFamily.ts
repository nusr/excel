import { assert } from "./assert";

export function isSupportFontFamily(fontFamily: string): boolean {
  if (typeof fontFamily != "string") {
    return false;
  }
  const defaultFont = "Arial";
  if (fontFamily.toLowerCase() == defaultFont.toLowerCase()) {
    return true;
  }
  const width = 50;
  const canvas = document.createElement("canvas");
  const ctx = canvas.getContext("2d");
  canvas.width = width;
  canvas.height = width;
  assert(ctx !== null);
  ctx.textAlign = "center";
  ctx.fillStyle = "black";
  ctx.textBaseline = "middle";
  const g = function (font: string) {
    ctx.clearRect(0, 0, width, width);
    ctx.font = `${width}px ${font},${defaultFont}`;
    ctx.fillText("a", width / 2, width / 2);
    const imageData = ctx.getImageData(0, 0, width, width).data;
    return imageData.join("");
  };
  return g(defaultFont) !== g(fontFamily);
}
