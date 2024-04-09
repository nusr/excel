import React, { memo } from 'react';
import { Button, info, Select, toast } from '../components';
import { IController } from '@/types';
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
} from '@/util';
import { FloatElementItem } from '@/containers/store';
import { IWindowSize } from '@/types';
import { $ } from '@/i18n';

type Props = FloatElementItem & {
  controller: IController;
  menuLeft: number;
  menuTop: number;
  resetResize: (size: IWindowSize) => void;
  hideContextMenu: () => void;
};

export const FloatElementContextMenu: React.FunctionComponent<Props> = memo(
  (props) => {
    const {
      controller,
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
    const [ref] = useClickOutside(hideContextMenu);
    const selectData = () => {
      let value = convertToReference(
        props.chartRange!,
        'absolute',
        (sheetId: string) => {
          return controller.getSheetInfo(sheetId)?.name || '';
        },
      );
      const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        value = event.target.value;
        event.stopPropagation();
      };
      info({
        visible: true,
        title: $('edit-data-source'),
        testId: 'dialog-select-data',
        children: (
          <input
            type="text"
            spellCheck
            style={{ width: '400px' }}
            defaultValue={value}
            onChange={handleChange}
            maxLength={MAX_NAME_LENGTH * 2}
            data-testid="dialog-select-data-input"
          />
        ),
        onOk: () => {
          const realValue = value.trim();
          if (!realValue) {
            toast({ type: 'error', message: $('reference-is-empty') });
            return;
          }
          const sheetList = controller.getSheetList();
          const range = parseReference(realValue, (sheetName: string) => {
            return sheetList.find((v) => v.name === sheetName)?.sheetId || '';
          });
          if (
            !range ||
            !range.isValid() ||
            (props.chartRange && isSameRange(range, props.chartRange))
          ) {
            toast({ type: 'error', message: $('reference-is-not-valid') });
            return;
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
      let value = title;
      const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        value = event.target.value;
        event.stopPropagation();
      };
      info({
        visible: true,
        title: $('change-chart-title'),
        testId: 'dialog-change-chart-title',
        children: (
          <input
            type="text"
            spellCheck
            style={{ width: '200px' }}
            defaultValue={value}
            onChange={handleChange}
            maxLength={MAX_NAME_LENGTH}
            data-testid="dialog-change-chart-title-input"
          />
        ),
        onOk: () => {
          const realValue = value.trim();
          if (!realValue) {
            toast({ type: 'error', message: $('the-value-cannot-be-empty') });
            return;
          }
          controller.updateDrawing(uuid, { title: realValue });
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
        title: $('change-chart-type'),
        testId: 'dialog-change-chart-type',
        visible: true,
        children: (
          <Select
            style={{ width: '100%' }}
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
          {$('copy')}
        </Button>

        <Button
          testId="float-element-context-menu-cut"
          onClick={() => {
            hideContextMenu();
            controller.setFloatElementUuid(uuid);
            controller.cut();
          }}
        >
          {$('cut')}
        </Button>
        <Button
          testId="float-element-context-menu-paste"
          onClick={() => {
            hideContextMenu();
            controller.paste();
          }}
        >
          {$('paste')}
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
          {$('duplicate')}
        </Button>
        {type === 'chart' && (
          <React.Fragment>
            <Button
              onClick={selectData}
              testId="float-element-context-menu-select-data"
            >
              {$('select-data')}
            </Button>
            <Button
              onClick={changeChartTitle}
              testId="float-element-context-menu-change-chart-title"
            >
              {$('change-chart-title')}
            </Button>
            <Button
              onClick={changeChartType}
              testId="float-element-context-menu-change-chart-type"
            >
              {$('change-chart-type')}
            </Button>
          </React.Fragment>
        )}
        <Button
          testId="float-element-context-menu-save-as-picture"
          onClick={saveAsPicture}
        >
          {$('save-as-picture')}
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
          {$('reset-size')}
        </Button>
        <Button
          testId="float-element-context-menu-delete"
          onClick={() => {
            hideContextMenu();
            controller.deleteDrawing(uuid);
          }}
        >
          {$('delete')}
        </Button>
      </div>
    );
  },
);
FloatElementContextMenu.displayName = 'FloatElementContextMenu';
