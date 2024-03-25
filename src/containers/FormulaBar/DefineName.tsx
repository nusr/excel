import React, {
  useEffect,
  useState,
  useRef,
  useSyncExternalStore,
  useMemo,
} from 'react';
import { IController } from '@/types';
import styles from './index.module.css';
import { classnames, parseReference, MAX_NAME_LENGTH } from '@/util';
import { scrollToView } from '@/canvas';
import { Button, Icon, SelectPopup } from '../components';
import { defineNameStore } from '../store';

interface Props {
  controller: IController;
  displayName: string;
  defineName: string;
}

export const DefineName: React.FunctionComponent<Props> = ({
  controller,
  displayName,
  defineName,
}) => {
  const ref = useRef<HTMLInputElement>(null);

  const [value, setValue] = useState(displayName);
  const [active, setActive] = useState(false);
  const defineNameList = useSyncExternalStore(
    defineNameStore.subscribe,
    defineNameStore.getSnapshot,
  );
  const popupList = useMemo(() => {
    return defineNameList.map((v) => ({ disabled: false, value: v, label: v }));
  }, [defineNameList]);
  useEffect(() => {
    setValue(displayName);
  }, [displayName]);

  const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    event.stopPropagation();
    if (event.key === 'Enter') {
      const t = event.currentTarget.value.trim().toLowerCase();
      if (!t) {
        return;
      }
      ref.current?.blur();
      const range = controller.checkDefineName(t);
      if (range) {
        setValue(displayName);
        scrollToView(controller, range);
        return;
      }
      const r = parseReference(t, (sheetName: string) => {
        const list = controller.getSheetList();
        const item = list.find((v) => v.name === sheetName);
        return item?.sheetId || '';
      });
      const sheetInfo = controller.getSheetInfo(
        r?.sheetId || controller.getCurrentSheetId(),
      )!;
      if (r && r.col < sheetInfo.colCount && r.row < sheetInfo.rowCount) {
        r.sheetId = r.sheetId || controller.getCurrentSheetId();
        setValue(displayName);
        scrollToView(controller, r);
        return;
      }
      if (/^[a-zA-Z_][a-zA-Z0-9_]*$/.test(t) && t.length <= 255) {
        controller.setDefineName(controller.getActiveCell(), t);
      } else {
        setValue(displayName);
      }
    }
  };
  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setValue(event.currentTarget.value);
  };
  const handleClick = () => {
    setActive((v) => !v);
  };
  const handleSelect = (value: string) => {
    setActive(false);
    if (!value) {
      return;
    }
    const range = controller.checkDefineName(value);
    if (!range) {
      return;
    }
    scrollToView(controller, range);
  };
  return (
    <div
      className={classnames(styles['formula-bar-name'], {
        [styles.active]: active,
      })}
      data-testid="formula-bar-name"
    >
      <input
        value={value}
        ref={ref}
        spellCheck
        type="text"
        onChange={handleChange}
        className={styles['formula-bar-name-editor']}
        onKeyDown={handleKeyDown}
        maxLength={MAX_NAME_LENGTH * 8}
      />
      <Button
        className={styles['formula-bar-name-select']}
        onClick={handleClick}
      >
        <Icon name="down"></Icon>
      </Button>
      <SelectPopup
        active={active}
        value={defineName}
        data={popupList}
        onChange={handleSelect}
      />
    </div>
  );
};
