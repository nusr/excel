import React, { FunctionComponent, useState, memo, useCallback } from 'react';
import { classnames, COLOR_PICKER_COLOR_LIST } from '@/util';
import styles from './index.module.css';
import { ColorPickerPanel } from './ColorPickerPanel';
import { Button } from '../Button';
import { useClickOutside } from '../../containers/hooks';
import { $ } from '@/i18n';

export interface ColorPickerProps {
  color: string;
  onChange: (value: string) => void;
  className?: string;
  position?: 'top' | 'bottom' | 'right';
  testId?: string;
}

export const ColorPicker: FunctionComponent<
  React.PropsWithChildren<ColorPickerProps>
> = memo((props) => {
  const {
    onChange,
    children,
    color,
    position = 'bottom',
    testId,
    className,
  } = props;
  const [visible, setVisible] = useState(false);
  const ref = useClickOutside(() => {
    setVisible(false);
  }, visible);
  const openColorPicker = useCallback(() => {
    setVisible(true);
  }, []);
  const reset = useCallback(() => {
    onChange('');
  }, []);
  const handleClick = useCallback((event: React.MouseEvent<HTMLDivElement>) => {
    const color = (event.target as { dataset?: { value?: string } })?.dataset
      ?.value;
    if (color) {
      onChange(color);
    }
  }, []);
  return (
    <div
      className={classnames(styles['color-picker'], className, {
        [styles.top]: position === 'top',
        [styles.right]: position === 'right',
      })}
      ref={ref}
    >
      <div
        className={styles['color-picker-trigger']}
        onClick={openColorPicker}
        data-testid={`${testId}-trigger`}
      >
        {children}
      </div>
      {visible && (
        <div className={classnames(styles['color-picker-wrapper'])}>
          <div
            className={styles['color-picker-list']}
            onClick={handleClick}
            data-testid={`${testId}-list`}
          >
            {COLOR_PICKER_COLOR_LIST.map((item) => {
              return (
                <div
                  key={item}
                  className={styles['color-picker-item']}
                  style={{ backgroundColor: item }}
                  data-value={item}
                />
              );
            })}
          </div>
          <div>
            <ColorPickerPanel
              color={color}
              onChange={onChange}
              testId={testId}
            />
          </div>
          <div>
            <Button
              type="normal"
              className={styles.reset}
              onClick={reset}
              testId={`${testId}-reset`}
            >
              {$('reset')}
            </Button>
          </div>
        </div>
      )}
    </div>
  );
});
ColorPicker.displayName = 'ColorPicker';
