import type { CanvasOverlayPosition } from './components';
export type ChangeEventType = 'contentChange' | 'selectionChange';

export type IWindowSize = {
  width: number;
  height: number;
};

export type EventType = {
  changeSet: Set<ChangeEventType>;
  width: number;
  height: number;
  selectAll?: CanvasOverlayPosition;
};
