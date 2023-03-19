import { h, SmartComponent, CSSProperties } from '@/react';
import { Button } from '../components';
import { setOutSideMap } from '@/canvas';
import { IController, StoreValue } from '@/types';

const defaultStyle: CSSProperties = {
  display: 'none',
};
function handleClick(
  dataType: string,
  controller: IController,
  state: StoreValue,
): void {
  switch (dataType) {
    case 'addSheet':
    case 'deleteSheet':
    case 'hideSheet':
    case 'unhideSheet':
      controller[dataType]();
      break;
    case 'renameSheet':
      state.isSheetNameEditing = true;
      break;
    default:
    // throw new Error(`sheet bar context menu unknown data type: ${dataType}`);
  }
}

export const SheetBarContextMenu: SmartComponent = (state, controller) => {
  const style =
    state.sheetBarContextMenuLeft === undefined
      ? defaultStyle
      : {
          left: `${state.sheetBarContextMenuLeft}px`,
        };
  const hideContextMenu = () => {
    state.sheetBarContextMenuLeft = undefined;
  };
  return h(
    'div',
    {
      className: 'sheet-bar-context-menu',
      style,
      hook: {
        ref(dom) {
          setOutSideMap('sheet-bar-context-menu', {
            dom,
            callback(stateValue) {
              if (stateValue.sheetBarContextMenuLeft !== undefined) {
                stateValue.sheetBarContextMenuLeft = undefined;
              }
            },
          });
        },
      },
      onclick(event) {
        if (!event.target) {
          return;
        }
        const node = event.target as HTMLElement;
        const dataType = node.dataset['type'];
        if (!dataType) {
          return;
        }
        hideContextMenu();
        handleClick(dataType, controller, state);
      },
    },
    Button(
      {
        dataType: 'addSheet',
      },
      'Insert',
    ),
    Button(
      {
        dataType: 'deleteSheet',
      },
      'Delete',
    ),
    Button(
      {
        dataType: 'renameSheet',
      },
      'Rename',
    ),
    Button(
      {
        dataType: 'hideSheet',
      },
      'Hide',
    ),
    // Button(
    //   {
    //     dataType: 'unhideSheet',
    //   },
    //   'Unhide',
    // ),
  );
};
SheetBarContextMenu.displayName = 'SheetBarContextMenu';
