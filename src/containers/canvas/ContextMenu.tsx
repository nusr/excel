import React, { useMemo, Fragment, memo } from 'react';
import { Button } from '../components';
import { IController } from '@/types';
import styles from './index.module.css';
import { useClickOutside } from '../hooks';

interface Props {
  controller: IController;
  top: number;
  left: number;
  hideContextMenu: () => void;
}

export enum ClickPosition {
  COLUMN_HEADER,
  ROW_HEADER,
  TRIANGLE,
  CONTENT,
}

const MENU_WIDTH = 110;
const ITEM_HEIGHT = 20;

export const ContextMenu: React.FunctionComponent<Props> = memo((props) => {
  const { controller, top, left, hideContextMenu } = props;
  const [ref] = useClickOutside(hideContextMenu);
  const { style, position } = useMemo(() => {
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
  }, []);

  return (
    <div className={styles['context-menu']} data-testid="context-menu" style={style} ref={ref}>
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
        <Fragment>
          <Button
            onClick={() => {
              hideContextMenu();
              controller.deleteAll(controller.getCurrentSheetId());
            }}
          >
            Delete all
          </Button>
        </Fragment>
      )}
      {position === ClickPosition.COLUMN_HEADER && (
        <Fragment>
          <Button
            onClick={() => {
              hideContextMenu();
              controller.addCol(controller.getActiveCell().col, 1);
            }}
          >
            Insert a column
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
            Insert a row
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
        </Fragment>
      )}
    </div>
  );
});
ContextMenu.displayName = 'ContextMenuContainer';
