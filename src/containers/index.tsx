import styles from './index.module.css';
import React, { memo, lazy, Suspense } from 'react';
import type { IController } from '@/types';

const FormulaBarContainer = lazy(() => import('./FormulaBar'));
const ToolbarContainer = lazy(() => import('./ToolBar'));
const CanvasContainer = lazy(() => import('./canvas'));
const SheetBarContainer = lazy(() => import('./SheetBar'));
const MenuBarContainer = lazy(() => import('./MenuBar'));

export interface AppProps {
  controller: IController;
}

export const App: React.FunctionComponent<AppProps> = memo(({ controller }) => {
  return (
    <div className={styles['app-container']} data-testid="app-container">
      <Suspense fallback={<div>loading</div>}>
        <MenuBarContainer controller={controller} />
        <ToolbarContainer controller={controller} />
        <FormulaBarContainer controller={controller} />
        <CanvasContainer controller={controller} />
        <SheetBarContainer controller={controller} />
      </Suspense>
    </div>
  );
});
App.displayName = 'App';
