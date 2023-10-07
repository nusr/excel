import React, { useRef } from 'react';
import { Button, Dialog, Select } from '../components';
import { IController, OptionItem } from '@/types';
import styles from './index.module.css';
import { useClickOutside } from '../hooks';

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
  const [ref] = useClickOutside(hideMenu);
  const hideSheetList = controller.getSheetList().filter((v) => v.isHide);
  const optionList: OptionItem[] = hideSheetList.map((item) => ({
    value: item.sheetId,
    label: item.name,
    disabled: false,
  }));
  const refStore = useRef<string>(String(optionList?.[0]?.value || ''));
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
      <Dialog
        dialogContent={
          <Select
            data={optionList}
            onChange={(value) => (refStore.current = String(value))}
            style={{ width: 300 }}
            value={undefined}
          ></Select>
        }
        title="Unhide sheet:"
        onOk={() => {
          controller.unhideSheet(refStore.current);
          hideMenu();
          refStore.current = '';
        }}
        onCancel={hideMenu}
      >
        <Button
          dataType="unhideSheet"
          className={styles['sheet-bar-unhide']}
          disabled={optionList.length === 0}
        >
          Unhide
        </Button>
      </Dialog>
    </div>
  );
};
SheetBarContextMenu.displayName = 'SheetBarContextMenu';
