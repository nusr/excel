import React, { CSSProperties, FunctionComponent } from 'react';
import { classnames } from '@/util';
import { OptionItem } from '@/types';
import styles from './index.module.css';

export type SelectProps = {
  value?: string | number;
  style?: CSSProperties;
  data: Array<string | number | OptionItem>;
  getItemStyle?: (value: string | number) => CSSProperties;
  onChange: (value: string | number) => void;
  title?: string;
};

export const Select: FunctionComponent<SelectProps> = (props) => {
  const {
    data,
    value: activeValue,
    style = {},
    onChange,
    getItemStyle = () => ({}),
    title,
  } = props;
  const handleChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    onChange(event.currentTarget.value);
  };
  return (
    <select
      onChange={handleChange}
      value={activeValue}
      style={style}
      name="select"
      className={styles.selectList}
      title={title}
    >
      {data.map((item) => {
        const value = typeof item === 'object' ? item.value : item;
        const label = typeof item === 'object' ? item.label : item;
        const disabled = typeof item === 'object' ? item.disabled : false;
        const itemStyle = getItemStyle(value);
        const cls = classnames(styles.selectItem, {
          [styles['disabled']]: disabled,
        });
        return (
          <option
            key={value}
            value={value}
            disabled={!!disabled}
            className={cls}
            style={itemStyle}
          >
            {label}
          </option>
        );
      })}
    </select>
  );
};
Select.displayName = 'Select';
