import React, { memo } from 'react';
import { Button, info, Select } from '../components';
import { IController } from '@/types';
import styles from './FloatElement.module.css';
import { useClickOutside } from '../hooks';
import type { ChartType } from 'chart.js';
import { saveAs } from '@/util';
import { FloatElementItem } from '@/containers/store';

type Props = FloatElementItem & {
  controller: IController;
  menuLeft: number;
  menuTop: number;
  hideContextMenu: () => void;
};

function extractTypeFromBase64(base64: string) {
  const text = 'data:image/';
  let i = text.length;
  for (; i < base64.length; i++) {
    if (base64[i] === ';') {
      break;
    }
  }
  return base64.slice(text.length, i);
}

const chartList: Array<{ value: ChartType; label: string }> = [
  {
    value: 'line',
    label: 'Line Chart',
  },
  {
    value: 'bar',
    label: 'Bar Chart',
  },
  {
    value: 'pie',
    label: 'Pie Chart',
  },
  {
    value: 'scatter',
    label: 'Scatter Chart',
  },
  {
    value: 'radar',
    label: 'Radar Chart',
  },
  {
    value: 'polarArea',
    label: 'PolarArea Chart',
  },
];

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
      hideContextMenu,
    } = props;
    const [ref] = useClickOutside(hideContextMenu);
    const changeChartTitle = () => {
      let value = title;
      const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        value = event.currentTarget.value;
        event.stopPropagation();
      };
      info({
        visible: true,
        title: 'Change Chart Title',
        children: (
          <input
            type="text"
            style={{ width: '92%' }}
            defaultValue={value}
            onChange={handleChange}
          />
        ),
        onOk: () => {
          controller.updateFloatElement(uuid, 'title', value);
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
        title: 'Change Chart Type',
        visible: true,
        children: (
          <Select
            style={{ width: '100%' }}
            defaultValue={newChartType}
            data={chartList.map((v) => ({ ...v, disabled: false }))}
            onChange={(v) => (newChartType = String(v) as ChartType)}
          />
        ),
        onCancel() {
          hideContextMenu();
        },
        onOk() {
          controller.updateFloatElement(uuid, 'chartType', newChartType);
          hideContextMenu();
        },
      });
    };
    const saveAsPicture = () => {
      hideContextMenu();
      const list = controller.getFloatElementList(
        controller.getCurrentSheetId(),
      );
      const item = list.find((v) => v.uuid === uuid);
      if (!item) {
        return;
      }
      if (type === 'floating-picture' && item.imageSrc) {
        saveAs(
          item.imageSrc,
          item.title + '.' + extractTypeFromBase64(item.imageSrc),
        );
      }
      if (type === 'chart') {
        const dom = document.querySelector<HTMLCanvasElement>(
          `canvas[data-uuid="${uuid}"]`,
        );
        if (!dom) {
          return;
        }
        saveAs(dom.toDataURL(), item.title + '.png');
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
          onClick={() => {
            hideContextMenu();
            controller.deleteFloatElement(uuid);
          }}
        >
          Delete
        </Button>
        {type === 'chart' ? (
          <React.Fragment>
            <Button onClick={changeChartTitle}>Change Chart Title</Button>
            <Button onClick={changeChartType}>Change Chart Type</Button>
            {/* TODO: select chart reference data */}
          </React.Fragment>
        ) : null}
        <Button onClick={saveAsPicture}>Save as Picture</Button>
      </div>
    );
  },
);
FloatElementContextMenu.displayName = 'FloatElementContextMenu';
