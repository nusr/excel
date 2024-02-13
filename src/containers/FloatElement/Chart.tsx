import React, { useRef, useEffect } from 'react';
import { Chart as ChartJS, BarController, LineController } from 'chart.js';
import type {
  ChartType,
  DefaultDataPoint,
  ChartData,
  ChartComponentLike,
  UpdateMode,
} from 'chart.js';

export interface ChartProps<
  TType extends ChartType = ChartType,
  TData = DefaultDataPoint<TType>,
  TLabel = unknown,
> {
  width: number;
  height: number;
  type: ChartType;
  labels: string[];
  datasets: ChartData<TType, TData, TLabel>['datasets'];
  title: string;
  redraw?: boolean;
  updateMode?: UpdateMode;
}

function ChartComponent<
  TType extends ChartType = ChartType,
  TData = DefaultDataPoint<TType>,
  TLabel = unknown,
>(props: ChartProps<TType, TData, TLabel>) {
  const {
    height = 150,
    width = 300,
    type,
    labels,
    datasets,
    title,
    redraw,
    updateMode,
  } = props as ChartProps;
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const chartRef = useRef<ChartJS | null>();

  useEffect(() => {
    if (!chartRef.current) return;

    if (redraw) {
      destroyChart();
      setTimeout(renderChart);
    } else {
      chartRef.current.update(updateMode);
    }
  }, [redraw, updateMode]);

  useEffect(() => {
    if (!chartRef.current) return;

    destroyChart();
    setTimeout(renderChart);
  }, [type]);

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
      data: {
        labels,
        datasets,
      },
      options: {
        responsive: true,
        plugins: {
          legend: {
            position: 'bottom',
          },
          title: {
            display: true,
            text: title,
          },
        },
      },
    });
  };
  const destroyChart = () => {
    if (chartRef.current) {
      chartRef.current.destroy();
      chartRef.current = null;
    }
  };
  return (
    <canvas ref={canvasRef} role="img" height={height} width={width}></canvas>
  );
}

function createTypedChart<T extends ChartType>(
  type: T,
  controller: ChartComponentLike,
) {
  ChartJS.register(controller);

  return (props: Omit<ChartProps<T>, 'type'>) => (
    <ChartComponent {...props} type={type} />
  );
}

export const Line = createTypedChart('line', LineController);

export const Bar = createTypedChart('bar', BarController);
