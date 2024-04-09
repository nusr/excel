import React, {
  useEffect,
  useState,
  useRef,
  useSyncExternalStore,
  useMemo,
  memo,
  useCallback,
} from 'react';
import { IController } from '@/types';
import styles from './index.module.css';
import { parseReference, MAX_NAME_LENGTH } from '@/util';
import { scrollToView } from '@/canvas';
import { SelectList } from '../components';
import { defineNameStore } from '../store';

interface Props {
  controller: IController;
  displayName: string;
  defineName: string;
}

export const DefineName: React.FunctionComponent<Props> = memo(
  ({ controller, displayName, defineName }) => {
    const ref = useRef<HTMLInputElement>(null);

    const [value, setValue] = useState(displayName);
    const defineNameList = useSyncExternalStore(
      defineNameStore.subscribe,
      defineNameStore.getSnapshot,
    );
    const popupList = useMemo(() => {
      return defineNameList.map((v) => ({
        disabled: false,
        value: v,
        label: v,
      }));
    }, [defineNameList]);
    useEffect(() => {
      setValue(displayName);
    }, [displayName]);

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
          if (/^[a-zA-Z_][a-zA-Z0-9_.]*$/.test(t) && t.length <= 255) {
            controller.setDefineName(controller.getActiveCell(), t);
          } else {
            setValue(displayName);
          }
        }
      },
      [displayName],
    );
    const handleChange = useCallback(
      (event: React.ChangeEvent<HTMLInputElement>) => {
        setValue(event.target.value);
      },
      [],
    );
    const handleSelect = useCallback((value: string) => {
      const range = controller.checkDefineName(value);
      scrollToView(controller, range!);
    }, []);
    return (
      <SelectList
        testId="formula-bar-name"
        value={defineName}
        data={popupList}
        onChange={handleSelect}
        className={styles['defined-name']}
      >
        <input
          value={value}
          ref={ref}
          spellCheck
          type="text"
          onChange={handleChange}
          className={styles['defined-name-editor']}
          onKeyDown={handleKeyDown}
          maxLength={MAX_NAME_LENGTH * 8}
          data-testid="formula-bar-name-input"
        />
      </SelectList>
    );
  },
);

DefineName.displayName = 'DefineName';
