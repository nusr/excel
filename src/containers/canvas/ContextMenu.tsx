import React, { useMemo } from 'react';
import { Button } from '../components';
import { IController } from '@/types';
import styles from './index.module.css';
import { useClickOutside } from '../hooks';

type Props = {
  controller: IController;
  top: number;
  left: number;
  hideContextMenu: () => void;
};

const MENU_WIDTH = 110;
const MENU_HEIGHT = 142;

export const ContextMenu: React.FunctionComponent<Props> = (props) => {
  const { controller, top, left, hideContextMenu } = props;
  const [ref] = useClickOutside(hideContextMenu);
  const style = useMemo(() => {
    // recompute menu position
    let realTop = top;
    let realLeft = left;
    const gap = 18;
    if (realTop + MENU_HEIGHT > window.innerHeight) {
      realTop = window.innerHeight - MENU_HEIGHT - gap;
    }
    if (realLeft + MENU_WIDTH > window.innerWidth) {
      realLeft = window.innerWidth - MENU_WIDTH - gap;
    }
    return {
      top: realTop,
      left: realLeft,
    };
  }, [top, left]);

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
        Add a column
      </Button>
      <Button
        onClick={() => {
          hideContextMenu();
          controller.deleteCol(controller.getActiveCell().col, 1);
        }}
      >
        Delete a column
      </Button>
      <Button
        onClick={() => {
          hideContextMenu();
          controller.hideCol(controller.getActiveCell().col, 1);
        }}
      >
        Hide a column
      </Button>
      <Button
        onClick={() => {
          hideContextMenu();
          controller.addRow(controller.getActiveCell().row, 1);
        }}
      >
        Add a row
      </Button>
      <Button
        onClick={() => {
          hideContextMenu();
          controller.deleteRow(controller.getActiveCell().row, 1);
        }}
      >
        Delete a row
      </Button>
      <Button
        onClick={() => {
          hideContextMenu();
          controller.hideRow(controller.getActiveCell().row, 1);
        }}
      >
        Hide a row
      </Button>

      <Button
        onClick={() => {
          hideContextMenu();
          controller.copy();
        }}
      >
        Copy
      </Button>
      <Button
        onClick={() => {
          hideContextMenu();
          controller.cut();
        }}
      >
        Cut
      </Button>
      <Button
        onClick={() => {
          hideContextMenu();
          controller.paste();
        }}
      >
        Paste
      </Button>
    </div>
  );
};
ContextMenu.displayName = 'ContextMenuContainer';
