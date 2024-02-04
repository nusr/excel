import React, { Fragment, memo } from 'react';
import { Button } from '../components';
import { IController } from '@/types';
import styles from './index.module.css';
import { useClickOutside } from '../hooks';

interface Props {
  controller: IController;
  style: React.CSSProperties;
  position: ClickPosition;
  hideContextMenu: () => void;
  showDialog: (position: ClickPosition) => void;
}

export enum ClickPosition {
  COLUMN_HEADER,
  ROW_HEADER,
  TRIANGLE,
  CONTENT,
}

const MENU_WIDTH = 110;
const ITEM_HEIGHT = 20;

export function computeMenuStyle(
  controller: IController,
  top: number,
  left: number,
) {
  if (top < 0 || left < 0) {
    return {
      style: {
        display: 'none',
      },
      position: ClickPosition.CONTENT,
    };
  }
  const headerSize = controller.getHeaderSize();
  const rect = controller.getMainDom().canvas!.getBoundingClientRect();
  let clickPosition = ClickPosition.CONTENT;
  let menuHeight = ITEM_HEIGHT * 3;
  const y = top - rect.top;
  const x = left - rect.left;
  if (y < headerSize.height && x < headerSize.width) {
    clickPosition = ClickPosition.TRIANGLE;
  } else if (y < headerSize.height) {
    clickPosition = ClickPosition.COLUMN_HEADER;
    menuHeight = ITEM_HEIGHT * 6;
  } else if (x < headerSize.width) {
    clickPosition = ClickPosition.ROW_HEADER;
    menuHeight = ITEM_HEIGHT * 6;
  }

  // recompute menu position
  let realTop = top;
  let realLeft = left;
  const gap = 18;
  const height = rect.height + rect.top;
  if (realTop + menuHeight > height) {
    realTop = height - menuHeight - gap;
  }
  if (realLeft + MENU_WIDTH > rect.width) {
    realLeft = rect.width - MENU_WIDTH - gap;
  }

  return {
    style: {
      top: realTop,
      left: realLeft,
    },
    position: clickPosition,
  };
}

export const ContextMenu: React.FunctionComponent<Props> = memo((props) => {
  const { controller, style, position, hideContextMenu, showDialog } = props;
  const [ref] = useClickOutside(hideContextMenu);

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
      {position === ClickPosition.TRIANGLE && (
        <Button
          onClick={() => {
            hideContextMenu();
            controller.deleteAll(controller.getCurrentSheetId());
          }}
        >
          Delete
        </Button>
      )}
      {position === ClickPosition.COLUMN_HEADER && (
        <Fragment>
          <Button
            onClick={() => {
              hideContextMenu();
              controller.addCol(controller.getActiveCell().col, 1);
            }}
          >
            Insert a Column
          </Button>
          <Button
            onClick={() => {
              hideContextMenu();
              controller.deleteCol(controller.getActiveCell().col, 1);
            }}
          >
            Delete a Column
          </Button>
          <Button
            onClick={() => {
              hideContextMenu();
              controller.hideCol(controller.getActiveCell().col, 1);
            }}
          >
            Hide a Column
          </Button>
          <Button
            onClick={() => {
              showDialog(position);
              hideContextMenu();
            }}
          >
            Column Width
          </Button>
        </Fragment>
      )}
      {position === ClickPosition.ROW_HEADER && (
        <Fragment>
          <Button
            onClick={() => {
              hideContextMenu();
              controller.addRow(controller.getActiveCell().row, 1);
            }}
          >
            Insert a Row
          </Button>
          <Button
            onClick={() => {
              hideContextMenu();
              controller.deleteRow(controller.getActiveCell().row, 1);
            }}
          >
            Delete a Row
          </Button>
          <Button
            onClick={() => {
              hideContextMenu();
              controller.hideRow(controller.getActiveCell().row, 1);
            }}
          >
            Hide a Row
          </Button>
          <Button
            onClick={() => {
              showDialog(position);
              hideContextMenu();
            }}
          >
            Row Height
          </Button>
        </Fragment>
      )}
    </div>
  );
});
ContextMenu.displayName = 'ContextMenuContainer';
