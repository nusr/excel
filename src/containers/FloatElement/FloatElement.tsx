import React, { useRef, useEffect, useState } from 'react';
import { IController } from '@/types';
import styles from './FloatElement.module.css';
import { FloatElementItem } from '@/containers/store';
import { Line, Bar } from './Chart';
import { DEBUG_COLOR_LIST } from '@/util';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';

function getRandomColor() {
  const index = Math.floor(Math.random() * DEBUG_COLOR_LIST.length);
  return DEBUG_COLOR_LIST[index];
}

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
);

type FloatElementProps = FloatElementItem & { controller: IController };

export const FloatElement: React.FunctionComponent<FloatElementProps> = (
  props,
) => {
  const { controller } = props;
  const isMouseDown = useRef(false);
  const [position, setPosition] = useState({
    top: props.top,
    left: props.left,
  });
  const prePosition = useRef({
    x: 0,
    y: 0,
  });
  useEffect(() => {
    document.addEventListener('mouseup', handleMouseUp);
    document.addEventListener('mousemove', handleMouseMove);
    return () => {
      document.removeEventListener('mouseup', handleMouseUp);
      document.removeEventListener('mousemove', handleMouseMove);
    };
  }, []);
  function handleMouseUp() {
    isMouseDown.current = false;
  }

  const handleMouseDown = (event: React.MouseEvent<HTMLDivElement>) => {
    if (event.button !== 0) {
      return;
    }
    event.preventDefault();
    event.stopPropagation();
    isMouseDown.current = true;
    prePosition.current = {
      x: event.clientX,
      y: event.clientY,
    };
  };

  const handleMouseMove = (event: MouseEvent) => {
    if (!isMouseDown.current) {
      return;
    }
    const diffX = event.clientX - prePosition.current.x;
    const diffY = event.clientY - prePosition.current.y;
    prePosition.current = {
      x: event.clientX,
      y: event.clientY,
    };

    setPosition((oldPosition) => {
      const size = controller.getHeaderSize();
      let newTop = oldPosition.top + diffY;
      let newLeft = oldPosition.left + diffX;

      const minTop = size.height;
      const minLeft = size.width;

      if (newTop < minTop) {
        newTop = minTop;
      }
      if (newLeft < minLeft) {
        newLeft = minLeft;
      }
      return { top: newTop, left: newLeft };
    });
  };

  let children = null;
  if (props.type === 'floating-picture') {
    children = (
      <img title={props.title} alt={props.title} src={props.imageSrc!} />
    );
  } else if (props.type === 'chart') {
    const chartProps = {
      width: props.width,
      height: props.height,
      labels: props.labels,
      datasets: props.datasets,
      title: props.title,
    };
    chartProps.datasets = chartProps.datasets.map((v) => ({
      ...v,
      backgroundColor: getRandomColor(),
    }));
    if (props.chartType === 'line') {
      children = <Line {...chartProps} />;
    } else if (props.chartType === 'bar') {
      children = <Bar {...chartProps} />;
    } else {
      console.error('not support chart type', props.chartType);
      return null;
    }
  } else {
    return null;
  }

  return (
    <div
      onMouseDown={handleMouseDown}
      className={styles['float-element']}
      style={{
        width: props.width,
        height: props.height,
        transform: `translateX(${position.left}px) translateY(${position.top}px)`,
      }}
    >
      {children}
    </div>
  );
};
