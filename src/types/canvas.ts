import { IController } from './controller';
import { EventType } from './model';

export type ModifierKeyType = 'alt' | 'shift' | 'ctrl' | 'meta';
export interface KeyboardEventItem {
  key: string;
  modifierKey: ModifierKeyType[];
  handler: (controller: IController) => void;
}

export type ContentParams = {
  endRow: number;
  endCol: number;
  contentHeight: number;
  contentWidth: number;
};

export interface ContentView {
  render: (params: ContentParams) => void;
  check(): void;
}

export interface MainView {
  render: (data: EventType) => void;
  resize(): void;
}
