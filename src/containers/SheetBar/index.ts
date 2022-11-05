import { Component, h } from '@/react';
import { classnames } from '@/util';
import globalStore from '@/store';
import theme from '@/theme';
import { Button, ButtonProps } from '@/components';

export const SheetBarContainer: Component = () => {
  const sheetList = globalStore.get('sheetList');
  const currentSheetId = globalStore.get('currentSheetId');
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
              globalStore.getController().setCurrentSheetId(item.sheetId);
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
      h<ButtonProps>(Button, {
        onClick: () => {
          globalStore.getController().addSheet();
        },
        type: 'circle',
        style: `background-color: ${theme.buttonActiveColor};`,
        icon: 'plus',
      }),
    ),
  );
  // return x`
  // <div className="sheet-bar-wrapper" id="sheet-bar-container">
  // <div className="sheet-bar-list ">
  // {sheetList.map((item) => (
  // <div
  // key={item.sheetId}
  // onMouseDown={() => handleClickSheet(item)}
  // className={classnames("sheet-bar-item", {
  // active: currentSheetId === item.sheetId,
  // })}
  // >
  // {item.name}
  // </div>
  // ))}
  // </div>
  // <div style={{ marginLeft: 20 }}>
  // <Button style={addButtonStyle} type="circle" onClick={handleAddSheet}>
  // <BaseIcon name="plus" />
  // </Button>
  // </div>
  // </div>
  // `;
};
SheetBarContainer.displayName = 'SheetBarContainer';
