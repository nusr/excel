import type { EventType } from "./event";

export interface ContentView {
  getCanvas(): HTMLCanvasElement;
  resize(width: number, height: number): void;
  render(value: EventType): void;
}
