import React from 'react';
import { createPortal } from 'react-dom';
import { Button } from '../Button';
import styles from './index.module.css';
import { classnames } from '@/util';
export const Dialog = (props) => {
    const { children, title, dialogStyle, onCancel, onOk, visible } = props;
    if (!visible) {
        return null;
    }
    const dialog = (React.createElement("div", { className: classnames(styles['dialog-modal']) },
        React.createElement("div", { className: styles['dialog-container'], style: dialogStyle },
            React.createElement("div", { className: styles['dialog-title'] }, title),
            React.createElement("div", { className: styles['dialog-content'] }, children),
            React.createElement("div", { className: styles['dialog-button'] },
                React.createElement(Button, { onClick: onCancel }, "Cancel"),
                React.createElement(Button, { onClick: onOk, className: styles['dialog-cancel'] }, "Confirm")))));
    return createPortal(dialog, document.body);
};
Dialog.displayName = 'Dialog';
//# sourceMappingURL=index.js.map