import React, { useEffect, useState, useRef, useMemo, memo, useCallback } from 'react';
import styles from './index.module.css';
import {
  parseReference,
  MAX_NAME_LENGTH,
  MAX_PARAMS_COUNT,
  DEFINED_NAME_REG_EXP,
} from '../../util';
import { scrollToView } from '../../canvas';
import { useCoreStore, useExcel } from '../store';
import { TextField } from '../../component/TextField';
import { Button } from '../../component/Button';
import { Menu, MenuItem, MenuTrigger } from '../../component/Menu';
import { ChevronDown } from 'lucide-react';

interface Props {
  displayName: string;
  defineName: string;
}

export const DefineName: React.FunctionComponent<Props> = memo(({ displayName, defineName }) => {
  const { controller } = useExcel();
  const ref = useRef<HTMLInputElement>(null);

  const [value, setValue] = useState(displayName);
  const [selected, setSelected] = useState(defineName);
  const defineNameList = useCoreStore((s) => s.defineNames);
  const popupList = useMemo(() => {
    return defineNameList.map((v) => ({
      value: v,
      label: v,
    }));
  }, [defineNameList]);
  useEffect(() => {
    setValue(displayName);
  }, [displayName]);
  useEffect(() => {
    setSelected(defineName);
  }, [defineName]);

  const handleKeyDown = useCallback(
    (event: React.KeyboardEvent<HTMLInputElement>) => {
      event.stopPropagation();
      if (event.key === 'Enter') {
        const t = event.currentTarget.value.trim().toLowerCase();
        ref.current?.blur();
        if (!t) {
          setValue(displayName);
          return;
        }
        const range = controller.checkDefineName(t);
        if (range) {
          setValue(displayName);
          scrollToView(controller, range);
          return;
        }
        const r = parseReference(t, (sheetName: string) => {
          const list = controller.getSheetList();
          const item = list.find((v) => v.name.toLowerCase() === sheetName.toLowerCase());
          return item?.sheetId || '';
        });
        const sheetInfo = controller.getSheetInfo(r?.sheetId || controller.getCurrentSheetId());
        if (!sheetInfo) {
          return;
        }
        if (r && r.col < sheetInfo.colCount && r.row < sheetInfo.rowCount) {
          r.sheetId = r.sheetId || controller.getCurrentSheetId();
          setValue(displayName);
          scrollToView(controller, r);
          return;
        }
        if (DEFINED_NAME_REG_EXP.test(t) && t.length <= MAX_PARAMS_COUNT) {
          controller.setDefineName(controller.getActiveRange().range, t);
        } else {
          setValue(displayName);
        }
      }
    },
    [displayName],
  );
  const handleChange = useCallback((nextValue: string) => setValue(nextValue), []);
  const handleSelect = useCallback((value: string) => {
    setSelected(value);
    const range = controller.checkDefineName(value);
    if (!range) {
      return;
    }
    scrollToView(controller, range!);
  }, []);
  return (
    <div data-testid="formula-bar-name" className={styles['defined-name-select']}>
      <TextField
        className={styles['defined-name-field']}
        inputClassName={styles['defined-name-editor']}
        aria-label="Defined name"
        value={value}
        onChange={handleChange}
        inputProps={{
          'data-testid': 'formula-bar-name-input',
          spellCheck: 'true',
          onKeyDown: handleKeyDown,
          maxLength: MAX_NAME_LENGTH * 8,
        }}
        inputRef={ref}
      />
      <MenuTrigger>
        <Button data-testid="formula-bar-name-trigger" aria-label="Select list trigger">
          <ChevronDown />
        </Button>
        <Menu
          data-testid="formula-bar-name-popup"
          selectionMode="single"
          selectedKeys={[selected]}
          onSelectionChange={(selection) => {
            const selectedKey =
              typeof selection === 'string' ? selection : Array.from(selection)[0];
            if (selectedKey != null) handleSelect(String(selectedKey));
          }}
          aria-label="Select List"
        >
          {popupList.map((item) => (
            <MenuItem id={item.value} key={item.value} textValue={item.label}>
              {item.label}
            </MenuItem>
          ))}
        </Menu>
      </MenuTrigger>
    </div>
  );
});

DefineName.displayName = 'DefineName';
