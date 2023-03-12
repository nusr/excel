import { h, SmartComponent } from '@/react';
import { CanvasContainer } from './canvas';
import { ContextMenuContainer } from './ContextMenu';
import { FormulaBarContainer } from './FormulaBar';
import { ToolbarContainer } from './ToolBar';
import { SheetBarContainer } from './SheetBar';

export const App: SmartComponent = (state, controller) => {
  return h(
    'div',
    {
      className: 'app-container',
    },
    ToolbarContainer(state, controller),
    FormulaBarContainer(state, controller),
    CanvasContainer(state, controller),
    SheetBarContainer(state, controller),
    ContextMenuContainer(state, controller),
  );
};
App.displayName = 'App';
