import { h, SmartComponent, CSSProperties } from '@/react';
import { Button, Dialog, Select } from '../components';
import { setOutSideMap } from '@/canvas';
import { IController, OptionItem, StoreValue } from '@/types';
import styles from './index.module.css'

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
      controller[dataType]();
      break;
    case 'unhideSheet':
      break;
    case 'renameSheet':
      state.isSheetNameEditing = true;
      break;
    default:
      throw new Error(`sheet bar context menu unknown data type: ${dataType}`);
  }
}

export const SheetBarContextMenu: SmartComponent = (state, controller) => {
  const style =
    state.sheetBarContextMenuLeft === undefined
      ? defaultStyle
      : {
          left: `${state.sheetBarContextMenuLeft}px`,
        };
  const hideSheetList = controller.getSheetList().filter((v) => v.isHide);
  const optionList: OptionItem[] = hideSheetList.map((item) => ({
    value: item.sheetId,
    label: item.name,
    disabled: false,
  }));
  let selectValue = String(optionList?.[0]?.value || '');
  const hideContextMenu = () => {
    state.sheetBarContextMenuLeft = undefined;
  };

  return h(
    'div',
    {
      className: styles['sheet-bar-context-menu'],
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
        if (dataType === 'unhideSheet') {
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
    Dialog(
      {
        dialogContent: Select({
          data: optionList,
          onChange(value) {
            selectValue = String(value);
          },
          style: {
            width: '300px',
          },
          value: undefined,
        }),
        title: 'Unhide sheet:',
        onOk() {
          controller.unhideSheet(selectValue);
          hideContextMenu();
          selectValue = '';
        },
        onCancel: hideContextMenu,
      },
      Button(
        {
          dataType: 'unhideSheet',
          className: styles['sheet-bar-unhide'],
          disabled: optionList.length === 0,
        },
        'Unhide',
      ),
    ),
  );
};
SheetBarContextMenu.displayName = 'SheetBarContextMenu';
