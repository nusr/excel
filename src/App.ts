import { h } from '@/react';
import {
  CanvasContainer,
  SheetBarContainer,
  ToolbarContainer,
  FormulaBarContainer,
} from '@/containers';
import { SmartComponent } from '@/types';

export const App: SmartComponent = (state, controller) => {
  return h(
    'div',
    {
      className: 'app-container',
    },
    ToolbarContainer(state, controller),
    FormulaBarContainer(state, controller),
    CanvasContainer({}),
    SheetBarContainer(state, controller),
  );
};
App.displayName = 'App';
