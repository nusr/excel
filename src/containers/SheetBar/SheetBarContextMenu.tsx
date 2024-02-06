import React, { useMemo } from 'react';
import { Button, Select, info } from '../components';
import { IController, OptionItem } from '@/types';
import styles from './index.module.css';
import { useClickOutside } from '../hooks';

interface Props {
  controller: IController;
  position: number;
  sheetList: OptionItem[];
  hideMenu: () => void;
  editSheetName: () => void;
}

export const SheetBarContextMenu: React.FunctionComponent<Props> = ({
  controller,
  position,
  sheetList,
  hideMenu,
  editSheetName,
}) => {
  const [ref] = useClickOutside(() => {
    hideMenu();
  });
  const hideSheetList: OptionItem[] = useMemo(() => {
    return sheetList
      .filter((v) => v.disabled)
      .map((item) => ({
        value: String(item.value),
        label: item.label,
        disabled: false,
      }));
  }, [sheetList]);
  const handleUnhide = () => {
    let value = String(hideSheetList[0]?.value) || '';
    info({
      visible: true,
      title: 'Unhide sheet:',
      children: (
        <Select
          data={hideSheetList}
          onChange={(v) => (value = String(v))}
          style={{ width: 300 }}
          value={value}
        />
      ),
      onCancel: hideMenu,
      onOk() {
        controller.unhideSheet(value);
        hideMenu();
      },
    });
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
        onClick={handleUnhide}
      >
        Unhide
      </Button>
    </div>
  );
};
SheetBarContextMenu.displayName = 'SheetBarContextMenu';
