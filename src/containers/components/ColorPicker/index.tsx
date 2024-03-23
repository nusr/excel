import React, { FunctionComponent, CSSProperties, useState } from 'react';
import { classnames } from '@/util';
import styles from './index.module.css';
import { ColorPickerPanel } from './ColorPickerPanel';
import { COLOR_LIST } from './color';
import { Button } from '../Button';
import { useClickOutside } from '../../hooks';
import { $ } from '@/i18n';

export interface ColorPickerProps {
  color: string;
  style?: CSSProperties;
  onChange: (value: string) => void;
  position?: 'top' | 'bottom';
}

export const ColorPicker: FunctionComponent<
  React.PropsWithChildren<ColorPickerProps>
> = (props) => {
  const { style = {}, onChange, children, color, position = 'bottom' } = props;
  const [visible, setVisible] = useState(false);
  const [ref] = useClickOutside(() => {
    setVisible(false);
  });
  return (
    <div
      className={classnames(
        styles['color-picker'],
        position === 'top' ? styles['top'] : '',
      )}
      style={style}
      ref={ref}
    >
      <div
        className={styles['color-picker-trigger']}
        style={{ color }}
        onClick={() => setVisible(true)}
      >
        {children}
      </div>
      <div
        className={classnames(styles['color-picker-wrapper'], {
          [styles['show']]: visible,
        })}
      >
        <div className={styles['color-picker-list']}>
          {COLOR_LIST.map((item) => {
            return (
              <div
                key={item}
                className={styles['color-picker-item']}
                style={{ backgroundColor: item }}
                onClick={() => {
                  onChange(item);
                }}
              ></div>
            );
          })}
        </div>
        <div>
          <ColorPickerPanel
            color={color}
            onChange={(c) => {
              onChange(c);
            }}
          />
        </div>
        <div>
          <Button
            type="normal"
            className={styles.reset}
            onClick={() => {
              onChange('');
            }}
          >
            {$('reset')}
          </Button>
        </div>
      </div>
    </div>
  );
};
ColorPicker.displayName = 'ColorPicker';
