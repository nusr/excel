import React, { useState, useMemo, memo, useCallback } from 'react';
import {
  classnames,
  DEFAULT_POSITION,
  MAX_NAME_LENGTH,
  SHEET_ITEM_TEST_ID_PREFIX,
} from '../../util';
import { Button, Icon, SelectPopup } from '../../components';
import { SheetBarContextMenu } from './SheetBarContextMenu';
import styles from './index.module.css';
import { useCoreStore, useExcel } from '../../containers/store';
import { useClickOutside } from '../hooks';

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
        .map((v) => ({ value: v.sheetId, label: v.name, disabled: false }));
    }, [sheetList]);

    const [popupActive, setPopupActive] = useState(false);
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
    const handleChange = useCallback((value: string) => {
      setPopupActive(false);
      controller.setCurrentSheetId(value);
    }, []);
    const addSheet = useCallback(() => {
      controller.addSheet();
    }, []);
    const hideMenu = useCallback(() => {
      setMenuPosition(DEFAULT_POSITION);
    }, []);
    const editSheetName = useCallback(() => {
      setEditing(true);
    }, []);
    const togglePopup = useCallback(() => {
      setPopupActive((v) => !v);
    }, []);

    const ref = useClickOutside(popupActive, () => {
      setPopupActive(false);
    });

    return (
      <div className={styles['sheet-bar-wrapper']} data-testid="sheet-bar">
        <div ref={ref}>
          <Button
            onClick={togglePopup}
            className={styles['menu-button']}
            testId="sheet-bar-select-sheet"
          >
            <Icon name="menu" />
          </Button>
          {popupActive && (
            <SelectPopup
              data={popupList}
              onChange={handleChange}
              active
              position="top"
              value={currentSheetId}
              testId="sheet-bar-select-sheet-popup"
              className={styles['select-popup']}
            />
          )}
        </div>
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
          type="circle"
          className={styles['add-button']}
          testId="sheet-bar-add-sheet"
        >
          <Icon name="plus" />
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
