import type { IWindowSize } from "./interface";
export function getWidthHeight(): IWindowSize {
  return {
    width: document.documentElement.clientWidth,
    height: document.documentElement.clientHeight,
  };
}
export function isNumber(value: string | number): boolean {
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  return parseFloat(value) == value;
}
