import React, { useRef, useEffect, memo } from 'react';
import {
  Chart as ChartJS,
  BarController,
  LineController,
  PieController,
  Filler,
  ScatterController,
  RadarController,
  PolarAreaController,
  CategoryScale,
  LinearScale,
  RadialLinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import type { ChartType, DefaultDataPoint, ChartComponentLike } from 'chart.js';
import { DEBUG_COLOR_LIST, parseNumber } from '@/util';
import { FloatElementItem } from '@/containers/store';
import { ChartProps } from '@/types';
import styles from './FloatElement.module.css';

ChartJS.register(
  CategoryScale,
  LinearScale,
  RadialLinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
);

function ChartComponent<
  TType extends ChartType = ChartType,
  TData = DefaultDataPoint<TType>,
  TLabel = unknown,
>(props: ChartProps<TType, TData, TLabel>) {
  const {
    height = 400,
    width = 200,
    type,
    options,
    plugins,
    data,
    redraw,
    updateMode,
    uuid,
  } = props as ChartProps;
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const chartRef = useRef<ChartJS | null>();

  useEffect(() => {
    if (!chartRef.current) {
      return;
    }

    if (redraw) {
      destroyChart();
      setTimeout(renderChart);
    } else {
      chartRef.current.update(updateMode);
    }
  }, [redraw, updateMode, data, options, plugins]);

  useEffect(() => {
    renderChart();
    return () => destroyChart();
  }, []);

  const renderChart = () => {
    if (!canvasRef.current) {
      return;
    }
    chartRef.current = new ChartJS(canvasRef.current, {
      type,
      data,
      options: options && { ...options },
      plugins,
    });
  };
  const destroyChart = () => {
    if (chartRef.current) {
      chartRef.current.destroy();
      chartRef.current = null;
    }
  };
  return (
    <canvas
      ref={canvasRef}
      role="img"
      height={height}
      width={width}
      data-uuid={uuid}
      style={{ backgroundColor: 'white' }}
      className={styles['chart']}
    />
  );
}

function createTypedChart<T extends ChartType>(
  type: T,
  controller: ChartComponentLike,
) {
  ChartJS.register(controller);

  return memo((props: Omit<ChartProps<T>, 'type'>) => (
    <ChartComponent {...props} type={type} />
  ));
}

const Line = createTypedChart('line', LineController);
const Bar = createTypedChart('bar', BarController);
const Pie = createTypedChart('pie', PieController);
const Scatter = createTypedChart('scatter', ScatterController);
const Radar = createTypedChart('radar', RadarController);
const PolarArea = createTypedChart('polarArea', PolarAreaController);

const radarOptions = {
  elements: {
    line: {
      borderWidth: 3,
    },
  },
};
const radarPlugins = [Filler];

export const Chart: React.FunctionComponent<FloatElementItem> = memo(
  (props) => {
    const { chartType, width, height, labels, datasets, uuid, title } = props;
    const commonData = {
      labels,
      datasets: datasets.map((v, i) => ({
        ...v,
        backgroundColor: DEBUG_COLOR_LIST[i + 6],
      })),
    };
    const extra = {
      width,
      height,
      redraw: true,
      uuid,
      options: {
        plugins: {
          title: {
            display: true,
            text: title,
          },
          legend: {
            display: true,
          },
        },
      },
    };
    let node = null;
    if (chartType === 'line') {
      node = <Line {...extra} data={commonData} />;
    } else if (chartType === 'bar') {
      node = <Bar {...extra} data={commonData} />;
    } else if (chartType === 'pie') {
      node = <Pie {...extra} data={commonData} />;
    } else if (chartType === 'radar') {
      const data = {
        labels,
        datasets: datasets.map((v, i) => {
          const c = DEBUG_COLOR_LIST[i];
          return {
            ...v,
            fill: true,
            borderColor: c,
            pointBackgroundColor: c,
            pointBorderColor: '#fff',
            pointHoverBackgroundColor: '#fff',
            pointHoverBorderColor: c,
            backgroundColor: DEBUG_COLOR_LIST[i + 6],
          };
        }),
      };
      node = (
        <Radar
          {...extra}
          options={radarOptions}
          plugins={radarPlugins}
          data={data}
        />
      );
    } else if (chartType === 'scatter') {
      const data = {
        datasets: datasets.map((v, i) => {
          return {
            label: v.label,
            data: v.data.map((t, i) => ({ y: t, x: parseNumber(labels[i]) })),
            backgroundColor: DEBUG_COLOR_LIST[i + 6],
          };
        }),
      };
      node = <Scatter {...extra} data={data} />;
    } else if (chartType === 'polarArea') {
      const data = {
        labels,
        datasets: datasets.map((v) => {
          const list = Array.from({ length: v.data.length })
            .fill('')
            .map((_, i) => DEBUG_COLOR_LIST[i + 6]);
          return {
            ...v,
            backgroundColor: list,
          };
        }),
      };
      node = <PolarArea {...extra} data={data} />;
    } else {
      console.error('not support chart type', chartType);
    }
    return node;
  },
);
