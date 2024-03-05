import React, { useRef, useEffect, useState, memo } from 'react';
import { IController, IWindowSize } from '@/types';
import styles from './FloatElement.module.css';
import { FloatElementItem } from '@/containers/store';
import { Chart } from './Chart';
import { FloatElementContextMenu } from './ContextMenu';
import { DEFAULT_POSITION, getHitInfo, classnames } from '@/util';

type FloatElementProps = FloatElementItem & {
  controller: IController;
  zIndex: number;
  setMoveUuid: (uuid: string) => void;
};

function computeSize(
  originSize: IWindowSize,
  deltaSize: IWindowSize,
  p: ResizePosition,
): IWindowSize {
  let height = originSize.height;
  let width = originSize.width;
  if (
    [
      ResizePosition.topRight,
      ResizePosition.topLeft,
      ResizePosition.top,
    ].includes(p)
  ) {
    height -= deltaSize.height;
  } else if (
    [
      ResizePosition.bottomRight,
      ResizePosition.bottom,
      ResizePosition.bottomLeft,
    ].includes(p)
  ) {
    height += deltaSize.height;
  }

  if (
    [
      ResizePosition.topLeft,
      ResizePosition.bottomLeft,
      ResizePosition.left,
    ].includes(p)
  ) {
    width -= deltaSize.width;
  } else if (
    [
      ResizePosition.topRight,
      ResizePosition.bottomRight,
      ResizePosition.right,
    ].includes(p)
  ) {
    width += deltaSize.width;
  }
  if (originSize.width !== width) {
    // width
    const w = Math.floor(width);
    const h = Math.floor((w * originSize.height) / originSize.width);
    return {
      width: w,
      height: h,
    };
  } else {
    // height
    const h = Math.floor(height);
    const w = Math.floor((h * originSize.width) / originSize.height);
    return {
      height: h,
      width: w,
    };
  }
}

enum ResizePosition {
  top = 'top',
  topRight = 'top-right',
  topLeft = 'top-left',
  bottom = 'bottom',
  bottomLeft = 'bottom-left',
  bottomRight = 'bottom-right',
  left = 'left',
  right = 'right',
}
type State = {
  pointerDown: boolean;
  moveStartX: number;
  moveStartY: number;
  top: number;
  left: number;
  resizeStartX: number;
  resizeStartY: number;
  resizePosition: string;
};

