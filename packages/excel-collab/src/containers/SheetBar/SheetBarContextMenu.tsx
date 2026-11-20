import React, { memo, Fragment, useMemo, useState } from 'react';
import { Dialog } from '../../components';
import styles from './index.module.css';
import { useClickOutside } from '../hooks';
import { SheetItem, useExcel } from '../store';
import i18n from '../../i18n';
import { Select, SelectItem } from '../../component/Select';
import { queue } from '../../component/Toast';
import { Menu, MenuItem } from '../../component/Menu';
import { ColorPicker } from '../../component/ColorPicker';

interface Props {
  position: number;
  sheetList: SheetItem[];
  currentSheetId: string;
  hideMenu: () => void;
  editSheetName: () => void;
}

export const SheetBarContextMenu: React.FunctionComponent<Props> = memo(
  ({ position, sheetList, hideMenu, editSheetName }) => {
    const { controller } = useExcel();
    const [isOpen, onOpenChange] = useState(false);
    const [sheetId, setSheetId] = useState('');
    const ref = useClickOutside(true, hideMenu);
    const hideSheetList = useMemo(() => {
      return sheetList
        .filter((v) => v.isHide)
        .map((item) => ({
          value: String(item.sheetId),
          label: item.name,
        }));
    }, [sheetList]);
    const handleUnhide = () => {
      const t = String(hideSheetList[0]?.value) || '';
      setSheetId(t);
      onOpenChange(true);
    };
    const handleTabColorChange = (color: unknown) => {
      controller.updateSheetInfo({ tabColor: String(color) });
      hideMenu();
    };
    return (
      <Fragment>
        <div
          className={styles['sheet-bar-context-menu']}
          style={{ left: position }}
          ref={ref}
          data-testid="sheet-bar-context-menu"
        >
          <Menu aria-label="Sheet Bar Context Menu">
            <MenuItem
              data-testid="sheet-bar-context-menu-insert"
              onPress={() => {
                hideMenu();
                controller.addSheet();
              }}
              textValue={i18n.t('insert')}
            >
              {i18n.t('insert')}
            </MenuItem>
            <MenuItem
              data-testid="sheet-bar-context-menu-delete"
              onPress={() => {
                hideMenu();
                controller.deleteSheet();
              }}
              textValue={i18n.t('delete')}
            >
              {i18n.t('delete')}
            </MenuItem>
            <MenuItem
              data-testid="sheet-bar-context-menu-rename"
              onPress={() => {
                hideMenu();
                editSheetName();
              }}
              textValue={i18n.t('rename')}
            >
              {i18n.t('rename')}
            </MenuItem>
            <MenuItem
              data-testid="sheet-bar-context-menu-hide"
              onPress={() => {
                hideMenu();
                controller.hideSheet();
              }}
              textValue={i18n.t('hide')}
            >
              {i18n.t('hide')}
            </MenuItem>
            <MenuItem
              data-testid="sheet-bar-context-menu-unhide"
              isDisabled={hideSheetList.length === 0}
              onPress={handleUnhide}
              textValue={i18n.t('unhide')}
            >
              {i18n.t('unhide')}
            </MenuItem>
            <MenuItem
              data-testid="sheet-bar-context-menu-tab-color"
              textValue={i18n.t('tab-color')}
            >
              <ColorPicker
                onChange={(color) => handleTabColorChange(color.toString('hex'))}
                label={i18n.t('tab-color')}
                data-testid="sheet-bar-context-menu-tab-color"
              />
            </MenuItem>
          </Menu>
        </div>
        <Dialog
          title={i18n.t('unhide-sheet')}
          isOpen={isOpen}
          onOpenChange={onOpenChange}
          onOk={() => {
            if (!sheetId) {
              queue.add({ title: i18n.t('sheet-id-can-not-be-empty') });
              return false;
            }
            controller.unhideSheet(sheetId);
            return true;
          }}
        >
          <Select
            data-testid="sheet-bar-context-menu-unhide-dialog-select"
            value={sheetId}
            onChange={(v) => {
              setSheetId(String(v));
            }}
            aria-label="Select sheet to unhide"
          >
            {hideSheetList.map((item) => (
              <SelectItem key={item.value} id={item.value} aria-label={item.label}>
                {item.label}
              </SelectItem>
            ))}
          </Select>
        </Dialog>
      </Fragment>
    );
  },
);
SheetBarContextMenu.displayName = 'SheetBarContextMenu';
