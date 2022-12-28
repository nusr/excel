import type { EventType } from './event';
export interface BaseView {
  resize(width: number, height: number): void;
  render(value: EventType): void;
}

export interface ContentView {
  canvas: HTMLCanvasElement;
  resize(width: number, height: number): void;
  render(value: EventType): void;
}