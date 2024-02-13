import React, { useRef, useEffect, useState } from 'react';
import { IController } from '@/types';
import styles from './FloatElement.module.css';
import { FloatElementItem } from '@/containers/store';
import { Chart } from './Chart';
import { ContextMenu } from './ContextMenu';
import { DEFAULT_POSITION } from '@/util';

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
  const [contextMenuPosition, setContextMenuPosition] = useState({
    top: DEFAULT_POSITION,
    left: DEFAULT_POSITION,
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

  const handleContextMenu = (event: React.MouseEvent<HTMLDivElement>) => {
    event.preventDefault();
    event.stopPropagation();
    setContextMenuPosition({ top: event.clientY, left: event.clientX });
    return false;
  };
  const hideContextMenu = () => {
    setContextMenuPosition({
      top: DEFAULT_POSITION,
      left: DEFAULT_POSITION,
    });
  };

  let children = null;
  if (props.type === 'floating-picture') {
    children = (
      <img title={props.title} alt={props.title} src={props.imageSrc!} />
    );
  } else if (props.type === 'chart') {
    children = <Chart {...props} />;
  }
  if (!children) {
    return null;
  }

  return (
    <React.Fragment>
      <div
        onMouseDown={handleMouseDown}
        onContextMenu={handleContextMenu}
        className={styles['float-element']}
        style={{
          transform: `translateX(${position.left}px) translateY(${position.top}px)`,
        }}
      >
        {children}
      </div>
      {contextMenuPosition.top >= 0 && contextMenuPosition.left >= 0 && (
        <ContextMenu
          {...contextMenuPosition}
          uuid={props.uuid}
          type={props.type}
          controller={controller}
          hideContextMenu={hideContextMenu}
        />
      )}
    </React.Fragment>
  );
};
