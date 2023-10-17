import React, { useMemo } from 'react';
import { Button } from '../components';
import styles from './index.module.css';
import { useClickOutside } from '../hooks';
const MENU_WIDTH = 110;
const MENU_HEIGHT = 142;
export const ContextMenu = (props) => {
    const { controller, top, left, hideContextMenu } = props;
    const [ref] = useClickOutside(hideContextMenu);
    const style = useMemo(() => {
        let realTop = top;
        let realLeft = left;
        const gap = 18;
        if (realTop + MENU_HEIGHT > window.innerHeight) {
            realTop = window.innerHeight - MENU_HEIGHT - gap;
        }
        if (realLeft + MENU_WIDTH > window.innerWidth) {
            realLeft = window.innerWidth - MENU_WIDTH - gap;
        }
        return {
            top: realTop,
            left: realLeft,
        };
    }, [top, left]);
    return (React.createElement("div", { className: styles['context-menu'], "data-testid": "context-menu", style: style, ref: ref },
        React.createElement(Button, { onClick: () => {
                hideContextMenu();
                controller.addCol(controller.getActiveCell().col, 1);
            } }, "add a column"),
        React.createElement(Button, { onClick: () => {
                hideContextMenu();
                controller.deleteCol(controller.getActiveCell().col, 1);
            } }, "delete a column"),
        React.createElement(Button, { onClick: () => {
                hideContextMenu();
                controller.addRow(controller.getActiveCell().row, 1);
            } }, "add a row"),
        React.createElement(Button, { onClick: () => {
                hideContextMenu();
                controller.deleteRow(controller.getActiveCell().row, 1);
            } }, "delete a row"),
        React.createElement(Button, { onClick: () => {
                hideContextMenu();
                controller.copy();
            } }, "copy"),
        React.createElement(Button, { onClick: () => {
                hideContextMenu();
                controller.cut();
            } }, "cut"),
        React.createElement(Button, { onClick: () => {
                hideContextMenu();
                controller.paste();
            } }, "paste")));
};
ContextMenu.displayName = 'ContextMenuContainer';
//# sourceMappingURL=ContextMenu.js.map