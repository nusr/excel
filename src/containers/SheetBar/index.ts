import { x, Component, h } from '@/react';
// import { classnames } from '@/util';
// import { Button, BaseIcon } from '@/components';
// import { useSelector, useController } from '@/store';
import theme from '@/theme';
import { Button, ButtonProps } from '@/components';

export const SheetBarContainer: Component = () => {
  // const controller = useController();
  // const { currentSheetId, sheetList = [] } = useSelector([
  // 'currentSheetId',
  // 'sheetList',
  // ]);
  // const handleClickSheet = (item: WorksheetType) => {
  // controller.setCurrentSheetId(item.sheetId);
  // };
  // const handleAddSheet = () => {
  // controller.addSheet();
  // };
  return h(
    'div',
    {
      className: 'sheet-bar-wrapper',
    },
    h('div', {
      className: 'sheet-bar-list',
    }),
    h(
      'div',
      {
        className: 'sheet-bar-add',
      },
      h<ButtonProps>(Button, {
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
