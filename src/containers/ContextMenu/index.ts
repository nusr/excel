import { h, SmartComponent, CSSProperties } from '@/react';
import { Button } from '../components';
import { setOutSideMap } from '@/canvas';
import { IController } from '@/types';
import styles from './index.module.css'

const defaultStyle: CSSProperties = {
  display: 'none',
};

function handleClick(dataType: string, controller: IController): void {
  switch (dataType) {
    case 'addCol':
      controller.addCol(controller.getActiveCell().col, 1);
      break;
    case 'deleteCol':
      controller.deleteCol(controller.getActiveCell().col, 1);
      break;
    case 'addRow':
      controller.addRow(controller.getActiveCell().row, 1);
      break;
    case 'deleteRow':
      controller.deleteRow(controller.getActiveCell().row, 1);
      break;
    case 'copy':
    case 'cut':
    case 'paste':
      controller[dataType]();
      break;
    default:
      throw new Error(`context menu unknown data type: ${dataType}`);
  }
}

export const ContextMenuContainer: SmartComponent = (state, controller) => {
  const { contextMenuPosition } = state;
  const style =
    contextMenuPosition === undefined
      ? defaultStyle
      : {
          top: contextMenuPosition.top,
          left: contextMenuPosition.left,
        };
  const hideContextMenu = () => {
    state.contextMenuPosition = undefined;
  };
  return h(
    'div',
    {
      className: styles['context-menu'],
      "data-testId": 'context-menu',
      style,
      hook: {
        ref(dom) {
          setOutSideMap('canvas-context-menu', {
            dom,
            callback(stateValue) {
              if (stateValue.contextMenuPosition !== undefined) {
                stateValue.contextMenuPosition = undefined;
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
        handleClick(dataType, controller);
      },
    },
    Button(
      {
        dataType: 'addCol',
      },
      'add a column',
    ),
    Button(
      {
        dataType: 'deleteCol',
      },
      'delete a column',
    ),
    Button(
      {
        dataType: 'addRow',
      },
      'add a row',
    ),
    Button(
      {
        dataType: 'deleteRow',
      },
      'delete a row',
    ),
    Button(
      {
        dataType: 'copy',
      },
      'copy',
    ),
    Button(
      {
        dataType: 'cut',
      },
      'cut',
    ),
    Button(
      {
        dataType: 'paste',
      },
      'paste',
    ),
  );
};
ContextMenuContainer.displayName = 'ContextMenuContainer';
