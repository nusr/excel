import React, { useState, useMemo, memo, useCallback } from 'react';
import {
  classnames,
  DEFAULT_POSITION,
  MAX_NAME_LENGTH,
  SHEET_ITEM_TEST_ID_PREFIX,
} from '../../util';
import { SheetBarContextMenu } from './SheetBarContextMenu';
import styles from './index.module.css';
import { useCoreStore, useExcel } from '../../containers/store';
import { Popover } from '../../component/Popover';
import { Button } from '../../component/Button';
import { Menu as MenuIcon, Plus } from 'lucide-react';
import { MenuTrigger, Menu, MenuItem } from '../../component/Menu';

export const SheetBarContainer: React.FunctionComponent<React.PropsWithChildren> =
  memo(({ children }) => {
    const { controller } = useExcel();
    const sheetList = useCoreStore((s) => s.sheetList);
    const realSheetList = useMemo(() => {
      return sheetList.filter((v) => !v.isHide);
    }, [sheetList]);
    const popupList = useMemo(() => {
      return sheetList
        .filter((v) => !v.isHide)
        .map((v) => ({ value: v.sheetId, label: v.name }));
    }, [sheetList]);

    const currentSheetId = useCoreStore((s) => s.currentSheetId);
    const [menuPosition, setMenuPosition] = useState(DEFAULT_POSITION);
    const [editing, setEditing] = useState(false);

    const handleContextMenu = useCallback(
      (event: React.MouseEvent<HTMLDivElement>) => {
        event.preventDefault();
        const pos = event.clientX - 30;
        setMenuPosition(pos);
        return false;
      },
      [],
    );
    const handleKeyDown = useCallback(
      (event: React.KeyboardEvent<HTMLInputElement>) => {
        event.stopPropagation();
        if (event.key === 'Enter') {
          const t = event.currentTarget.value;
          setEditing(false);
          if (!t) {
            return;
          }
          controller.renameSheet(t);
        }
      },
      [],
    );
    const addSheet = useCallback(() => {
      controller.addSheet();
    }, []);
    const hideMenu = useCallback(() => {
      setMenuPosition(DEFAULT_POSITION);
    }, []);
    const editSheetName = useCallback(() => {
      setEditing(true);
    }, []);

    return (
      <div className={styles['sheet-bar-wrapper']} data-testid="sheet-bar">
        <MenuTrigger>
          <Button
            className={styles['menu-button']}
            data-testid="sheet-bar-select-sheet"
            aria-label="Select sheet"
          >
            <MenuIcon />
          </Button>
          <Popover>
            <Menu
              aria-label="Select sheet"
              data-testid="sheet-bar-select-sheet"
            >
              {popupList.map((item) => (
                <MenuItem
                  id={item.value}
                  key={item.value}
                  textValue={item.value}
                  onClick={() => {
                    if (currentSheetId === item.value) {
                      return;
                    }
                    controller.setCurrentSheetId(item.value);
                  }}
                >
                  {item.label}
                </MenuItem>
              ))}
            </Menu>
          </Popover>
        </MenuTrigger>
        <div className={styles['sheet-bar-list']} data-testid="sheet-bar-list">
          {realSheetList.map((item) => {
            const isActive = currentSheetId === item.sheetId;
            const showInput = isActive && editing;
            const tabColor = item.tabColor || '';
            const cls = classnames(styles['sheet-bar-item'], {
              [styles['active']]: isActive,
            });
            let style = undefined;
            if (!isActive && tabColor) {
              style = { backgroundColor: tabColor };
            }
            const testId = isActive ? 'sheet-bar-active-item' : undefined;
            return (
              <div
                data-testid={`${SHEET_ITEM_TEST_ID_PREFIX}${item.sheetId}`}
                key={item.sheetId}
                className={cls}
                style={style}
                onContextMenu={handleContextMenu}
                onClick={() => {
                  if (currentSheetId === item.sheetId) {
                    return;
                  }
                  setEditing(false);
                  controller.setCurrentSheetId(item.sheetId);
                }}
              >
                {showInput ? (
                  <input
                    className={styles['sheet-bar-input']}
                    defaultValue={item.name}
                    onKeyDown={handleKeyDown}
                    type="text"
                    spellCheck
                    maxLength={MAX_NAME_LENGTH}
                    data-testid="sheet-bar-rename-input"
                  />
                ) : (
                  <React.Fragment>
                    {isActive && tabColor && (
                      <span
                        className={styles['sheet-bar-item-color']}
                        style={{ backgroundColor: tabColor }}
                        data-testid="sheet-bar-tab-color-item"
                      />
                    )}
                    <span
                      className={styles['sheet-bar-item-text']}
                      data-testid={testId}
                    >
                      {item.name}
                    </span>
                  </React.Fragment>
                )}
              </div>
            );
          })}
        </div>
        <Button
          onClick={addSheet}
          style={{ marginLeft: 8 }}
          data-testid="sheet-bar-add-sheet"
          aria-label="Add sheet"
        >
          <Plus />
        </Button>
        {menuPosition >= 0 && (
          <SheetBarContextMenu
            position={menuPosition}
            sheetList={sheetList}
            currentSheetId={currentSheetId}
            hideMenu={hideMenu}
            editSheetName={editSheetName}
          />
        )}
        {children}
      </div>
    );
  });
SheetBarContainer.displayName = 'SheetBarContainer';

export default SheetBarContainer;
