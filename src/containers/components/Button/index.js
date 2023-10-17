import React from 'react';
import { classnames } from '@/util';
import styles from './index.module.css';
export const Button = (props) => {
    const { className = '', onClick = () => { }, disabled = false, active = false, type = 'normal', style = {}, testId = undefined, title, dataType, buttonType, children, } = props;
    const cls = classnames(styles.buttonWrapper, className, {
        [styles['disabled']]: disabled,
        [styles['active']]: active,
        [styles['circle']]: type === 'circle',
    });
    return (React.createElement("button", { onClick: onClick, style: style, title: title, className: cls, "data-testid": testId, "data-type": dataType, type: buttonType }, children));
};
Button.displayName = 'Button';
//# sourceMappingURL=index.js.map