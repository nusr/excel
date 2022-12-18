import type { ScrollValue, Coordinate } from './components';

export interface IScrollValue {
  getScrollRowAndCol(): Coordinate;
  setScroll(scrollLeft: number, scrollTop: number): void;
  getScroll(): ScrollValue;
}
