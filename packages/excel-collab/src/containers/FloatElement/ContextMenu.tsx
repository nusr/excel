import React, { memo } from 'react';
import { Button, info, Select, toast } from '../../components';
import styles from './FloatElement.module.css';
import { useClickOutside } from '../hooks';
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
import i18n from '../../i18n';

type Props = FloatElementItem & {
  menuLeft: number;
  menuTop: number;
  resetResize: (size: IWindowSize) => void;
  hideContextMenu: () => void;
};

export const FloatElementContextMenu: React.FunctionComponent<Props> = memo(
  (props) => {
    const {
      menuLeft,
      menuTop,
      uuid,
      type,
      chartType,
      title,
      resetResize,
      hideContextMenu,
      originHeight,
      originWidth,
      width,
      height,
    } = props;
    const { controller } = useExcel();
    const ref = useClickOutside(true, hideContextMenu);
    const selectData = () => {
      let value = convertToReference(
        props.chartRange!,
        'absolute',
        (sheetId: string) => {
          return controller.getSheetInfo(sheetId)?.name || '';
        },
      );
      info({
        visible: true,
        title: i18n.t('edit-data-source'),
        testId: 'dialog-select-data',
        children: (
          <input
            type="text"
            spellCheck
            style={{ width: '400px' }}
            defaultValue={value}
            onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
              value = event.target.value.trim();
              event.stopPropagation();
            }}
            maxLength={MAX_NAME_LENGTH * 2}
            data-testid="dialog-select-data-input"
          />
        ),
        onOk: () => {
          if (!value) {
            return toast.error(
              i18n.t('reference-is-empty'),
              'select-data-empty-toast',
            );
          }
          const sheetList = controller.getSheetList();
          const range = parseReference(value, (sheetName: string) => {
            return sheetList.find((v) => v.name === sheetName)?.sheetId || '';
          });
          if (
            !range ||
            !controller.validateRange(range) ||
            (props.chartRange && isSameRange(range, props.chartRange))
          ) {
            return toast.error(
              i18n.t('reference-is-not-valid'),
              'select-data-invalid-toast',
            );
          }
          range.sheetId = range.sheetId || controller.getCurrentSheetId();
          controller.updateDrawing(uuid, { chartRange: range });
          hideContextMenu();
        },
        onCancel: () => {
          hideContextMenu();
        },
      });
    };
    const changeChartTitle = () => {
      let value = title.trim();
      info({
        visible: true,
        title: i18n.t('change-chart-title'),
        testId: 'dialog-change-chart-title',
        children: (
          <input
            type="text"
            spellCheck
            style={{ width: '200px' }}
            defaultValue={value}
            onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
              value = event.target.value.trim();
              event.stopPropagation();
            }}
            maxLength={MAX_NAME_LENGTH}
            data-testid="dialog-change-chart-title-input"
          />
        ),
        onOk: () => {
          if (!value) {
            return toast.error(
              i18n.t('the-value-cannot-be-empty'),
              'change-chart-title-toast',
            );
          }
          controller.updateDrawing(uuid, { title: value });
          hideContextMenu();
        },
        onCancel: () => {
          hideContextMenu();
        },
      });
    };
    const changeChartType = () => {
      let newChartType: ChartType = chartType!;
      info({
        title: i18n.t('change-chart-type'),
        testId: 'dialog-change-chart-type',
        visible: true,
        children: (
          <Select
            className={styles['chart-type-select']}
            defaultValue={newChartType}
            data={CHART_TYPE_LIST.map((v) => ({ ...v, disabled: false }))}
            onChange={(v) => (newChartType = String(v) as ChartType)}
            testId="dialog-change-chart-type-select"
          />
        ),
        onCancel() {
          hideContextMenu();
        },
        onOk() {
          controller.updateDrawing(uuid, { chartType: newChartType });
          hideContextMenu();
        },
      });
    };
    const saveAsPicture = () => {
      hideContextMenu();
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
    return (
      <div
        className={styles['context-menu']}
        data-testid="float-element-context-menu"
        ref={ref}
        style={{ top: menuTop, left: menuLeft }}
      >
        <Button
          testId="float-element-context-menu-copy"
          onClick={() => {
            hideContextMenu();
            controller.setFloatElementUuid(uuid);
            controller.copy();
          }}
        >
          {i18n.t('copy')}
        </Button>

        <Button
          testId="float-element-context-menu-cut"
          onClick={() => {
            hideContextMenu();
            controller.setFloatElementUuid(uuid);
            controller.cut();
          }}
        >
          {i18n.t('cut')}
        </Button>
        <Button
          testId="float-element-context-menu-paste"
          onClick={() => {
            hideContextMenu();
            controller.paste();
          }}
        >
          {i18n.t('paste')}
        </Button>
        <Button
          testId="float-element-context-menu-duplicate"
          onClick={() => {
            hideContextMenu();
            controller.setFloatElementUuid(uuid);
            controller.copy();
            controller.paste();
            controller.setFloatElementUuid('');
          }}
        >
          {i18n.t('duplicate')}
        </Button>
        {type === 'chart' && (
          <React.Fragment>
            <Button
              onClick={selectData}
              testId="float-element-context-menu-select-data"
            >
              {i18n.t('select-data')}
            </Button>
            <Button
              onClick={changeChartTitle}
              testId="float-element-context-menu-change-chart-title"
            >
              {i18n.t('change-chart-title')}
            </Button>
            <Button
              onClick={changeChartType}
              testId="float-element-context-menu-change-chart-type"
            >
              {i18n.t('change-chart-type')}
            </Button>
          </React.Fragment>
        )}
        <Button
          testId="float-element-context-menu-save-as-picture"
          onClick={saveAsPicture}
        >
          {i18n.t('save-as-picture')}
        </Button>
        <Button
          disabled={width === originWidth && height === originHeight}
          testId="float-element-context-reset-size"
          onClick={() => {
            hideContextMenu();
            controller.updateDrawing(uuid, {
              height: originHeight,
              width: originWidth,
            });
            resetResize({ width: originWidth, height: originHeight });
          }}
        >
          {i18n.t('reset-size')}
        </Button>
        <Button
          testId="float-element-context-menu-delete"
          onClick={() => {
            hideContextMenu();
            controller.deleteDrawing(uuid);
          }}
        >
          {i18n.t('delete')}
        </Button>
      </div>
    );
  },
);
FloatElementContextMenu.displayName = 'FloatElementContextMenu';
