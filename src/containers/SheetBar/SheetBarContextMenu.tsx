import React, { useMemo, memo } from 'react';
import { Button, Select, info, ColorPicker } from '../components';
import { IController, OptionItem } from '@/types';
import styles from './index.module.css';
import { useClickOutside } from '../hooks';
import { SheetItem } from '../store';
import { $ } from '@/i18n';

interface Props {
  controller: IController;
  position: number;
  sheetList: SheetItem[];
  currentSheetId: string;
  hideMenu: () => void;
  editSheetName: () => void;
}

export const SheetBarContextMenu: React.FunctionComponent<Props> = memo(
  ({
    controller,
    position,
    sheetList,
    currentSheetId,
    hideMenu,
    editSheetName,
  }) => {
    const [ref] = useClickOutside(() => {
      hideMenu();
    });
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
        children: (
          <Select
            data={hideSheetList}
            onChange={(v) => (value = String(v))}
            style={{ width: 300 }}
            defaultValue={value}
          />
        ),
        onCancel: hideMenu,
        onOk() {
          controller.unhideSheet(value);
          hideMenu();
        },
      });
    };
    const handleTabColorChange = (color: string) => {
      controller.setTabColor(color);
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
          {$('insert')}
        </Button>
        <Button
          onClick={() => {
            hideMenu();
            controller.deleteSheet();
          }}
        >
          {$('delete')}
        </Button>
        <Button
          onClick={() => {
            hideMenu();
            editSheetName();
          }}
        >
          {$('rename')}
        </Button>
        <Button
          onClick={() => {
            hideMenu();
            controller.hideSheet();
          }}
        >
          {$('hide')}
        </Button>
        <Button
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
        >
          <Button className={styles['sheet-bar-unhide']}>
            {$('tab-color')}
          </Button>
        </ColorPicker>
      </div>
    );
  },
);
SheetBarContextMenu.displayName = 'SheetBarContextMenu';
