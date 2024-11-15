import { type EventHandler, type EventData, type ModalValue } from '@/types';
import { PointerEvent } from 'react';
import { FILTER_RECT_SIZE } from '@/util';

export class FilterHandler implements EventHandler {
  pointerDown(data: EventData, event: PointerEvent<HTMLCanvasElement>) {
    if (!data.position) {
      return false;
    }
    const { controller, position } = data;
    const { row, col, marginX, marginY } = position;
    const filter = controller.getFilter();
    if (!filter) {
      return false;
    }
    const { range } = filter;
    if (col >= range.col && col < range.col + range.colCount) {
      const height = controller.getRowHeight(row);
      const width = controller.getColWidth(col);
      if (
        marginX > width - FILTER_RECT_SIZE &&
        marginY > height - FILTER_RECT_SIZE
      ) {
        event.stopPropagation();
        const result: ModalValue = {
          type: 'filter',
          row,
          col,
          x: event.clientX,
          y: event.clientY,
        };
        return result;
      }
    }

    return false;
  }
  pointerMove() {
    return false;
  }
}
