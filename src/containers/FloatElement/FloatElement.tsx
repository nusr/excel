import React, { useRef, useEffect, useState, memo } from 'react';
import { IController, IWindowSize, CanvasOverlayPosition } from '@/types';
import styles from './FloatElement.module.css';
import { FloatElementItem } from '@/containers/store';
import { Chart } from './Chart';
import { FloatElementContextMenu } from './ContextMenu';
import { DEFAULT_POSITION, getHitInfo, classnames } from '@/util';

type FloatElementProps = FloatElementItem & {
  controller: IController;
  active: boolean;
  setActiveUuid: React.Dispatch<React.SetStateAction<string>>;
};
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
  active: boolean;
  moveStartX: number;
  moveStartY: number;
  top: number;
  left: number;
  resizeStartX: number;
  resizeStartY: number;
  resizePosition: string;
  width: number;
  height: number;
};

function computeSize(
  clientX: number,
  clientY: number,
  state: State,
): CanvasOverlayPosition {
  const deltaX = clientX - state.resizeStartX;
  const deltaY = clientY - state.resizeStartY;
  const p = state.resizePosition as ResizePosition;
  let height = state.height;
  let width = state.width;
  const top = state.top;
  const left = state.left;
  if (
    [
      ResizePosition.topRight,
      ResizePosition.topLeft,
      ResizePosition.top,
    ].includes(p)
  ) {
    height -= deltaY;
    // top = clientY - state.top;
  } else if (
    [
      ResizePosition.bottomRight,
      ResizePosition.bottom,
      ResizePosition.bottomLeft,
    ].includes(p)
  ) {
    height += deltaY;
  }

  if (
    [
      ResizePosition.topLeft,
      ResizePosition.bottomLeft,
      ResizePosition.left,
    ].includes(p)
  ) {
    width -= deltaX;
    // left = clientX - state.left;
  } else if (
    [
      ResizePosition.topRight,
      ResizePosition.bottomRight,
      ResizePosition.right,
    ].includes(p)
  ) {
    width += deltaX;
  }

  return {
    width: Math.floor(width),
    height: Math.floor(height),
    left: Math.floor(left),
    top: Math.floor(top),
  };
}

const initialState: State = {
  active: false,
  resizeStartX: 0,
  resizeStartY: 0,
  resizePosition: '',
  moveStartX: 0,
  moveStartY: 0,
  top: -1,
  left: -1,
  width: 0,
  height: 0,
};

