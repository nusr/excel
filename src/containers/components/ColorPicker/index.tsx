import React, {
  FunctionComponent,
  useState,
  memo,
  useCallback,
} from 'react';
import { classnames, COLOR_PICKER_COLOR_LIST } from '@/util';
import styles from './index.module.css';
import { ColorPickerPanel } from './ColorPickerPanel';
import { Button } from '../Button';
import { useClickOutside } from '../../hooks';
import { $ } from '@/i18n';

export interface ColorPickerProps {
  color: string;
  onChange: (value: string) => void;
  className?: string;
  position?: 'top' | 'bottom';
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
  const [ref] = useClickOutside(() => {
    setVisible(false);
  });
  const openColorPicker = useCallback(() => {
    setVisible(true);
  }, []);
  const reset = useCallback(() => {
    onChange('');
  }, []);
  const handleClick = useCallback((event: React.MouseEvent<HTMLDivElement>) => {
    const color = (event.target as any)?.dataset?.value;
    if (color) {
      onChange(color);
    }
  }, []);
  return (
    <div
      className={classnames(
        styles['color-picker'],
        className,
        position === 'top' ? styles['top'] : '',
      )}
      ref={ref}
    >
      <div
        className={styles['color-picker-trigger']}
        style={{ color }}
        onClick={openColorPicker}
      >
        {children}
      </div>
      <div
        className={classnames(styles['color-picker-wrapper'], {
          [styles['show']]: visible,
        })}
      >
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
          <ColorPickerPanel color={color} onChange={onChange} testId={testId} />
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
    </div>
  );
});
ColorPicker.displayName = 'ColorPicker';
