import React, { useRef, useEffect } from 'react';
import { DEFAULT_FONT_COLOR, makeFont, DEFAULT_FONT_SIZE, isEmpty, } from '@/util';
import styles from './index.module.css';
export function getEditorStyle(data) {
    const { style } = data;
    const cellPosition = {
        top: data.top,
        left: data.left,
        width: data.width,
        height: data.height,
    };
    if (isEmpty(style)) {
        return cellPosition;
    }
    const font = makeFont(style?.isItalic ? 'italic' : 'normal', style?.isBold ? 'bold' : '500', style?.fontSize || DEFAULT_FONT_SIZE, style?.fontFamily);
    return {
        ...cellPosition,
        backgroundColor: style?.fillColor || 'inherit',
        color: style?.fontColor || DEFAULT_FONT_COLOR,
        font,
    };
}
export const FormulaEditor = ({ controller, initValue, style, }) => {
    const ref = useRef(null);
    useEffect(() => {
        if (!ref.current) {
            return;
        }
        controller.setMainDom({ input: ref.current });
    }, []);
    return (React.createElement("input", { className: styles['base-editor'], ref: ref, defaultValue: initValue, type: "text", style: style }));
};
FormulaEditor.displayName = 'FormulaEditor';
//# sourceMappingURL=FormulaEditor.js.map