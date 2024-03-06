import { CanvasOverlayPosition } from '@/types';

export enum ResizePosition {
  top = 'top',
  topRight = 'top-right',
  topLeft = 'top-left',
  bottom = 'bottom',
  bottomLeft = 'bottom-left',
  bottomRight = 'bottom-right',
  left = 'left',
  right = 'right',
}
export type State = {
  active: boolean;
  moveStartX: number;
  moveStartY: number;
  top: number;
  left: number;
  resizeStartX: number;
  resizeStartY: number;
  resizePosition: string;
  width: number;
  height: number;
};

export function computeElementSize(
  clientX: number,
  clientY: number,
  state: State,
): CanvasOverlayPosition {
  const deltaX = clientX - state.resizeStartX;
  const deltaY = clientY - state.resizeStartY;
  const p = state.resizePosition as ResizePosition;
  let height = state.height;
  let width = state.width;
  const top = state.top;
  const left = state.left;
  if (
    [
      ResizePosition.topRight,
      ResizePosition.topLeft,
      ResizePosition.top,
    ].includes(p)
  ) {
    height -= deltaY;
    // top = clientY - state.top;
  } else if (
    [
      ResizePosition.bottomRight,
      ResizePosition.bottom,
      ResizePosition.bottomLeft,
    ].includes(p)
  ) {
    height += deltaY;
  }

  if (
    [
      ResizePosition.topLeft,
      ResizePosition.bottomLeft,
      ResizePosition.left,
    ].includes(p)
  ) {
    width -= deltaX;
    // left = clientX - state.left;
  } else if (
    [
      ResizePosition.topRight,
      ResizePosition.bottomRight,
      ResizePosition.right,
    ].includes(p)
  ) {
    width += deltaX;
  }

  return {
    width: Math.floor(width),
    height: Math.floor(height),
    left: Math.floor(left),
    top: Math.floor(top),
  };
}

export const INITIAL_STATE: State = {
  active: false,
  resizeStartX: 0,
  resizeStartY: 0,
  resizePosition: '',
  moveStartX: 0,
  moveStartY: 0,
  top: -1,
  left: -1,
  width: 0,
  height: 0,
};
