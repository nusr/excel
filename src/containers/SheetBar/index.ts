import { h } from '@/react';
import { classnames } from '@/util';
import theme from '@/theme';
import { Button, Icon } from '@/components';
import { SmartComponent } from '@/types';

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
            key: item.sheetId,
            className: classnames('sheet-bar-item', {
              active: state.currentSheetId === item.sheetId,
            }),
            onclick: () => {
              controller.setCurrentSheetId(item.sheetId);
            },
          },
          item.name,
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
          style: `background-color: ${theme.buttonActiveColor};`,
        },
        Icon({
          name: 'plus',
        }),
      ),
    ),
  );
};
SheetBarContainer.displayName = 'SheetBarContainer';