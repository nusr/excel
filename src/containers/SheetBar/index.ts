import { h, SmartComponent } from '@/react';
import { classnames } from '@/util';
import { theme } from '@/util';
import { Button, Icon } from '../components';

export const SheetBarContainer: SmartComponent = (state, controller) => {
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
        return h(
          'div',
          {
            key: item.value,
            className: classnames('sheet-bar-item', {
              active: state.currentSheetId === item.value,
            }),
            onclick: () => {
              controller.setCurrentSheetId(String(item.value));
            },
          },
          item.label,
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
          onClick: () => {
            controller.addSheet();
          },
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
  );
};
SheetBarContainer.displayName = 'SheetBarContainer';
