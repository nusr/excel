import type { EventType } from "./event";
import { CanvasOverlayPosition } from "./components";

export interface ContentView {
  getCanvas(): HTMLCanvasElement;
  resize(): void;
  render(value: EventType): CanvasOverlayPosition;
}
