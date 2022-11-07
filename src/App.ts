import { h, Component } from '@/react';
import {
  CanvasContainer,
  SheetBarContainer,
  ToolbarContainer,
  FormulaBarContainer,
} from '@/containers';

export const App: Component = () => {
  return h(
    'div',
    {
      className: 'app-container',
    },
    ToolbarContainer({}),
    FormulaBarContainer({}),
    CanvasContainer({}),
    SheetBarContainer({}),
  );
};
App.displayName = 'App';
