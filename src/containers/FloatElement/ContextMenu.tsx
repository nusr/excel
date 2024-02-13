import React, { memo } from 'react';
import { Button, info, Select } from '../components';
import { IController, FloatElement } from '@/types';
import styles from './FloatElement.module.css';
import { useClickOutside } from '../hooks';
import type { ChartType } from 'chart.js';
import { saveAs } from '@/util';

interface Props {
  controller: IController;
  top: number;
  left: number;
  uuid: string;
  type: FloatElement['type'];
  hideContextMenu: () => void;
}

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

export const ContextMenu: React.FunctionComponent<Props> = memo((props) => {
  const { controller, top, left, uuid, type, hideContextMenu } = props;
  const [ref] = useClickOutside(hideContextMenu);
  const changeChartType = () => {
    let chartType: ChartType = 'line';
    info({
      title: 'Change Chart Type',
      visible: true,
      children: (
        <Select
          style={{ width: '100%' }}
          data={chartList.map((v) => ({ ...v, disabled: false }))}
          onChange={(v) => (chartType = String(v) as ChartType)}
        />
      ),
      onCancel() {
        hideContextMenu();
      },
      onOk() {
        controller.updateFloatElement(uuid, 'chartType', chartType);
        hideContextMenu();
      },
    });
  };
  const saveAsPicture = () => {
    hideContextMenu();
    const list = controller.getFloatElementList(controller.getCurrentSheetId());
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
      style={{ top, left }}
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
        <Button onClick={changeChartType}>Change Chart Type</Button>
      ) : null}
      <Button onClick={saveAsPicture}>Save as Picture</Button>
    </div>
  );
});
ContextMenu.displayName = 'ContextMenuContainer';
