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

export interface MainView {
  render(data: EventType) : Promise<void>;
  resize(): void;
}


