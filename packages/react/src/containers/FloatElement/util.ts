import { headerSizeSet, canvasSizeSet } from '@excel/shared';

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
  active = 'active',
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
  activeUuid: string;
  position: FloatElementPosition;
};

export const INITIAL_STATE: State = {
  resizePosition: '',
  moveStartX: 0,
  moveStartY: 0,
  activeUuid: '',
  position: {
    width: -1,
    height: -1,
    imageAngle: 0,
    top: -1,
    left: -1,
  },
};

export function roundPosition(top: number, left: number) {
  const size = headerSizeSet.get();
  const canvasSize = canvasSizeSet.get();
  const minTop = size.height;
  const minLeft = size.width;
  if (top < minTop) {
    top = minTop;
  }
  if (top > canvasSize.height) {
    top = canvasSize.height;
  }
  if (left < minLeft) {
    left = minLeft;
  }
  if (left > canvasSize.width) {
    left = canvasSize.width;
  }
  return {
    top,
    left,
  };
}
