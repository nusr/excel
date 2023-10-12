import React, { useMemo, useSyncExternalStore } from 'react';
import { Button } from '../components';
import { IController } from '@/types';
import styles from './index.module.css';
import { contextMenuStore } from '@/containers/store';
import { DEFAULT_POSITION } from '@/util';
import { useClickOutside } from '../hooks';

type Props = {
  controller: IController;
};

const MENU_WIDTH = 110;
const MENU_HEIGHT = 142;

export const ContextMenuContainer: React.FunctionComponent<Props> = ({
  controller,
}) => {
  const contextMenuPosition = useSyncExternalStore(
    contextMenuStore.subscribe,
    contextMenuStore.getSnapshot,
  );
  const hideContextMenu = () => {
    contextMenuStore.mergeState({
      top: DEFAULT_POSITION,
      left: DEFAULT_POSITION,
    });
  };
  const [ref] = useClickOutside(hideContextMenu);
  const style = useMemo(() => {
    // recompute menu position
    let top = contextMenuPosition.top;
    let left = contextMenuPosition.left;
    const gap = 18;
    if (top + MENU_HEIGHT > window.innerHeight) {
      top = window.innerHeight - MENU_HEIGHT - gap;
    }
    if (left + MENU_WIDTH > window.innerWidth) {
      left = window.innerWidth - MENU_WIDTH - gap;
    }
    return {
      top,
      left,
    };
  }, [contextMenuPosition]);
  const showContextMenu =
    contextMenuPosition.top >= 0 && contextMenuPosition.left >= 0;
  if (!showContextMenu) {
    return null;
  }

  return (
    <div
      className={styles['context-menu']}
      data-testid="context-menu"
      style={style}
      ref={ref}
    >
      <Button
        onClick={() => {
          hideContextMenu();
          controller.addCol(controller.getActiveCell().col, 1);
        }}
      >
        add a column
      </Button>
      <Button
        onClick={() => {
          hideContextMenu();
          controller.deleteCol(controller.getActiveCell().col, 1);
        }}
      >
        delete a column
      </Button>
      <Button
        onClick={() => {
          hideContextMenu();
          controller.addRow(controller.getActiveCell().row, 1);
        }}
      >
        add a row
      </Button>
      <Button
        onClick={() => {
          hideContextMenu();
          controller.deleteRow(controller.getActiveCell().row, 1);
        }}
      >
        delete a row
      </Button>
      <Button
        onClick={() => {
          hideContextMenu();
          controller.copy();
        }}
      >
        copy
      </Button>
      <Button
        onClick={() => {
          hideContextMenu();
          controller.cut();
        }}
      >
        cut
      </Button>
      <Button
        onClick={() => {
          hideContextMenu();
          controller.paste();
        }}
      >
        paste
      </Button>
    </div>
  );
};
ContextMenuContainer.displayName = 'ContextMenuContainer';
