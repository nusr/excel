import React, {
  FunctionComponent,
  useSyncExternalStore,
  useState,
} from 'react';
import { classnames, DEFAULT_POSITION } from '@/util';
import { Button, Icon } from '../components';
import { SheetBarContextMenu } from './SheetBarContextMenu';
import styles from './index.module.css';
import { IController } from '@/types';
import { sheetListStore, activeCellStore } from '@/containers/store';

interface Props {
  controller: IController;
}

export const SheetBarContainer: FunctionComponent<Props> = ({ controller }) => {
  const sheetList = useSyncExternalStore(
    sheetListStore.subscribe,
    sheetListStore.getSnapshot,
  );
  // filter hide sheet
  const realSheetList = sheetList.filter((v) => !v.isHide);
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
  return (
    <div className={styles['sheet-bar-wrapper']}>
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
      <div className={styles['sheet-bar-add']}>
        <Button
          onClick={() => controller.addSheet()}
          type="circle"
          className={styles['add-button']}
        >
          <Icon name="plus" />
        </Button>
      </div>
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
