import type { EventType } from './model';
import { IController } from './controller';

export type ModifierKeyType = 'alt' | 'shift' | 'ctrl' | 'meta';
export interface KeyboardEventItem {
  key: string;
  modifierKey: ModifierKeyType[];
  handler: (controller: IController) => void;
}

export interface ContentView {
  getCanvas: () => HTMLCanvasElement;
  resize: () => void;
  render: (value: EventType) => boolean;
}
