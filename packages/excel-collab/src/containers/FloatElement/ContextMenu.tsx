import React, { memo, useMemo, Fragment, useState } from 'react';
import { Dialog } from '../../components';
import type { ChartType } from 'chart.js';
import {
  saveAs,
  convertToReference,
  parseReference,
  isSameRange,
  MAX_NAME_LENGTH,
  extractImageType,
  CHART_TYPE_LIST,
} from '../../util';
import { useExcel, type FloatElementItem } from '../../containers/store';
import { IWindowSize } from '../../types';
import i18n, { type TranslationKeys } from '../../i18n';
import { Menu, MenuItem } from '../../component/Menu';
import { Select, SelectItem } from '../../component/Select';
import { useClickOutside } from '../hooks';
import styles from './FloatElement.module.css';
import { queue } from '../../component/Toast';
import { TextField } from '../../component/TextField';

type ModalType = 'selectData' | 'changeChartTitle' | 'changeChartType';

type Props = FloatElementItem & {
  menuLeft: number;
  menuTop: number;
  hideContextMenu: () => void;
  resetResize: (size: IWindowSize) => void;
};

export const FloatElementContextMenu: React.FunctionComponent<Props> = memo(
  (props) => {
    const {
      menuTop,
      menuLeft,
      uuid,
      type,
      chartType,
      title,
      resetResize,
      originHeight,
      originWidth,
      width,
      height,
      hideContextMenu,
    } = props;
    const { controller } = useExcel();
    const [dataSource, setDataSource] = useState('');
    const [isOpen, onOpenChange] = useState(false);
    const ref = useClickOutside(!isOpen, hideContextMenu);
    const [modalType, setModalType] = useState<ModalType>('selectData');

    const selectData = () => {
      const value = convertToReference(
        props.chartRange!,
        'absolute',
        (sheetId: string) => {
          return controller.getSheetInfo(sheetId)?.name || '';
        },
      );

      setDataSource(value);
      setModalType('selectData');
      onOpenChange(true);
    };
    const changeChartTitle = () => {
      setDataSource(title.trim());
      setModalType('changeChartTitle');
      onOpenChange(true);
    };
    const changeChartType = () => {
      setDataSource(chartType ?? CHART_TYPE_LIST[0].value);
      setModalType('changeChartType');
      onOpenChange(true);
    };
    const saveAsPicture = () => {
      const list = controller.getDrawingList(controller.getCurrentSheetId());
      const item = list.find((v) => v.uuid === uuid);
      if (!item) {
        return;
      }
      if (type === 'floating-picture' && item.imageSrc) {
        const result = extractImageType(item.imageSrc);
        saveAs(item.imageSrc, item.title + result.ext);
      }
      if (type === 'chart') {
        const dom = document.querySelector<HTMLCanvasElement>(
          `canvas[data-uuid="${uuid}"]`,
        );
        if (!dom) {
          return;
        }
        const chartData = dom.toDataURL();
        saveAs(chartData, item.title + '.png');
      }
    };

    const actionList = useMemo(() => {
      const actions: {
        type: TranslationKeys;
        action: () => void;
        disabled?: boolean;
      }[] = [
        {
          type: 'copy',
          action: () => {
            controller.setFloatElementUuid(uuid);
            controller.copy();
          },
        },
        {
          type: 'cut',
          action: () => {
            controller.setFloatElementUuid(uuid);
            controller.cut();
          },
        },
        {
          type: 'paste',
          action: () => {
            controller.paste();
          },
        },
        {
          type: 'duplicate',
          action: () => {
            controller.setFloatElementUuid(uuid);
            controller.copy();
            controller.paste();
            controller.setFloatElementUuid('');
          },
        },
      ];

      if (type === 'chart') {
        actions.push(
          {
            type: 'select-data',
            action: selectData,
          },
          {
            type: 'change-chart-title',
            action: changeChartTitle,
          },
          {
            type: 'change-chart-type',
            action: changeChartType,
          },
        );
      }

      actions.push(
        {
          type: 'save-as-picture',
          action: saveAsPicture,
        },
        {
          type: 'reset-size',
          disabled: width === originWidth && height === originHeight,
          action: () => {
            controller.updateDrawing(uuid, {
              height: originHeight,
              width: originWidth,
            });
            resetResize({ width: originWidth, height: originHeight });
          },
        },
        {
          type: 'delete',
          action: () => {
            controller.deleteDrawing(uuid);
          },
        },
      );

      return actions;
    }, [controller, uuid, type]);

    const modalTitle: Record<ModalType, string> = {
      changeChartTitle: i18n.t('change-chart-title'),
      selectData: i18n.t('select-data'),
      changeChartType: i18n.t('change-chart-type'),
    };

    return (
      <Fragment>
        <div
          className={styles['context-menu']}
          data-testid="float-element-context-menu"
          ref={ref}
          style={{ top: menuTop, left: menuLeft }}
        >
          <Menu aria-label="Float Element Context Menu">
            {actionList.map((item) => (
              <MenuItem
                data-testid={`float-element-context-menu-${item.type}`}
                onAction={() => {
                  item.action();
                  if (
                    item.type !== 'select-data' &&
                    item.type !== 'change-chart-title' &&
                    item.type !== 'change-chart-type'
                  ) {
                    hideContextMenu();
                  }
                }}
                id={item.type}
                isDisabled={item.disabled}
                key={item.type}
                textValue={i18n.t(item.type)}
              >
                {i18n.t(item.type)}
              </MenuItem>
            ))}
          </Menu>
        </div>
        <Dialog
          title={modalTitle[modalType]}
          isOpen={isOpen}
          onOpenChange={onOpenChange}
          onOk={() => {
            if (modalType === 'changeChartType') {
              controller.updateDrawing(uuid, {
                chartType: dataSource as ChartType,
              });
              return;
            }
            if (modalType === 'changeChartTitle') {
              if (!dataSource) {
                queue.add({ title: i18n.t('the-value-cannot-be-empty') });
                return;
              }
              controller.updateDrawing(uuid, { title: dataSource });
              return true;
            }

            if (!dataSource) {
              queue.add({
                title: i18n.t('reference-is-empty'),
              });
              return;
            }
            const sheetList = controller.getSheetList();
            const range = parseReference(dataSource, (sheetName: string) => {
              return sheetList.find((v) => v.name === sheetName)?.sheetId || '';
            });
            if (
              !range ||
              !controller.validateRange(range) ||
              (props.chartRange && isSameRange(range, props.chartRange))
            ) {
              queue.add({
                title: i18n.t('reference-is-not-valid'),
              });

              return;
            }
            range.sheetId = range.sheetId || controller.getCurrentSheetId();
            controller.updateDrawing(uuid, { chartRange: range });

            return true;
          }}
        >
          {modalType === 'selectData' && (
            <TextField
              value={dataSource}
              onChange={(v) => {
                setDataSource(String(v));
              }}
              maxLength={MAX_NAME_LENGTH * 2}
              data-testid="dialog-select-data-input"
              aria-label="Select Data Input"
              spellCheck="true"
            />
          )}
          {modalType === 'changeChartTitle' && (
            <TextField
              value={dataSource}
              onChange={(v) => {
                setDataSource(String(v));
              }}
              maxLength={MAX_NAME_LENGTH}
              data-testid="dialog-change-chart-title-input"
              aria-label="Change Chart Title Input"
              spellCheck="true"
            />
          )}
          {modalType === 'changeChartType' && (
            <Select
              data-testid="dialog-change-chart-type-select"
              value={dataSource}
              onChange={(value) => {
                setDataSource(String(value));
              }}
              aria-label="Select chart type"
            >
              {CHART_TYPE_LIST.map((item) => (
                <SelectItem
                  key={item.value}
                  id={item.value}
                  aria-label={item.label}
                >
                  {item.label}
                </SelectItem>
              ))}
            </Select>
          )}
        </Dialog>
      </Fragment>
    );
  },
);
FloatElementContextMenu.displayName = 'FloatElementContextMenu';
