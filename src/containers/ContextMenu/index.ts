import { h, SmartComponent, CSSProperties } from '@/react';

const defaultStyle: CSSProperties = {
  display: 'none',
};

export const ContextMenuContainer: SmartComponent = (state) => {
  const { contextMenuPosition } = state;
  const style =
    contextMenuPosition === undefined
      ? defaultStyle
      : {
          top: contextMenuPosition.top,
          left: contextMenuPosition.left,
        };
  return h(
    'div',
    {
      className: 'context-menu',
      style,
    },
    'context-menu',
  );
};
ContextMenuContainer.displayName = 'ContextMenuContainer';
