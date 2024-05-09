import { IController } from './controller';

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
  getCanvas: () => HTMLCanvasElement;
  resize: () => void;
  render: (params: ContentParams) => void;
  check(): void;
}
