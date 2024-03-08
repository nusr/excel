import { CanvasOverlayPosition, IController } from '@/types';

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
  imageAngle: number;
};
export type State = {
  moveStartX: number;
  moveStartY: number;
  resizePosition: string;
  position: FloatElementPosition;
  uuid: string;
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
  resizePosition: '',
  moveStartX: 0,
  moveStartY: 0,
  position: {
    top: -1,
    left: -1,
    width: -1,
    height: -1,
    imageAngle: 0,
  },
  uuid: '',
};

export function roundPosition(
  top: number,
  left: number,
  controller: IController,
) {
  const size = controller.getHeaderSize();
  const minTop = size.height;
  const minLeft = size.width;
  if (top < minTop) {
    top = minTop;
  }
  if (left < minLeft) {
    left = minLeft;
  }
  return {
    top,
    left,
  };
}
