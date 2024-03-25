import React, { CSSProperties, FunctionComponent } from 'react';
import { classnames } from '@/util';
import { OptionItem } from '@/types';
import styles from './index.module.css';
import { Icon } from '../BaseIcon';
import { useClickOutside } from '../../hooks';

export interface SelectProps {
  value?: string | number;
  defaultValue?: string | number;
  style?: CSSProperties;
  data: Array<string | number | OptionItem>;
  getItemStyle?: (value: string | number) => CSSProperties;
  onChange: (value: string | number) => void;
  title?: string;
  className?: string;
}

export const Select: FunctionComponent<SelectProps> = (props) => {
  const {
    data,
    value: activeValue,
    style = {},
    className,
    onChange,
    getItemStyle = () => ({}),
    title,
    defaultValue,
  } = props;
  const handleChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    onChange(event.currentTarget.value);
  };

  return (
    <select
      onChange={handleChange}
      value={activeValue}
      style={style}
      defaultValue={defaultValue}
      name="select"
      className={classnames(styles.selectList, className)}
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

export interface SelectPopupProps {
  active: boolean;
  value: string;
  data: Array<OptionItem>;
  onChange: (value: string) => void;
  className?: string;
  position?: 'top' | 'bottom';
  style?: React.CSSProperties;
}

export const SelectPopup: FunctionComponent<SelectPopupProps> = (props) => {
  const [ref] = useClickOutside(() => props.onChange(''));
  const handleSelect = (event: React.MouseEvent<HTMLDivElement>) => {
    const v = (event.target as any).dataset?.value;
    if (!v || v === props.value) {
      return;
    }
    props.onChange(v);
  };
  return (
    <div
      className={classnames(
        styles['popup-container'],
        props.position === 'top' ? styles.top : '',
        {
          [styles.active]: props.active,
        },
      )}
      onClick={handleSelect}
      ref={ref}
      style={props.style}
    >
      {props.data.map((v) => (
        <div key={v.value} className={styles['popup-item']}>
          <span className={styles['popup-item-content']} data-value={v.value}>
            {v.label}
          </span>
          <span className={styles['popup-item-icon']}>
            {v.value === props.value && <Icon name="confirm" />}
          </span>
        </div>
      ))}
    </div>
  );
};

SelectPopup.displayName = 'SelectPopup';