export const FloatElement: React.FunctionComponent<FloatElementProps> = memo(
  (props) => {
    const {
      controller,
      uuid,
      fromRow,
      fromCol,
      top,
      left,
      zIndex,
      setMoveUuid,
      width,
      height,
    } = props;
    const state = useRef<State>({
      pointerDown: false,
      resizeStartX: 0,
      resizeStartY: 0,
      resizePosition: '',
      moveStartX: 0,
      moveStartY: 0,
      top: -1,
      left: -1,
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
      event.preventDefault();
      event.stopPropagation();

      state.current.pointerDown = false;
      state.current.moveStartX = 0;
      state.current.moveStartY = 0;
      setMoveUuid('');
      if (state.current.resizePosition) {
        stopResize(event);
        return;
      }

      const newRange = getHitInfo(
        controller,
        state.current.left,
        state.current.top,
      );
      if (!newRange || (fromRow === newRange.row && fromCol === newRange.col)) {
        state.current.top = -1;
        state.current.left = -1;
        state.current.resizeStartX = 0;
        state.current.resizeStartX = 0;
        return;
      }
      controller.transaction(() => {
        controller.updateFloatElement(uuid, 'fromCol', newRange.col);
        controller.updateFloatElement(uuid, 'fromRow', newRange.row);
      });
      state.current.top = -1;
      state.current.left = -1;
      state.current.resizeStartX = 0;
      state.current.resizeStartX = 0;
    };

    const handlePointerDown = (event: React.PointerEvent<HTMLDivElement>) => {
      if (event.buttons !== 1) {
        return;
      }
      event.preventDefault();
      event.stopPropagation();
      setMoveUuid(uuid);
      if ((event.target as any).dataset.position) {
        state.current.resizePosition =
          event.currentTarget.dataset.position || '';
        state.current.resizeStartX = event.clientX;
        state.current.resizeStartY = event.clientY;
        return;
      }
      state.current.pointerDown = true;
      state.current.moveStartX = event.clientX;
      state.current.moveStartY = event.clientY;
    };

    const handleResizePointerDown = (
      event: React.PointerEvent<HTMLDivElement>,
    ) => {
      if (event.buttons !== 1) {
        return;
      }
      event.preventDefault();
      event.stopPropagation();
      setMoveUuid(uuid);
      state.current.resizePosition = event.currentTarget.dataset.position || '';
      state.current.resizeStartX = event.clientX;
      state.current.resizeStartY = event.clientY;
    };
    const handlePointerMove = (event: PointerEvent) => {
      event.preventDefault();
      event.stopPropagation();
      if (!state.current.pointerDown) {
        return;
      }
      const diffX = event.clientX - state.current.moveStartX;
      const diffY = event.clientY - state.current.moveStartY;

      state.current.moveStartX = event.clientX;
      state.current.moveStartY = event.clientY;

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
        state.current.top = newTop;
        state.current.left = newLeft;
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

    const stopResize = (event: PointerEvent) => {
      const deltaX = event.clientX - state.current.resizeStartX;
      const deltaY = event.clientY - state.current.resizeStartY;
      const size = computeSize(
        { width: props.width, height: props.height },
        { width: deltaX, height: deltaY },
        state.current.resizePosition as ResizePosition,
      );
      controller.transaction(() => {
        if (size.height !== props.height) {
          controller.updateFloatElement(uuid, 'height', size.height);
        }
        if (size.width !== props.width) {
          controller.updateFloatElement(uuid, 'width', size.width);
        }
      });

      state.current.resizeStartX = 0;
      state.current.resizeStartX = 0;
      state.current.resizePosition = '';
    };

    let children = null;
    if (props.type === 'floating-picture') {
      children = (
        <img
          title={props.title}
          alt={props.title}
          src={props.imageSrc!}
          className={styles['image']}
        />
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
            zIndex: zIndex,
            width,
            height,
          }}
        >
          {children}
          <div
            className={classnames(
              styles['resize-handler'],
              styles['top-right'],
            )}
            data-position={ResizePosition.topRight}
            onMouseDown={handleResizePointerDown}
          >
            <div className={styles['scale-dot']}></div>
          </div>
          <div
            className={classnames(styles['resize-handler'], styles['top-left'])}
            data-position={ResizePosition.topLeft}
            onMouseDown={handleResizePointerDown}
          >
            <div className={styles['scale-dot']}></div>
          </div>

          <div
            className={classnames(styles['resize-handler'], styles['top'])}
            data-position={ResizePosition.top}
            onMouseDown={handleResizePointerDown}
          >
            <div className={styles['scale-dot']}></div>
          </div>
          <div
            className={classnames(styles['resize-handler'], styles['bottom'])}
            data-position={ResizePosition.bottom}
            onMouseDown={handleResizePointerDown}
          >
            <div className={styles['scale-dot']}></div>
          </div>

          <div
            className={classnames(styles['resize-handler'], styles['left'])}
            data-position={ResizePosition.left}
            onMouseDown={handleResizePointerDown}
          >
            <div className={styles['scale-dot']}></div>
          </div>
          <div
            className={classnames(styles['resize-handler'], styles['right'])}
            data-position={ResizePosition.right}
            onMouseDown={handleResizePointerDown}
          >
            <div className={styles['scale-dot']}></div>
          </div>

          <div
            className={classnames(
              styles['resize-handler'],
              styles['bottom-right'],
            )}
            data-position={ResizePosition.bottomRight}
            onMouseDown={handleResizePointerDown}
          >
            <div className={styles['scale-dot']}></div>
          </div>
          <div
            className={classnames(
              styles['resize-handler'],
              styles['bottom-left'],
            )}
            data-position={ResizePosition.bottomLeft}
            onMouseDown={handleResizePointerDown}
          >
            <div className={styles['scale-dot']}></div>
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
