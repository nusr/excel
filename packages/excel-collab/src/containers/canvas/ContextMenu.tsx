import React, { Fragment, memo, useMemo, useState } from 'react';
import { Dialog } from '../../components';
import styles from './index.module.css';
import { useClickOutside } from '../hooks';
import { useActiveCell, useExcel } from '../../containers/store';
import i18n from '../../i18n';
import { IController } from '../../types';
import { queue } from '../../component/Toast';
import { Menu, MenuItem } from '../../component/Menu';
import { NumberField } from '../../component/NumberField';

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

function computeMenuStyle(top: number, left: number, controller: IController) {
  const rect = controller.getCanvasSize();
  const headerSize = controller.getHeaderSize();
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
  const [isRow, setIsRow] = useState(false);
  const [value, setValue] = useState(0);
  const row = useActiveCell((state) => state.row);
  const col = useActiveCell((state) => state.col);
  const colCount = useActiveCell((state) => state.colCount);
  const rowCount = useActiveCell((state) => state.rowCount);
  const [isOpen, onOpenChange] = useState(false);
  const ref = useClickOutside(!isOpen, hideContextMenu);
  const { style, position } = useMemo(() => {
    const temp = computeMenuStyle(top, left, controller);
    return temp;
  }, [top, left]);
  const handleDialog = (isRow: boolean) => {
    setIsRow(isRow);
    setValue(isRow ? controller.getRow(row).len : controller.getCol(col).len);
    onOpenChange(true);
  };
  return (
    <Fragment>
      <div
        className={styles['context-menu']}
        data-testid="context-menu"
        style={style}
        ref={ref}
      >
        <Menu aria-label="Canvas Context Menu">
          <MenuItem
            onPress={() => {
              hideContextMenu();
              controller.setFloatElementUuid('');
              controller.copy();
            }}
            data-testid="context-menu-copy"
            textValue={i18n.t('copy')}
          >
            {i18n.t('copy')}
          </MenuItem>
          <MenuItem
            onPress={() => {
              hideContextMenu();
              controller.setFloatElementUuid('');
              controller.cut();
            }}
            data-testid="context-menu-cut"
            textValue={i18n.t('cut')}
          >
            {i18n.t('cut')}
          </MenuItem>
          <MenuItem
            data-testid="context-menu-paste"
            textValue={i18n.t('paste')}
            onPress={() => {
              hideContextMenu();
              controller.paste();
            }}
          >
            {i18n.t('paste')}
          </MenuItem>
          {(position === ClickPosition.ROW_HEADER ||
            position === ClickPosition.CONTENT) && (
            <Fragment>
              <MenuItem
                data-testid="context-menu-insert-row-above"
                onClick={() => {
                  hideContextMenu();
                  controller.addRow(row, rowCount, true);
                }}
                textValue={i18n.t('insert-row-above')}
              >
                {i18n.t('insert-row-above')}
              </MenuItem>
              <MenuItem
                data-testid="context-menu-insert-row-below"
                onAction={() => {
                  hideContextMenu();
                  controller.addRow(row, rowCount);
                }}
                textValue={i18n.t('insert-row-below')}
              >
                {i18n.t('insert-row-below')}
              </MenuItem>
            </Fragment>
          )}
          {(position === ClickPosition.COLUMN_HEADER ||
            position === ClickPosition.CONTENT) && (
            <Fragment>
              <MenuItem
                data-testid="context-menu-insert-column-left"
                onPress={() => {
                  hideContextMenu();
                  controller.addCol(col, colCount);
                }}
                textValue={i18n.t('insert-column-left')}
              >
                {i18n.t('insert-column-left')}
              </MenuItem>
              <MenuItem
                data-testid="context-menu-insert-column-right"
                onPress={() => {
                  hideContextMenu();
                  controller.addCol(col, colCount, true);
                }}
                textValue={i18n.t('insert-column-right')}
              >
                {i18n.t('insert-column-right')}
              </MenuItem>
            </Fragment>
          )}
          {position === ClickPosition.TRIANGLE && (
            <MenuItem
              data-testid="context-menu-delete"
              onClick={() => {
                hideContextMenu();
                controller.deleteAll(controller.getCurrentSheetId());
              }}
              textValue={i18n.t('delete')}
            >
              {i18n.t('delete')}
            </MenuItem>
          )}
          {position === ClickPosition.COLUMN_HEADER && (
            <Fragment>
              <MenuItem
                data-testid="context-menu-delete-column"
                onPress={() => {
                  hideContextMenu();
                  controller.deleteCol(col, colCount);
                }}
                textValue={i18n.t('delete-columns')}
              >
                {i18n.t('delete-columns')}
              </MenuItem>
              <MenuItem
                data-testid="context-menu-hide-column"
                onPress={() => {
                  hideContextMenu();
                  controller.hideCol(col, colCount);
                }}
                textValue={i18n.t('hide-columns')}
              >
                {i18n.t('hide-columns')}
              </MenuItem>
              <MenuItem
                data-testid="context-menu-unhide-column"
                onPress={() => {
                  hideContextMenu();
                  controller.unhideCol(col, colCount);
                }}
                textValue={i18n.t('unhide-columns')}
              >
                {i18n.t('unhide-columns')}
              </MenuItem>
              <MenuItem
                data-testid="context-menu-column-width"
                onAction={() => {
                  handleDialog(false);
                }}
                textValue={i18n.t('column-width')}
              >
                {i18n.t('column-width')}
              </MenuItem>
            </Fragment>
          )}
          {position === ClickPosition.ROW_HEADER && (
            <Fragment>
              <MenuItem
                data-testid="context-menu-delete-row"
                onPress={() => {
                  hideContextMenu();
                  controller.deleteRow(row, rowCount);
                }}
                textValue={i18n.t('delete-rows')}
              >
                {i18n.t('delete-rows')}
              </MenuItem>
              <MenuItem
                textValue={i18n.t('hide-rows')}
                onPress={() => {
                  hideContextMenu();
                  controller.hideRow(row, rowCount);
                }}
                data-testid="context-menu-hide-row"
              >
                {i18n.t('hide-rows')}
              </MenuItem>
              <MenuItem
                textValue={i18n.t('unhide-rows')}
                data-testid="context-menu-unhide-row"
                onPress={() => {
                  hideContextMenu();
                  controller.unhideRow(row, rowCount);
                }}
              >
                {i18n.t('unhide-rows')}
              </MenuItem>
              <MenuItem
                textValue={i18n.t('row-height')}
                data-testid="context-menu-row-height"
                onAction={() => {
                  handleDialog(true);
                }}
              >
                {i18n.t('row-height')}
              </MenuItem>
            </Fragment>
          )}
        </Menu>
      </div>
      <Dialog
        title={isRow ? i18n.t('row-height') : i18n.t('column-width')}
        isOpen={isOpen}
        onOpenChange={onOpenChange}
        onOk={() => {
          if (value < 0) {
            queue.add({ title: i18n.t('greater-than-zero') });
            return false;
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
          return true;
        }}
      >
        <NumberField
          value={value}
          minValue={0}
          data-testid="context-menu-width-height-dialog-input"
          maxValue={threshold}
          onChange={setValue}
          formatOptions={{ style: 'decimal' }}
          aria-label={isRow ? i18n.t('row-height') : i18n.t('column-width')}
        />
      </Dialog>
    </Fragment>
  );
});
ContextMenu.displayName = 'CanvasContextMenu';
