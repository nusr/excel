import type { EventType } from "./event";
import { IController } from "./controller";

export type ModifierKeyType = "alt" | "shift" | "ctrl" | "meta";
export type KeyboardEventItem = {
  key: string;
  modifierKey: ModifierKeyType[];
  handler: (controller: IController) => void;
};

export interface ContentView {
  getCanvas(): HTMLCanvasElement;
  resize(): void;
  render(value: EventType): void;
}
