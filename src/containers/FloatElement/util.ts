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
  rotate = 'rotate',
}
export type FloatElementPosition = {
  width: number;
  top: number;
  left: number;
  height: number;
  angle: number;
};
export type State = {
  active: boolean;
  moveStartX: number;
  moveStartY: number;
  resizeStartX: number;
  resizeStartY: number;
  resizePosition: string;
  position: FloatElementPosition;
};

export function computeElementSize(
  deltaX: number,
  deltaY: number,
  p: ResizePosition,
): CanvasOverlayPosition {
  let height = 0;
  let width = 0;
  let top = 0;
  let left = 0;
  if (
    [
      ResizePosition.topRight,
      ResizePosition.topLeft,
      ResizePosition.top,
    ].includes(p)
  ) {
    height -= deltaY;
    top += deltaY;
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
    left += deltaX;
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
    width,
    height,
    left,
    top,
  };
}

export const INITIAL_STATE: State = {
  active: false,
  resizeStartX: 0,
  resizeStartY: 0,
  resizePosition: '',
  moveStartX: 0,
  moveStartY: 0,
  position: {
    top: -1,
    left: -1,
    width: -1,
    height: -1,
    angle: 0,
  },
};
