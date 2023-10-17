import React, { useSyncExternalStore } from 'react';
import { Icon, Button, ColorPicker, Github, Select, FillColorIcon, } from '../components';
import { FONT_SIZE_LIST, QUERY_ALL_LOCAL_FONT, LOCAL_FONT_KEY, isSupportFontFamily, } from '@/util';
import { EUnderLine } from '@/types';
import styles from './index.module.css';
import { activeCellStore, fontFamilyStore } from '@/containers/store';
import { Import, Export } from '../Excel';
const underlineList = [
    {
        value: EUnderLine.NONE,
        label: 'none',
    },
    {
        value: EUnderLine.SINGLE,
        label: 'single underline',
    },
    {
        value: EUnderLine.DOUBLE,
        label: 'double underline',
    },
];
export const ToolbarContainer = ({ controller, }) => {
    const activeCell = useSyncExternalStore(activeCellStore.subscribe, activeCellStore.getSnapshot);
    const fontFamilyList = useSyncExternalStore(fontFamilyStore.subscribe, fontFamilyStore.getSnapshot);
    const getItemStyle = (value) => {
        return {
            fontFamily: String(value),
            fontSize: '16px',
        };
    };
    const setCellStyle = (value) => {
        const cellData = controller.getCell(controller.getActiveCell());
        const styleData = cellData.style || {};
        controller.setCellStyle(Object.assign(styleData, value), [
            controller.getActiveCell(),
        ]);
    };
    const { isBold, isItalic, fontSize, fontColor = '', fillColor = '', isWrapText, underline, fontFamily, } = activeCell;
    const handleFontFamilyChange = (value) => {
        const t = String(value);
        if (t === QUERY_ALL_LOCAL_FONT) {
            window.queryLocalFonts().then((list) => {
                let fontList = list.map((v) => v.fullName);
                fontList = Array.from(new Set(fontList)).filter((v) => isSupportFontFamily(v));
                fontList.sort((a, b) => a.localeCompare(b));
                localStorage.setItem(LOCAL_FONT_KEY, JSON.stringify(fontList));
                const l = fontList.map((v) => ({
                    label: v,
                    value: v,
                    disabled: false,
                }));
                fontFamilyStore.setState(l);
            });
        }
        else {
            setCellStyle({ fontFamily: String(value) });
        }
    };
    return (React.createElement("div", { className: styles['toolbar-wrapper'], "data-testid": "toolbar" },
        React.createElement(Button, { disabled: !controller.canUndo, onClick: () => controller.undo(), testId: "toolbar-undo" },
            React.createElement(Icon, { name: "undo" })),
        React.createElement(Button, { disabled: !controller.canRedo, onClick: () => controller.redo(), testId: "toolbar-redo" },
            React.createElement(Icon, { name: "redo" })),
        React.createElement(Import, { controller: controller }),
        React.createElement(Export, { controller: controller }),
        React.createElement(Button, { onClick: () => controller.copy(), testId: "toolbar-copy" }, "Copy"),
        React.createElement(Button, { onClick: () => controller.cut(), testId: "toolbar-cut" }, "Cut"),
        React.createElement(Button, { onClick: () => controller.paste(), testId: "toolbar-paste" }, "Paste"),
        React.createElement(Select, { data: fontFamilyList, value: fontFamily, style: {
                width: 140,
            }, getItemStyle: getItemStyle, onChange: handleFontFamilyChange }),
        React.createElement(Select, { data: FONT_SIZE_LIST, value: fontSize, onChange: (value) => setCellStyle({ fontSize: Number(value) }) }),
        React.createElement(Button, { active: isBold, onClick: () => setCellStyle({ isBold: !isBold }), testId: "toolbar-bold", title: "Bold" },
            React.createElement(Icon, { name: "bold" })),
        React.createElement(Button, { active: isItalic, onClick: () => setCellStyle({ isItalic: !isItalic }), testId: "toolbar-italic", title: "Italic" },
            React.createElement(Icon, { name: "italic" })),
        React.createElement(Select, { data: underlineList, value: underline, style: { width: 130 }, title: "Underline", onChange: (value) => setCellStyle({ underline: Number(value) }) }),
        React.createElement(ColorPicker, { key: "fill-color", color: fillColor, onChange: (value) => setCellStyle({ fillColor: value }) },
            React.createElement(FillColorIcon, null)),
        React.createElement(ColorPicker, { key: "font-color", color: fontColor, onChange: (value) => setCellStyle({ fontColor: value }) },
            React.createElement(Icon, { name: "fontColor" })),
        React.createElement(Button, { active: isWrapText, onClick: () => setCellStyle({ isWrapText: !isWrapText }), testId: "toolbar-wrap-text", style: { minWidth: 80 } }, "Wrap Text"),
        React.createElement(Github, null)));
};
ToolbarContainer.displayName = 'ToolbarContainer';
//# sourceMappingURL=index.js.map