import { h, SmartComponent, CSSProperties } from '@/react';
import { Button } from '@/components';

const defaultStyle: CSSProperties = {
  display: 'none',
};

export const ContextMenuContainer: SmartComponent = (state, controller) => {
  const { contextMenuPosition } = state;
  const style =
    contextMenuPosition === undefined
      ? defaultStyle
      : {
          top: contextMenuPosition.top,
          left: contextMenuPosition.left,
        };
  const hideContextMenu = () => {
    state.contextMenuPosition = undefined;
  };
  return h(
    'div',
    {
      className: 'context-menu',
      style,
    },
    Button(
      {
        onClick() {
          controller.addCol(controller.getActiveCell().col, 1);
          hideContextMenu();
        },
      },
      'add a column',
    ),
    Button(
      {
        onClick() {
          controller.deleteCol(controller.getActiveCell().col, 1);
          hideContextMenu();
        },
      },
      'delete a column',
    ),
    Button(
      {
        onClick() {
          controller.addRow(controller.getActiveCell().row, 1);
          hideContextMenu();
        },
      },
      'add a row',
    ),
    Button(
      {
        onClick() {
          controller.deleteRow(controller.getActiveCell().row, 1);
          hideContextMenu();
        },
      },
      'delete a row',
    ),
  );
};
ContextMenuContainer.displayName = 'ContextMenuContainer';
