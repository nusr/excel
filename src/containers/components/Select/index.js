import React from 'react';
import { classnames } from '@/util';
import styles from './index.module.css';
export const Select = (props) => {
    const { data, value: activeValue, style = {}, onChange, getItemStyle = () => ({}), title, } = props;
    const handleChange = (event) => {
        onChange(event.currentTarget.value);
    };
    return (React.createElement("select", { onChange: handleChange, value: activeValue, style: style, name: "select", className: styles.selectList, title: title }, data.map((item) => {
        const value = typeof item === 'object' ? item.value : item;
        const label = typeof item === 'object' ? item.label : item;
        const disabled = typeof item === 'object' ? item.disabled : false;
        const itemStyle = getItemStyle(value);
        const cls = classnames(styles.selectItem, {
            [styles['disabled']]: disabled,
        });
        return (React.createElement("option", { key: value, value: value, disabled: !!disabled, className: cls, style: itemStyle }, label));
    })));
};
Select.displayName = 'Select';
//# sourceMappingURL=index.js.map