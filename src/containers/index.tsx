import { CanvasContainer } from './canvas';
import { FormulaBarContainer } from './FormulaBar';
import { ToolbarContainer } from './ToolBar';
import { SheetBarContainer } from './SheetBar';
import styles from './index.module.css';
import React from 'react';
import type { IController } from '@/types';

type Props = {
  controller: IController;
};

export const App: React.FunctionComponent<Props> = ({ controller }) => {
  return (
    <div className={styles['app-container']}>
      <ToolbarContainer controller={controller} />
      <FormulaBarContainer controller={controller} />
      <CanvasContainer controller={controller} />
      <SheetBarContainer controller={controller} />
    </div>
  );
};
App.displayName = 'App';
