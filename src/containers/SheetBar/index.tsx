import React, {
  FunctionComponent,
  useSyncExternalStore,
  useState,
} from 'react';
import { classnames, theme, DEFAULT_POSITION } from '@/util';
import { Button, Icon } from '../components';
import { SheetBarContextMenu } from './SheetBarContextMenu';
import styles from './index.module.css';
import { IController } from '@/types';
import { sheetListStore, coreStore } from '@/containers/store';

interface Props {
  controller: IController;
}

export const SheetBarContainer: FunctionComponent<Props> = ({ controller }) => {
  const sheetList = useSyncExternalStore(
    sheetListStore.subscribe,
    sheetListStore.getSnapshot,
  );
  // filter hide sheet
  const realSheetList = sheetList.filter((v) => !v.disabled);
  const { currentSheetId } = useSyncExternalStore(
    coreStore.subscribe,
    coreStore.getSnapshot,
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
      setSheetName(event.currentTarget.value);
    }
  };
  return (
    <div className={styles['sheet-bar-wrapper']}>
      <div className={styles['sheet-bar-list']} data-testid="sheet-bar-list">
        {realSheetList.map((item) => {
          const isActive = currentSheetId === item.value;
          const showInput = isActive && editing;
          const cls = classnames(styles['sheet-bar-item'], {
            [styles['active']]: isActive,
          });
          return (
            <div
              key={item.value}
              className={cls}
              onContextMenu={handleContextMenu}
              onClick={() => {
                setEditing(false);
                controller.setCurrentSheetId(String(item.value));
              }}
            >
              {showInput ? (
                <input
                  className={styles['sheet-bar-input']}
                  defaultValue={item.label}
                  onKeyDown={handleKeyDown}
                />
              ) : (
                <span className={styles['sheet-bar-item-text']}>
                  {item.label}
                </span>
              )}
            </div>
          );
        })}
      </div>
      <div className={styles['sheet-bar-add']}>
        <Button
          onClick={() => controller.addSheet()}
          type="circle"
          style={{ backgroundColor: theme.buttonActiveColor }}
        >
          <Icon name="plus" />
        </Button>
      </div>
      {menuPosition >= 0 && (
        <SheetBarContextMenu
          controller={controller}
          position={menuPosition}
          sheetList={sheetList}
          hideMenu={() => setMenuPosition(DEFAULT_POSITION)}
          editSheetName={() => setEditing(true)}
        />
      )}
    </div>
  );
};
SheetBarContainer.displayName = 'SheetBarContainer';
