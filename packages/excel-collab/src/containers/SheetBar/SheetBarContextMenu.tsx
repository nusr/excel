import React, { memo, Fragment, useMemo, useState } from 'react';
import { Dialog } from '../../components';
import styles from './index.module.css';
import { useClickOutside } from '../hooks';
import { SheetItem, useExcel } from '../store';
import i18n from '../../i18n';
import { Select, SelectItem } from '../../component/Select';
import { queue } from '../../component/Toast';
import { COLOR_PICKER_COLOR_LIST } from '../../util';
import { Menu, MenuItem, SubmenuTrigger } from '../../component/Menu';

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
            <SubmenuTrigger>
              <MenuItem data-testid="sheet-bar-context-menu-tab-color" textValue={i18n.t('tab-color')}>
                {i18n.t('tab-color')}
              </MenuItem>
              <Menu aria-label="Tab Color Menu">
                {COLOR_PICKER_COLOR_LIST.map((color) => (
                  <MenuItem
                    key={color}
                    id={color}
                    onPress={() => handleTabColorChange(color)}
                    textValue={color}
                  >
                    <span
                      aria-hidden="true"
                      style={{
                        backgroundColor: color,
                        border: '1px solid currentColor',
                        display: 'inline-block',
                        height: 14,
                        marginRight: 8,
                        width: 14,
                      }}
                    />
                    {color}
                  </MenuItem>
                ))}
              </Menu>
            </SubmenuTrigger>
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
              <SelectItem
                key={item.value}
                id={item.value}
                aria-label={item.label}
              >
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
