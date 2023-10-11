import React, { useMemo, useState, useSyncExternalStore, useRef } from 'react';
import { Button, Dialog, Select } from '../components';
import { IController, OptionItem } from '@/types';
import styles from './index.module.css';
import { useClickOutside } from '../hooks';
import { sheetListStore } from '../store';

type Props = {
  controller: IController;
  position: number;
  hideMenu: () => void;
  editSheetName: () => void;
};

export const SheetBarContextMenu: React.FunctionComponent<Props> = ({
  controller,
  position,
  hideMenu,
  editSheetName,
}) => {
  const [visible, setVisible] = useState(false);
  const refState = useRef(visible);
  refState.current = visible;
  const [ref] = useClickOutside(() => {
    if (refState.current) {
      return;
    }
    hideMenu();
  });
  const sheetList = useSyncExternalStore(
    sheetListStore.subscribe,
    sheetListStore.getSnapshot,
  );
  const hideSheetList: OptionItem[] = useMemo(() => {
    return sheetList
      .filter((v) => v.disabled)
      .map((item) => ({ value: String(item.value), label: item.label }));
  }, [sheetList]);
  const [value, setValue] = useState('');
  const hideDialog = () => {
    setVisible(false);
    hideMenu();
  };
  if (position < 0) {
    return null;
  }
  return (
    <div
      className={styles['sheet-bar-context-menu']}
      style={{ left: position }}
      ref={ref}
    >
      <Button
        onClick={() => {
          hideMenu();
          controller.addSheet();
        }}
      >
        Insert
      </Button>
      <Button
        onClick={() => {
          hideMenu();
          controller.deleteSheet();
        }}
      >
        Delete
      </Button>
      <Button
        onClick={() => {
          hideMenu();
          editSheetName();
        }}
      >
        Rename
      </Button>
      <Button
        onClick={() => {
          hideMenu();
          controller.hideSheet();
        }}
      >
        Hide
      </Button>
      <Button
        dataType="unhideSheet"
        className={styles['sheet-bar-unhide']}
        disabled={hideSheetList.length === 0}
        onClick={() => {
          setVisible(true);
        }}
      >
        Unhide
      </Button>
      <Dialog
        visible={visible}
        content={
          <Select
            data={hideSheetList}
            onChange={(value) => setValue(String(value))}
            style={{ width: 300 }}
            value={value}
          />
        }
        title="Unhide sheet:"
        onOk={() => {
          const val = value || String(hideSheetList[0]?.value) || '';
          controller.unhideSheet(val);
          hideDialog();
        }}
        onCancel={hideDialog}
      />
    </div>
  );
};
SheetBarContextMenu.displayName = 'SheetBarContextMenu';
