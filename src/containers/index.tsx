import styles from './index.module.css';
import { memo } from 'react';
import FormulaBarContainer from './FormulaBar';
import ToolbarContainer from './ToolBar';
import CanvasContainer from './canvas';
import SheetBarContainer from './SheetBar';
import MenuBarContainer from './MenuBar';

export const App = memo(() => {
  return (
    <div className={styles['app-container']} data-testid="app-container">
      <MenuBarContainer />
      <ToolbarContainer />
      <FormulaBarContainer />
      <CanvasContainer />
      <SheetBarContainer />
    </div>
  );
});
App.displayName = 'App';

export { StateContext } from './store';
