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
import { parseNumber, deepEqual } from '../../util';
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

function createTypedChart<T extends ChartType>(type: T, controller: ChartComponentLike) {
  ChartJS.register(controller);

  return memo((props: Omit<ChartProps<T>, 'type'>) => <ChartComponent {...props} type={type} />);
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

const CHART_COLORS = [
  '#4E79A7',
  '#F28E2B',
  '#E15759',
  '#76B7B2',
  '#59A14F',
  '#EDC948',
  '#B07AA1',
  '#FF9DA7',
  '#9C755F',
  '#79706E',
];

function getColor(index: number): string {
  const count = CHART_COLORS.length;
  return CHART_COLORS[((Math.floor(index) % count) + count) % count];
}

const Chart: React.FunctionComponent<FloatElementItem> = memo((props) => {
  const { chartType, width, height, labels, datasets, uuid, title } = props;
  const commonData = {
    labels,
    datasets: datasets.map((v, i) => ({
      ...v,
      backgroundColor: getColor(i),
      borderColor: getColor(i),
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
    const data = {
      labels,
      datasets: datasets.map((dataset) => ({
        ...dataset,
        backgroundColor: dataset.data.map((_, index) => getColor(index)),
      })),
    };
    node = <Pie {...extra} data={data} />;
  } else if (chartType === 'radar') {
    const data = {
      labels,
      datasets: datasets.map((v, i) => {
        const color = getColor(i);
        return {
          ...v,
          fill: true,
          borderColor: color,
          pointBackgroundColor: color,
          pointBorderColor: getThemeColor('white'),
          pointHoverBackgroundColor: getThemeColor('white'),
          pointHoverBorderColor: color,
          backgroundColor: `${color}33`,
        };
      }),
    };
    node = <Radar {...extra} options={radarOptions} plugins={radarPlugins} data={data} />;
  } else if (chartType === 'scatter') {
    const data = {
      datasets: datasets.map((v, i) => {
        return {
          label: v.label,
          data: v.data.map((t, i) => ({ y: t, x: parseNumber(labels[i])[1] })),
          backgroundColor: getColor(i),
        };
      }),
    };
    node = <Scatter {...extra} data={data} />;
  } else if (chartType === 'polarArea') {
    const data = {
      labels,
      datasets: datasets.map((v) => {
        const list = v.data.map((_, index) => getColor(index));
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
