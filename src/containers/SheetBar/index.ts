import { h, SmartComponent } from '@/react';
import { classnames } from '@/util';
import { theme } from '@/util';
import { Button, Icon } from '../components';
import { SheetBarContextMenu } from './SheetBarContextMenu';

export const SheetBarContainer: SmartComponent = (state, controller) => {
  const setSheetName = (sheetName: string) => {
    controller.renameSheet(sheetName);
    state.isSheetNameEditing = false;
  };
  return h(
    'div',
    {
      className: 'sheet-bar-wrapper',
    },
    h(
      'div',
      {
        className: 'sheet-bar-list',
      },
      ...state.sheetList.map((item) => {
        const isActive = state.currentSheetId === item.value;
        const showInput = isActive && state.isSheetNameEditing;
        return h(
          'div',
          {
            key: item.value,
            className: classnames('sheet-bar-item', {
              active: isActive,
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
            className: classnames('sheet-bar-input', {
              show: showInput,
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
              className: classnames('sheet-bar-item-text', {
                show: !showInput,
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
        className: 'sheet-bar-add',
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
