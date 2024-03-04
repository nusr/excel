import React, { useRef, useEffect, useState, memo } from 'react';
import { IController } from '@/types';
import styles from './FloatElement.module.css';
import { FloatElementItem } from '@/containers/store';
import { Chart } from './Chart';
import { FloatElementContextMenu } from './ContextMenu';
import { DEFAULT_POSITION, getHitInfo } from '@/util';

type FloatElementProps = FloatElementItem & { controller: IController };

export const FloatElement: React.FunctionComponent<FloatElementProps> = memo(
  (props) => {
    const { controller, uuid, fromRow, fromCol, top, left } = props;
    const isPointerDown = useRef(false);
    const latestPosition = useRef({ top: -1, left: -1 });
    const preMovePosition = useRef({
      x: 0,
      y: 0,
    });
    const [position, setPosition] = useState({
      top,
      left,
    });
    const [contextMenuPosition, setContextMenuPosition] = useState({
      top: DEFAULT_POSITION,
      left: DEFAULT_POSITION,
    });
    useEffect(() => {
      setPosition({ top, left });
    }, [top, left]);
    useEffect(() => {
      document.addEventListener('pointerup', handlePointerUp);
      document.addEventListener('pointermove', handlePointerMove);
      return () => {
        document.removeEventListener('pointerup', handlePointerUp);
        document.removeEventListener('pointermove', handlePointerMove);
      };
    }, []);
    const handlePointerUp = (event: PointerEvent) => {
      isPointerDown.current = false;
      preMovePosition.current = {
        x: 0,
        y: 0,
      };
      if (event.buttons !== 1) {
        latestPosition.current = {
          top: -1,
          left: -1,
        };
        return;
      }
      const newRange = getHitInfo(
        controller,
        latestPosition.current.left,
        latestPosition.current.top,
      );
      if (!newRange) {
        return;
      }
      if (fromRow === newRange.row && fromCol === newRange.col) {
        return;
      }
      controller.transaction(() => {
        controller.updateFloatElement(uuid, 'fromCol', newRange.col);
        controller.updateFloatElement(uuid, 'fromRow', newRange.row);
      });
      latestPosition.current = {
        top: -1,
        left: -1,
      };
    };

    const handlePointerDown = (event: React.PointerEvent<HTMLDivElement>) => {
      if (event.buttons !== 1) {
        return;
      }
      event.preventDefault();
      event.stopPropagation();
      isPointerDown.current = true;
      preMovePosition.current = {
        x: event.clientX,
        y: event.clientY,
      };
    };

    const handlePointerMove = (event: PointerEvent) => {
      if (event.buttons !== 1) {
        return;
      }
      if (!isPointerDown.current) {
        return;
      }
      const diffX = event.clientX - preMovePosition.current.x;
      const diffY = event.clientY - preMovePosition.current.y;
      preMovePosition.current = {
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
        latestPosition.current.top = newTop;
        latestPosition.current.left = newLeft;
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
          onPointerDown={handlePointerDown}
          onContextMenu={handleContextMenu}
          className={styles['float-element']}
          style={{
            transform: `translateX(${position.left}px) translateY(${position.top}px)`,
          }}
        >
          {children}
          <div className={styles['scale-container']}>
            <div className={styles['scale-dot']}></div>
          </div>
          <div className={styles['scale-container-rect']}>
            <div className={styles['scale-rect']}></div>
          </div>
        </div>
        {contextMenuPosition.top >= 0 && contextMenuPosition.left >= 0 && (
          <FloatElementContextMenu
            {...props}
            menuLeft={contextMenuPosition.left}
            menuTop={contextMenuPosition.top}
            hideContextMenu={hideContextMenu}
          />
        )}
      </React.Fragment>
    );
  },
);
