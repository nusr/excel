import { h, SmartComponent } from '@/react';
import { classnames } from '@/util';
import { theme } from '@/util';
import { Button, Icon } from '../components';
import { SheetBarContextMenu } from './SheetBarContextMenu';
import styles from './index.module.css';

export const SheetBarContainer: SmartComponent = (state, controller) => {
  const setSheetName = (sheetName: string) => {
    controller.renameSheet(sheetName);
    state.isSheetNameEditing = false;
  };
  return h(
    'div',
    {
      className: styles['sheet-bar-wrapper'],
    },
    h(
      'div',
      {
        className: styles['sheet-bar-list'],
        "data-testId": 'sheet-bar-list'
      },
      ...state.sheetList.map((item) => {
        const isActive = state.currentSheetId === item.value;
        const showInput = isActive && state.isSheetNameEditing;
        return h(
          'div',
          {
            key: item.value,
            className: classnames(styles['sheet-bar-item'], {
              [styles['sheet-bar-item-active']]: isActive,
            }),
            onclick: () => {
              controller.setCurrentSheetId(String(item.value));
            },
            oncontextmenu(event) {
              event.preventDefault();
              state.sheetBarContextMenuLeft = (event.clientX || 0) - 30;
              return false;
            },
          },
          h('input', {
            value: item.label,
            className: classnames(styles['sheet-bar-input'], {
              [styles['show-block']]: showInput,
            }),
            onblur(event) {
              if (!event.currentTarget) {
                return;
              }
              // setSheetName((event.currentTarget as HTMLInputElement).value);
            },
            onkeydown(event) {
              if (event.key === 'Enter') {
                event.stopPropagation();
                if (!event.currentTarget) {
                  return;
                }
                setSheetName((event.currentTarget as HTMLInputElement).value);
              }
            },
          }),
          h(
            'span',
            {
              className: classnames(styles['sheet-bar-item-text'], {
                [styles['show-block']]: !showInput,
              }),
            },
            item.label,
          ),
        );
      }),
    ),
    h(
      'div',
      {
        className: styles['sheet-bar-add'],
      },
      Button(
        {
          onClick: controller.addSheet,
          type: 'circle',
          style: {
            backgroundColor: theme.buttonActiveColor,
          },
        },
        Icon({
          name: 'plus',
        }),
      ),
    ),
    SheetBarContextMenu(state, controller),
  );
};
SheetBarContainer.displayName = 'SheetBarContainer';
