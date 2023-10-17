import { classnames } from '@/util';
import styles from './BaseIcon.module.css';
import React from 'react';
export const BaseIcon = ({ className = '', paths = [], }) => {
    return (React.createElement("svg", { className: classnames(styles.baseIcon, className), viewBox: "0 0 1137 1024", "aria-hidden": true }, paths.map((item, i) => (React.createElement("path", { d: item.d, key: i, fillOpacity: item['fill-opacity'] })))));
};
BaseIcon.displayName = 'BaseIcon';
//# sourceMappingURL=BaseIcon.js.map