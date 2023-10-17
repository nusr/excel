import React, { useSyncExternalStore, useState, } from 'react';
import { classnames } from '@/util';
import { theme, DEFAULT_POSITION } from '@/util';
import { Button, Icon } from '../components';
import { SheetBarContextMenu } from './SheetBarContextMenu';
import styles from './index.module.css';
import { sheetListStore, coreStore } from '@/containers/store';
export const SheetBarContainer = ({ controller }) => {
    const sheetList = useSyncExternalStore(sheetListStore.subscribe, sheetListStore.getSnapshot);
    const realSheetList = sheetList.filter((v) => !v.disabled);
    const { currentSheetId } = useSyncExternalStore(coreStore.subscribe, coreStore.getSnapshot);
    const [menuPosition, setMenuPosition] = useState(DEFAULT_POSITION);
    const [editing, setEditing] = useState(false);
    const setSheetName = (sheetName) => {
        controller.renameSheet(sheetName);
        setEditing(false);
    };
    const handleContextMenu = (event) => {
        event.preventDefault();
        const pos = (event.clientX || 0) - 30;
        setMenuPosition(pos);
        return false;
    };
    const handleKeyDown = (event) => {
        if (event.key === 'Enter') {
            event.stopPropagation();
            setSheetName(event.currentTarget.value);
        }
    };
    return (React.createElement("div", { className: styles['sheet-bar-wrapper'] },
        React.createElement("div", { className: styles['sheet-bar-list'], "data-testid": "sheet-bar-list" }, realSheetList.map((item) => {
            const isActive = currentSheetId === item.value;
            const showInput = isActive && editing;
            const cls = classnames(styles['sheet-bar-item'], {
                [styles['active']]: isActive,
            });
            return (React.createElement("div", { key: item.value, className: cls, onContextMenu: handleContextMenu, onClick: () => {
                    controller.setCurrentSheetId(String(item.value));
                } }, showInput ? (React.createElement("input", { className: styles['sheet-bar-input'], defaultValue: item.label, onKeyDown: handleKeyDown })) : (React.createElement("span", { className: styles['sheet-bar-item-text'] }, item.label))));
        })),
        React.createElement("div", { className: styles['sheet-bar-add'] },
            React.createElement(Button, { onClick: () => controller.addSheet(), type: "circle", style: { backgroundColor: theme.buttonActiveColor } },
                React.createElement(Icon, { name: "plus" }))),
        menuPosition >= 0 && (React.createElement(SheetBarContextMenu, { controller: controller, position: menuPosition, sheetList: sheetList, hideMenu: () => setMenuPosition(DEFAULT_POSITION), editSheetName: () => setEditing(true) }))));
};
SheetBarContainer.displayName = 'SheetBarContainer';
//# sourceMappingURL=index.js.map