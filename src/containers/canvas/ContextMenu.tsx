import React, { Fragment, memo, useMemo, useSyncExternalStore } from 'react';
import { Button, info, toast } from '../../components';
import styles from './index.module.css';
import { useClickOutside } from '../hooks';
import { activeCellStore, useExcel } from '../../containers/store';
import { $ } from '../../i18n';
import { headerSizeSet, canvasSizeSet } from '../../util';

interface Props {
  top: number;
  left: number;
  hideContextMenu: () => void;
}

enum ClickPosition {
  COLUMN_HEADER,
  ROW_HEADER,
  TRIANGLE,
  CONTENT,
}

const MENU_WIDTH = 110;
const ITEM_HEIGHT = 20;

function computeMenuStyle(top: number, left: number) {
  const headerSize = headerSizeSet.get();
  const rect = canvasSizeSet.get();
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

const threshold = 10000;

export const ContextMenu: React.FunctionComponent<Props> = memo((props) => {
  const { controller } = useExcel();
  const { top, left, hideContextMenu } = props;
  const { row, col, colCount, rowCount } = useSyncExternalStore(
    activeCellStore.subscribe,
    activeCellStore.getSnapshot,
  );
  const ref = useClickOutside(hideContextMenu);
  const { style, position } = useMemo(() => {
    const temp = computeMenuStyle(top, left);
    return temp;
  }, [top, left]);
  const handleDialog = (isRow: boolean) => {
    let value = isRow ? controller.getRow(row).len : controller.getCol(col).len;
    const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
      const t = parseInt(event.target.value, 10);
      if (!isNaN(t)) {
        if (t < 0) {
          value = 0;
        } else if (value > threshold) {
          value = threshold;
        } else {
          value = t;
        }
      }
      event.stopPropagation();
    };
    info({
      visible: true,
      title: isRow ? $('row-height') : $('column-width'),
      testId: 'context-menu-width-height-dialog',
      children: (
        <input
          type="number"
          min={0}
          max={threshold}
          style={{ width: '200px' }}
          defaultValue={value}
          onChange={handleChange}
          data-testid="context-menu-width-height-dialog-input"
        />
      ),
      onOk: () => {
        if (value < 0) {
          return toast.error($('greater-than-zero'));
        }
        if (isRow) {
          controller.transaction(() => {
            for (let i = 0; i < rowCount; i++) {
              controller.setRowHeight(row + i, value);
            }
          });
        } else {
          controller.transaction(() => {
            for (let i = 0; i < colCount; i++) {
              controller.setColWidth(col + i, value);
            }
          });
        }
        hideContextMenu();
      },
      onCancel: () => {
        hideContextMenu();
      },
    });
  };
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
          controller.setFloatElementUuid('');
          controller.copy();
        }}
        testId="context-menu-copy"
      >
        {$('copy')}
      </Button>
      <Button
        onClick={() => {
          hideContextMenu();
          controller.setFloatElementUuid('');
          controller.cut();
        }}
        testId="context-menu-cut"
      >
        {$('cut')}
      </Button>
      <Button
        testId="context-menu-paste"
        onClick={() => {
          hideContextMenu();
          controller.paste();
        }}
      >
        {$('paste')}
      </Button>
      {(position === ClickPosition.ROW_HEADER ||
        position === ClickPosition.CONTENT) && (
        <Fragment>
          <Button
            testId="context-menu-insert-row-above"
            onClick={() => {
              hideContextMenu();
              controller.addRow(row, rowCount, true);
            }}
          >
            {$('insert-row-above')}
          </Button>
          <Button
            testId="context-menu-insert-row-below"
            onClick={() => {
              hideContextMenu();
              controller.addRow(row, rowCount);
            }}
          >
            {$('insert-row-below')}
          </Button>
        </Fragment>
      )}
      {(position === ClickPosition.COLUMN_HEADER ||
        position === ClickPosition.CONTENT) && (
        <Fragment>
          <Button
            testId="context-menu-insert-column-left"
            onClick={() => {
              hideContextMenu();
              controller.addCol(col, colCount);
            }}
          >
            {$('insert-column-left')}
          </Button>
          <Button
            testId="context-menu-insert-column-right"
            onClick={() => {
              hideContextMenu();
              controller.addCol(col, colCount, true);
            }}
          >
            {$('insert-column-right')}
          </Button>
        </Fragment>
      )}
      {position === ClickPosition.TRIANGLE && (
        <Button
          testId="context-menu-delete"
          onClick={() => {
            hideContextMenu();
            controller.deleteAll(controller.getCurrentSheetId());
          }}
        >
          {$('delete')}
        </Button>
      )}
      {position === ClickPosition.COLUMN_HEADER && (
        <Fragment>
          <Button
            testId="context-menu-delete-column"
            onClick={() => {
              hideContextMenu();
              controller.deleteCol(col, colCount);
            }}
          >
            {$('delete-columns')}
          </Button>
          <Button
            testId="context-menu-hide-column"
            onClick={() => {
              hideContextMenu();
              controller.hideCol(col, colCount);
            }}
          >
            {$('hide-columns')}
          </Button>
          <Button
            testId="context-menu-unhide-column"
            onClick={() => {
              hideContextMenu();
              controller.unhideCol(col, colCount);
            }}
          >
            {$('unhide-columns')}
          </Button>
          <Button
            testId="context-menu-column-width"
            onClick={() => {
              handleDialog(false);
            }}
          >
            {$('column-width')}
          </Button>
        </Fragment>
      )}
      {position === ClickPosition.ROW_HEADER && (
        <Fragment>
          <Button
            testId="context-menu-delete-row"
            onClick={() => {
              hideContextMenu();
              controller.deleteRow(row, rowCount);
            }}
          >
            {$('delete-rows')}
          </Button>
          <Button
            testId="context-menu-hide-row"
            onClick={() => {
              hideContextMenu();
              controller.hideRow(row, rowCount);
            }}
          >
            {$('hide-rows')}
          </Button>
          <Button
            testId="context-menu-unhide-row"
            onClick={() => {
              hideContextMenu();
              controller.unhideRow(row, rowCount);
            }}
          >
            {$('unhide-rows')}
          </Button>
          <Button
            testId="context-menu-row-height"
            onClick={() => {
              handleDialog(true);
            }}
          >
            {$('row-height')}
          </Button>
        </Fragment>
      )}
    </div>
  );
});
ContextMenu.displayName = 'CanvasContextMenu';
