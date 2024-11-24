import React, { useMemo, memo } from 'react';
import { Button, Select, info, ColorPicker, toast } from '../../components';
import { OptionItem } from '@/types';
import styles from './index.module.css';
import { useClickOutside } from '../hooks';
import { SheetItem, useExcel } from '../store';
import { $ } from '@/i18n';

interface Props {
  position: number;
  sheetList: SheetItem[];
  currentSheetId: string;
  hideMenu: () => void;
  editSheetName: () => void;
}

export const SheetBarContextMenu: React.FunctionComponent<Props> = memo(
  ({ position, sheetList, currentSheetId, hideMenu, editSheetName }) => {
    const { controller } = useExcel();
    const ref = useClickOutside(hideMenu);
    const tabColor = useMemo(() => {
      return (
        sheetList.find((v) => v.sheetId === currentSheetId)?.tabColor || ''
      );
    }, [sheetList, currentSheetId]);
    const hideSheetList: OptionItem[] = useMemo(() => {
      return sheetList
        .filter((v) => v.isHide)
        .map((item) => ({
          value: String(item.sheetId),
          label: item.name,
          disabled: false,
        }));
    }, [sheetList]);
    const handleUnhide = () => {
      let value = String(hideSheetList[0]?.value) || '';
      info({
        visible: true,
        title: $('unhide-sheet'),
        testId: 'sheet-bar-context-menu-unhide-dialog',
        children: (
          <Select
            data={hideSheetList}
            onChange={(v) => {
              value = String(v);
            }}
            className={styles['unhide-select']}
            defaultValue={value}
            testId="sheet-bar-context-menu-unhide-dialog-select"
          />
        ),
        onCancel: hideMenu,
        onOk() {
          if (!value) {
            return toast.error($('sheet-id-can-not-be-empty'));
          }
          controller.unhideSheet(value);
          hideMenu();
        },
      });
    };
    const handleTabColorChange = (color: string) => {
      controller.updateSheetInfo({ tabColor: color });
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
          testId="sheet-bar-context-menu-insert"
          onClick={() => {
            hideMenu();
            controller.addSheet();
          }}
        >
          {$('insert')}
        </Button>
        <Button
          testId="sheet-bar-context-menu-delete"
          onClick={() => {
            hideMenu();
            controller.deleteSheet();
          }}
        >
          {$('delete')}
        </Button>
        <Button
          testId="sheet-bar-context-menu-rename"
          onClick={() => {
            hideMenu();
            editSheetName();
          }}
        >
          {$('rename')}
        </Button>
        <Button
          testId="sheet-bar-context-menu-hide"
          onClick={() => {
            hideMenu();
            controller.hideSheet();
          }}
        >
          {$('hide')}
        </Button>
        <Button
          testId="sheet-bar-context-menu-unhide"
          className={styles['sheet-bar-unhide']}
          disabled={hideSheetList.length === 0}
          onClick={handleUnhide}
        >
          {$('unhide')}
        </Button>
        <ColorPicker
          color={tabColor}
          onChange={handleTabColorChange}
          position="top"
          testId="sheet-bar-context-menu-tab-color"
        >
          <Button
            className={styles['sheet-bar-unhide']}
            testId="sheet-bar-context-menu-tab-color"
          >
            {$('tab-color')}
          </Button>
        </ColorPicker>
      </div>
    );
  },
);
SheetBarContextMenu.displayName = 'SheetBarContextMenu';
