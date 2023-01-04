import type { EventType } from "./event";
import { CanvasOverlayPosition } from "./components";

export interface ContentView {
  getCanvas(): HTMLCanvasElement;
  resize(width: number, height: number): void;
  render(value: EventType): CanvasOverlayPosition;
}
