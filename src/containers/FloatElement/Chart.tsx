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
import { COLOR_PICKER_COLOR_LIST, parseNumber, deepEqual } from '../../util';
import { getThemeColor } from '../../theme';
import type { FloatElementItem } from '../../containers/store';
import styles from './chart.module.css';
import type { ChartData, ChartOptions, Plugin, UpdateMode } from 'chart.js';

export interface ChartProps<
  TType extends ChartType = ChartType,
  TData = DefaultDataPoint<TType>,
  TLabel = unknown,
> {
  width: number;
  height: number;
  uuid?: string;
  type: ChartType;
  data: ChartData<TType, TData, TLabel>;
  options?: ChartOptions<TType>;
  plugins?: Plugin<TType>[];
  redraw?: boolean;
  updateMode?: UpdateMode;
}

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
  const chartRef = useRef<ChartJS | null>(null);

  useEffect(() => {
    if (!chartRef.current) {
      return;
    }

    if (redraw) {
      destroyChart();
      setTimeout(renderChart);
    } else {
      if (!deepEqual(chartRef.current.data, data)) {
        chartRef.current.data = data;
      }
      if (options && !deepEqual(chartRef.current.options, options)) {
        chartRef.current.options = options;
      }
      chartRef.current.update(updateMode);
    }
  }, [redraw, updateMode, data, options]);

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
      options,
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
      className={styles['chart']}
      data-testid="float-element-chart"
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

const colorOffset = 5;

function getColor(i: number): string {
  const index = Math.floor(i) % COLOR_PICKER_COLOR_LIST.length;
  return COLOR_PICKER_COLOR_LIST[index];
}

const Chart: React.FunctionComponent<FloatElementItem> = memo((props) => {
  const { chartType, width, height, labels, datasets, uuid, title } = props;
  const commonData = {
    labels,
    datasets: datasets.map((v, i) => ({
      ...v,
      backgroundColor: getColor(i * colorOffset),
    })),
  };
  const extra = {
    width,
    height,
    redraw: false,
    uuid,
    options: {
      plugins: {
        title: {
          display: true,
          text: title,
          padding: {
            top: 16,
            bottom: 16,
          },
          font: {
            size: 14,
            weight: 'normal' as const,
          },
        },
        legend: {
          display: true,
          position: 'bottom' as const,
        },
      },
    },
  };
  let node: React.ReactNode = undefined;
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
        const c = getColor(i * colorOffset + 4);
        return {
          ...v,
          fill: true,
          borderColor: c,
          pointBackgroundColor: c,
          pointBorderColor: getThemeColor('white'),
          pointHoverBackgroundColor: getThemeColor('white'),
          pointHoverBorderColor: c,
          backgroundColor: getColor(i * colorOffset),
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
          data: v.data.map((t, i) => ({ y: t, x: parseNumber(labels[i])[1] })),
          backgroundColor: getColor(i * colorOffset),
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
          .map((_, i) => getColor(i * colorOffset));
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
});

Chart.displayName = 'Chart';

export default Chart;
