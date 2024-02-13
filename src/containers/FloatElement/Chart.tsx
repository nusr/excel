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
import { ChartProps, IController } from '@/types';
import styles from './FloatElement.module.css';

function getRandomColor() {
  const index = Math.floor(Math.random() * DEBUG_COLOR_LIST.length);
  return DEBUG_COLOR_LIST[index];
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

export const Chart: React.FunctionComponent<
  FloatElementItem & { controller: IController }
> = memo((props) => {
  const {
    chartType,
    width,
    height,
    labels,
    datasets,
    title,
    controller,
    uuid,
  } = props;
  const commonData = {
    labels,
    datasets: datasets.map((v, i) => ({
      ...v,
      backgroundColor: DEBUG_COLOR_LIST[i],
    })),
  };
  const extra = {
    width,
    height,
    redraw: true,
    uuid,
  };
  const handleBlur = (event: React.FocusEvent<HTMLInputElement>) => {
    const v = event.currentTarget.value;
    controller.updateFloatElement(uuid, 'title', v);
  };
  const preventDefault = (event: React.BaseSyntheticEvent) => {
    event.preventDefault();
    event.stopPropagation();
    return false;
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
        const c = getRandomColor();
        return {
          ...v,
          fill: true,
          borderColor: c,
          pointBackgroundColor: c,
          pointBorderColor: '#fff',
          pointHoverBackgroundColor: '#fff',
          pointHoverBorderColor: c,
          backgroundColor: DEBUG_COLOR_LIST[i],
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
          backgroundColor: DEBUG_COLOR_LIST[i],
        };
      }),
    };
    node = <Scatter {...extra} data={data} />;
  } else if (chartType === 'polarArea') {
    const data = {
      labels,
      datasets: datasets.map((v) => {
        const list = new Array(v.data.length)
          .fill('')
          .map(() => getRandomColor());
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
  if (!node) {
    return null;
  }
  return (
    <React.Fragment>
      {/* TODO: clicking input can not get focus */}
      <input
        className={styles['title']}
        type="text"
        defaultValue={title}
        onChange={preventDefault}
        onBlur={handleBlur}
        onContextMenu={preventDefault}
      />
      {node}
    </React.Fragment>
  );
});
