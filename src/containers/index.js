import { CanvasContainer } from './canvas';
import { FormulaBarContainer } from './FormulaBar';
import { ToolbarContainer } from './ToolBar';
import { SheetBarContainer } from './SheetBar';
import styles from './index.module.css';
import React from 'react';
export const App = ({ controller }) => {
    return (React.createElement("div", { className: styles['app-container'] },
        React.createElement(ToolbarContainer, { controller: controller }),
        React.createElement(FormulaBarContainer, { controller: controller }),
        React.createElement(CanvasContainer, { controller: controller }),
        React.createElement(SheetBarContainer, { controller: controller })));
};
App.displayName = 'App';
//# sourceMappingURL=index.js.map