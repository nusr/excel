import React, { useMemo, useState, useRef } from 'react';
import { Button, Dialog, Select } from '../components';
import styles from './index.module.css';
import { useClickOutside } from '../hooks';
export const SheetBarContextMenu = ({ controller, position, sheetList, hideMenu, editSheetName, }) => {
    const [visible, setVisible] = useState(false);
    const refState = useRef(visible);
    refState.current = visible;
    const [ref] = useClickOutside(() => {
        if (refState.current) {
            return;
        }
        hideMenu();
    });
    const hideSheetList = useMemo(() => {
        return sheetList
            .filter((v) => v.disabled)
            .map((item) => ({ value: String(item.value), label: item.label }));
    }, [sheetList]);
    const [value, setValue] = useState(String(hideSheetList[0]?.value) || '');
    const hideDialog = () => {
        setVisible(false);
        hideMenu();
    };
    return (React.createElement("div", { className: styles['sheet-bar-context-menu'], style: { left: position }, ref: ref, "data-testid": "sheet-bar-context-menu" },
        React.createElement(Button, { onClick: () => {
                hideMenu();
                controller.addSheet();
            } }, "Insert"),
        React.createElement(Button, { onClick: () => {
                hideMenu();
                controller.deleteSheet();
            } }, "Delete"),
        React.createElement(Button, { onClick: () => {
                hideMenu();
                editSheetName();
            } }, "Rename"),
        React.createElement(Button, { onClick: () => {
                hideMenu();
                controller.hideSheet();
            } }, "Hide"),
        React.createElement(Button, { dataType: "unhideSheet", className: styles['sheet-bar-unhide'], disabled: hideSheetList.length === 0, onClick: () => {
                setVisible(true);
            } }, "Unhide"),
        React.createElement(Dialog, { visible: visible, title: "Unhide sheet:", onOk: () => {
                controller.unhideSheet(value);
                hideDialog();
            }, onCancel: hideDialog },
            React.createElement(Select, { data: hideSheetList, onChange: (value) => setValue(String(value)), style: { width: 300 }, value: value }))));
};
SheetBarContextMenu.displayName = 'SheetBarContextMenu';
//# sourceMappingURL=SheetBarContextMenu.js.map