export const FloatElement: React.FunctionComponent<FloatElementProps> = (
  props,
) => {
  const { controller, uuid, top, left, active, setActiveUuid, width, height } =
    props;
  const state = useRef<State>({...initialState});
  const [elementSize, setElementSize] = useState<IWindowSize>({
    width,
    height,
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
    setElementSize({ width, height });
  }, [top, left, width, height]);

  state.current.active = active;
  state.current.top = position.top;
  state.current.left = position.left;
  state.current.width = elementSize.width;
  state.current.height = elementSize.height;

  useEffect(() => {
    document.addEventListener('pointerup', handlePointerUp);
    document.addEventListener('pointermove', handlePointerMove);
    return () => {
      document.removeEventListener('pointerup', handlePointerUp);
      document.removeEventListener('pointermove', handlePointerMove);
    };
  }, []);

  const handlePointerUp = (event: PointerEvent) => {
    if (!state.current.active) {
      state.current = { ...initialState };
      return;
    }
    event.preventDefault();
    event.stopPropagation();
    if (state.current.resizePosition) {
      controller.transaction(() => {
        controller.updateFloatElement(uuid, 'height', state.current.height);
        controller.updateFloatElement(uuid, 'width', state.current.width);
      });
    }
    if (state.current.left >= 0 && state.current.top >= 0) {
      const newRange = getHitInfo(
        controller,
        state.current.left,
        state.current.top,
      );
      if (newRange) {
        controller.transaction(() => {
          controller.updateFloatElement(uuid, 'fromCol', newRange.col);
          controller.updateFloatElement(uuid, 'fromRow', newRange.row);
        });
      }
    }
    state.current = { ...initialState };
  };

  const handlePointerDown = (event: React.PointerEvent<HTMLDivElement>) => {
    event.preventDefault();
    event.stopPropagation();
    if (event.buttons !== 1) {
      return;
    }
    setActiveUuid(uuid);
    state.current.active = true;
    state.current.moveStartX = event.clientX;
    state.current.moveStartY = event.clientY;
  };

  const handleResizePointerDown = (
    event: React.PointerEvent<HTMLDivElement>,
  ) => {
    event.preventDefault();
    event.stopPropagation();
    if (event.buttons !== 1) {
      return;
    }
    const p = event.currentTarget.dataset.position || '';
    if (!p) {
      return;
    }
    state.current.resizePosition = p;
    state.current.resizeStartX = event.clientX;
    state.current.resizeStartY = event.clientY;
  };
  const handlePointerMove = (event: PointerEvent) => {
    if (event.buttons !== 1) {
      return;
    }
    if (!state.current.active) {
      return;
    }
    event.preventDefault();
    event.stopPropagation();
    if (state.current.resizePosition) {
      const newSize = computeSize(event.clientX, event.clientY, state.current);
      setElementSize(newSize);
      // updatePosition(newSize.top, newSize.left);
      state.current.resizeStartX = event.clientX;
      state.current.resizeStartY = event.clientY;
      return;
    }
    const diffX = event.clientX - state.current.moveStartX;
    const diffY = event.clientY - state.current.moveStartY;

    setPosition((oldPosition) => {
      let newTop = oldPosition.top + diffY;
      let newLeft = oldPosition.left + diffX;
      const size = controller.getHeaderSize();
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
    state.current.moveStartX = event.clientX;
    state.current.moveStartY = event.clientY;
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
      <img
        title={props.title}
        alt={props.title}
        src={props.imageSrc!}
        className={styles['image']}
      />
    );
  } else if (props.type === 'chart') {
    children = (
      <Chart {...props} width={elementSize.width} height={elementSize.height} />
    );
  }
  if (!children) {
    return null;
  }
  return (
    <React.Fragment>
      <div
        key={uuid}
        onPointerDown={handlePointerDown}
        onContextMenu={handleContextMenu}
        className={classnames(styles['float-element'], {
          [styles['active']]: active,
        })}
        style={{
          transform: `translateX(${position.left}px) translateY(${position.top}px)`,
          width: elementSize.width,
          height: elementSize.height,
        }}
      >
        {children}
        {active && (
          <React.Fragment>
            <div
              className={classnames(styles['resize-handler'], styles['top'])}
              data-position={ResizePosition.top}
              onPointerDown={handleResizePointerDown}
            >
              <div className={styles['scale-dot']}></div>
            </div>
            <div
              className={classnames(
                styles['resize-handler'],
                styles['top-right'],
              )}
              data-position={ResizePosition.topRight}
              onPointerDown={handleResizePointerDown}
            >
              <div className={styles['scale-dot']}></div>
            </div>
            <div
              className={classnames(
                styles['resize-handler'],
                styles['top-left'],
              )}
              data-position={ResizePosition.topLeft}
              onPointerDown={handleResizePointerDown}
            >
              <div className={styles['scale-dot']}></div>
            </div>
            <div
              className={classnames(styles['resize-handler'], styles['left'])}
              data-position={ResizePosition.left}
              onPointerDown={handleResizePointerDown}
            >
              <div className={styles['scale-dot']}></div>
            </div>
            <div
              className={classnames(styles['resize-handler'], styles['right'])}
              data-position={ResizePosition.right}
              onPointerDown={handleResizePointerDown}
            >
              <div className={styles['scale-dot']}></div>
            </div>
            <div
              className={classnames(
                styles['resize-handler'],
                styles['bottom-right'],
              )}
              data-position={ResizePosition.bottomRight}
              onPointerDown={handleResizePointerDown}
            >
              <div className={styles['scale-dot']}></div>
            </div>
            <div
              className={classnames(
                styles['resize-handler'],
                styles['bottom-left'],
              )}
              data-position={ResizePosition.bottomLeft}
              onPointerDown={handleResizePointerDown}
            >
              <div className={styles['scale-dot']}></div>
            </div>
            <div
              className={classnames(styles['resize-handler'], styles['bottom'])}
              data-position={ResizePosition.bottom}
              onPointerDown={handleResizePointerDown}
            >
              <div className={styles['scale-dot']}></div>
            </div>
          </React.Fragment>
        )}
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
};
