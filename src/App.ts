import { h, SmartComponent } from './react';
import {
  CanvasContainer,
  SheetBarContainer,
  ToolbarContainer,
  FormulaBarContainer,
  ContextMenuContainer,
} from './containers';

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
