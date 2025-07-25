import React, { useMemo, memo } from 'react';
import { Button, Select, info, ColorPicker, toast } from '../../components';
import { OptionItem } from '../../types';
import styles from './index.module.css';
import { useClickOutside } from '../hooks';
import { SheetItem, useExcel } from '../store';
import i18n from '../../i18n';

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
    const ref = useClickOutside(true, hideMenu);
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
        title: i18n.t('unhide-sheet'),
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
            return toast.error(i18n.t('sheet-id-can-not-be-empty'));
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
          {i18n.t('insert')}
        </Button>
        <Button
          testId="sheet-bar-context-menu-delete"
          onClick={() => {
            hideMenu();
            controller.deleteSheet();
          }}
        >
          {i18n.t('delete')}
        </Button>
        <Button
          testId="sheet-bar-context-menu-rename"
          onClick={() => {
            hideMenu();
            editSheetName();
          }}
        >
          {i18n.t('rename')}
        </Button>
        <Button
          testId="sheet-bar-context-menu-hide"
          onClick={() => {
            hideMenu();
            controller.hideSheet();
          }}
        >
          {i18n.t('hide')}
        </Button>
        <Button
          testId="sheet-bar-context-menu-unhide"
          className={styles['sheet-bar-unhide']}
          disabled={hideSheetList.length === 0}
          onClick={handleUnhide}
        >
          {i18n.t('unhide')}
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
            {i18n.t('tab-color')}
          </Button>
        </ColorPicker>
      </div>
    );
  },
);
SheetBarContextMenu.displayName = 'SheetBarContextMenu';
