import React, {
  CSSProperties,
  FunctionComponent,
  memo,
  useCallback,
  useState,
} from 'react';
import { classnames } from '@/util';
import { OptionItem } from '@/types';
import styles from './index.module.css';
import { Icon } from '../BaseIcon';
import { useClickOutside } from '../../hooks';
import { Button } from '../Button';

export interface SelectProps {
  value?: string | number;
  defaultValue?: string | number;
  data: Array<string | number | OptionItem>;
  getItemStyle?: (value: string | number) => CSSProperties;
  onChange: (value: string | number) => void;
  title?: string;
  className?: string;
  testId?: string;
}

export const Select: FunctionComponent<SelectProps> = memo((props) => {
  const {
    data,
    value: activeValue,
    className,
    onChange,
    getItemStyle,
    title,
    defaultValue,
    testId,
  } = props;
  const handleChange = useCallback(
    (event: React.ChangeEvent<HTMLSelectElement>) => {
      onChange(event.target.value);
    },
    [],
  );

  return (
    <select
      onChange={handleChange}
      value={activeValue}
      defaultValue={defaultValue}
      name="select"
      className={classnames(styles.selectList, className)}
      title={title}
      data-testid={testId}
    >
      {data.map((item) => {
        const value = typeof item === 'object' ? item.value : item;
        const label = typeof item === 'object' ? item.label : item;
        const disabled = typeof item === 'object' ? item.disabled : false;
        let itemStyle = undefined;
        if (typeof getItemStyle === 'function') {
          itemStyle = getItemStyle(value);
        }
        return (
          <option
            key={value}
            value={value}
            disabled={!!disabled}
            className={classnames(styles.selectItem, {
              [styles['disabled']]: disabled,
            })}
            style={itemStyle}
          >
            {label}
          </option>
        );
      })}
    </select>
  );
});
Select.displayName = 'Select';

export interface SelectPopupProps {
  active: boolean;
  value: string;
  data: Array<OptionItem>;
  onChange: (value: string) => void;
  position?: 'top' | 'bottom';
  testId?: string;
  className?: string;
}

export const SelectPopup: FunctionComponent<SelectPopupProps> = memo(
  ({
    onChange,
    value,
    active,
    data,
    className,
    position = 'bottom',
    testId,
  }) => {
    const [ref] = useClickOutside(() => onChange(''));
    const handleSelect = useCallback(
      (event: React.MouseEvent<HTMLDivElement>) => {
        const v = (event.target as any).dataset?.value;
        if (!v || v === value) {
          return;
        }
        onChange(v);
      },
      [onChange, value],
    );
    return (
      <div
        className={classnames(
          styles['popup-container'],
          className,
          position === 'top' ? styles.top : '',
          {
            [styles.active]: active,
          },
        )}
        onClick={handleSelect}
        ref={ref}
        data-testid={testId}
      >
        {data.map((v) => (
          <div key={v.value} className={styles['popup-item']}>
            <span className={styles['popup-item-content']} data-value={v.value}>
              {v.label}
            </span>
            <span
              className={classnames(styles['popup-item-icon'], {
                [styles.active]: v.value === value,
              })}
            >
              <Icon name="confirm" />
            </span>
          </div>
        ))}
      </div>
    );
  },
);

SelectPopup.displayName = 'SelectPopup';

export type SelectListProps = Omit<SelectPopupProps, 'active'>;

export const SelectList: FunctionComponent<
  React.PropsWithChildren<SelectListProps>
> = memo(({ children, value, data, onChange, position, testId, className }) => {
  const [active, setActive] = useState(false);
  const handleClick = useCallback(() => {
    setActive((v) => !v);
  }, []);
  const handleChange = useCallback(
    (value: string) => {
      setActive(false);
      if (value) {
        onChange(value);
      }
    },
    [onChange],
  );
  return (
    <div
      className={classnames(styles['select-list-container'], className, {
        [styles.active]: active,
      })}
      data-testid={testId}
    >
      {children}
      <Button
        className={styles['select-list-trigger']}
        onClick={handleClick}
        testId={`${testId}-trigger`}
        type="plain"
      >
        <Icon name="down"></Icon>
      </Button>
      {active && data.length > 0 && (
        <SelectPopup
          active
          value={value}
          data={data}
          onChange={handleChange}
          position={position}
          testId={`${testId}-popup`}
        />
      )}
    </div>
  );
});

SelectList.displayName = 'SelectList';
