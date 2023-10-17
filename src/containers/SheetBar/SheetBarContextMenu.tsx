import React, { useMemo, useState, useRef } from 'react';
import { Button, Dialog, Select } from '../components';
import { IController, OptionItem } from '@/types';
import styles from './index.module.css';
import { useClickOutside } from '../hooks';

type Props = {
  controller: IController;
  position: number;
  sheetList: OptionItem[];
  hideMenu: () => void;
  editSheetName: () => void;
};

export const SheetBarContextMenu: React.FunctionComponent<Props> = ({
  controller,
  position,
  sheetList,
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
  const hideSheetList: OptionItem[] = useMemo(() => {
    return sheetList
      .filter((v) => v.disabled)
      .map((item) => ({ value: String(item.value), label: item.label }));
  }, [sheetList]);
  const [value, setValue] = useState(String(hideSheetList[0]?.value) || '');
  const hideDialog = () => {
    setVisible(false);
    hideMenu();
  };
  return (
    <div
      className={styles['sheet-bar-context-menu']}
      style={{ left: position }}
      ref={ref}
      data-testid="sheet-bar-context-menu"
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
        title="Unhide sheet:"
        onOk={() => {
          controller.unhideSheet(value);
          hideDialog();
        }}
        onCancel={hideDialog}
      >
        <Select
          data={hideSheetList}
          onChange={(value) => setValue(String(value))}
          style={{ width: 300 }}
          value={value}
        />
      </Dialog>
    </div>
  );
};
SheetBarContextMenu.displayName = 'SheetBarContextMenu';
