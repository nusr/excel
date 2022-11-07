import { Component, h, text } from '@/react';
import { classnames } from '@/util';
import globalStore from '@/store';
import theme from '@/theme';
import { Button, Icon } from '@/components';

export const SheetBarContainer: Component = () => {
  const sheetList = globalStore.value.sheetList;
  const currentSheetId = globalStore.value.currentSheetId;
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
      ...sheetList.map((item) => {
        return h(
          'div',
          {
            key: item.sheetId,
            className: classnames('sheet-bar-item', {
              active: currentSheetId === item.sheetId,
            }),
            onclick: () => {
              globalStore.controller.setCurrentSheetId(item.sheetId);
            },
          },
          text(item.name),
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
            globalStore.controller.addSheet();
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
