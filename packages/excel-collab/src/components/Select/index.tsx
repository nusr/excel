import React, {
  FunctionComponent,
  memo,
  useEffect,
  useMemo,
  useState,
} from 'react';
import { classnames } from '../../util';
import { OptionItem } from '../../types';
import styles from './index.module.css';
import { Button } from '../../component/Button';
import { ChevronDown } from 'lucide-react';
import { MenuTrigger, Menu, MenuItem } from '../../component/Menu';

export interface SelectListProps {
  value: string;
  data: Array<OptionItem>;
  onChange: (value: string) => void;
  testId?: string;
  className?: string;
}

export const SelectList: FunctionComponent<
  React.PropsWithChildren<SelectListProps>
> = memo(({ children, value, data, onChange, testId, className }) => {
  const [selected, setSelected] = useState(value);

  useEffect(() => {
    setSelected(value);
  }, [value]);

  const selectedKeys = useMemo(() => [selected], [selected]);

  return (
    <div
      className={classnames(styles['select-list-container'], className)}
      data-testid={testId}
    >
      {children}
      <MenuTrigger>
        <Button
          className={styles['select-list-trigger']}
          data-testid={`${testId}-trigger`}
          aria-label="Select list trigger"
        >
          <ChevronDown />
        </Button>
        <Menu
          data-testid={`${testId}-popup`}
          selectionMode="single"
          selectedKeys={selectedKeys}
          onSelectionChange={(v) => {
            const selectedKey = typeof v === 'string' ? v : Array.from(v)[0];
            if (selectedKey == null) {
              return;
            }
            const temp = String(selectedKey);
            setSelected(temp);
            onChange(temp);
          }}
          aria-label="Select List"
        >
          {data.map((item) => (
            <MenuItem
              id={item.value}
              key={item.value}
              isDisabled={item.disabled}
              textValue={item.label}
            >
              {item.label}
            </MenuItem>
          ))}
        </Menu>
      </MenuTrigger>
    </div>
  );
});

SelectList.displayName = 'SelectList';
