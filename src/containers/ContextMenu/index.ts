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
      '新增一列',
    ),
    Button(
      {
        onClick() {
          controller.addRow(controller.getActiveCell().row, 1);
          hideContextMenu();
        },
      },
      '新增一行',
    ),
  );
};
ContextMenuContainer.displayName = 'ContextMenuContainer';
