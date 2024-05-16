import { CanvasContainer } from './canvas';
import { FormulaBarContainer } from './FormulaBar';
import { ToolbarContainer } from './ToolBar';
import { SheetBarContainer } from './SheetBar';
import styles from './index.module.css';
import React, { memo } from 'react';
import type { IController } from '@/types';
import { MenuBarContainer } from './MenuBar';

export interface AppProps {
  controller: IController;
}

export const App: React.FunctionComponent<AppProps> = memo(({ controller }) => {
  return (
    <div className={styles['app-container']} data-testid="app-container">
      <MenuBarContainer controller={controller} />
      <ToolbarContainer controller={controller} />
      <FormulaBarContainer controller={controller} />
      <CanvasContainer controller={controller} />
      <SheetBarContainer controller={controller} />
    </div>
  );
});
App.displayName = 'App';
