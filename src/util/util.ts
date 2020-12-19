import type { IWindowSize } from "./interface";
export function getWidthHeight(): IWindowSize {
  return {
    width: document.documentElement.clientWidth,
    height: document.documentElement.clientHeight,
  };
}