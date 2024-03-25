import React, {
  FunctionComponent,
  useSyncExternalStore,
  useState,
  useMemo,
} from 'react';
import {
  classnames,
  DEFAULT_POSITION,
  MAX_NAME_LENGTH,
  sizeConfig,
  SHEET_ITEM_TEST_ID_PREFIX,
} from '@/util';
import { Button, Icon, SelectPopup } from '../components';
import { SheetBarContextMenu } from './SheetBarContextMenu';
import styles from './index.module.css';
import { IController } from '@/types';
import { sheetListStore, activeCellStore } from '@/containers/store';

interface Props {
  controller: IController;
}

const menuStyle = { width: 200, left: sizeConfig.largePadding };

export const SheetBarContainer: FunctionComponent<Props> = ({ controller }) => {
  const sheetList = useSyncExternalStore(
    sheetListStore.subscribe,
    sheetListStore.getSnapshot,
  );
  const realSheetList = useMemo(() => {
    return sheetList.filter((v) => !v.isHide);
  }, [sheetList]);
  const popupList = useMemo(() => {
    return sheetList
      .filter((v) => !v.isHide)
      .map((v) => ({ value: v.sheetId, label: v.name, disabled: false }));
  }, [sheetList]);

  const [popupActive, setPopupActive] = useState(false);
  const { sheetId: currentSheetId } = useSyncExternalStore(
    activeCellStore.subscribe,
    activeCellStore.getSnapshot,
  );
  const [menuPosition, setMenuPosition] = useState(DEFAULT_POSITION);
  const [editing, setEditing] = useState(false);

  const setSheetName = (sheetName: string) => {
    controller.renameSheet(sheetName);
    setEditing(false);
  };
  const handleContextMenu = (event: React.MouseEvent<HTMLDivElement>) => {
    event.preventDefault();
    const pos = (event.clientX || 0) - 30;
    setMenuPosition(pos);
    return false;
  };
  const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    event.stopPropagation();
    if (event.key === 'Enter') {
      const t = event.currentTarget.value;
      if (!t) {
        return;
      }
      setSheetName(t);
    }
  };
  const handleChange = (value: string) => {
    setPopupActive(false);
    if (!value) {
      return;
    }
    controller.setCurrentSheetId(value);
  };
  return (
    <div className={styles['sheet-bar-wrapper']}>
      <div>
        <Button
          onClick={() => setPopupActive((v) => !v)}
          className={styles['menu-button']}
        >
          <Icon name="menu" />
        </Button>
        {popupActive && (
          <SelectPopup
            data={popupList}
            onChange={handleChange}
            active
            position="top"
            style={menuStyle}
            value={currentSheetId}
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
          if (!isActive && !editing && tabColor) {
            style = { backgroundColor: tabColor };
          }
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
                />
              ) : (
                <React.Fragment>
                  {isActive && tabColor && (
                    <span
                      className={styles['sheet-bar-item-color']}
                      style={{ backgroundColor: tabColor }}
                    />
                  )}
                  <span className={styles['sheet-bar-item-text']}>
                    {item.name}
                  </span>
                </React.Fragment>
              )}
            </div>
          );
        })}
      </div>
      <Button
        onClick={() => controller.addSheet()}
        type="circle"
        className={styles['add-button']}
      >
        <Icon name="plus" />
      </Button>
      {menuPosition >= 0 && (
        <SheetBarContextMenu
          controller={controller}
          position={menuPosition}
          sheetList={sheetList}
          currentSheetId={currentSheetId}
          hideMenu={() => setMenuPosition(DEFAULT_POSITION)}
          editSheetName={() => setEditing(true)}
        />
      )}
    </div>
  );
};
SheetBarContainer.displayName = 'SheetBarContainer';
