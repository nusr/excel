import React, { useRef, useEffect, useState, memo } from 'react';
import { IController } from '@/types';
import styles from './FloatElement.module.css';
import { FloatElementItem } from '@/containers/store';
import { Chart } from './Chart';
import { FloatElementContextMenu } from './ContextMenu';
import { DEFAULT_POSITION, getHitInfo, classnames } from '@/util';
import {
  State,
  ResizePosition,
  FloatElementPosition,
  INITIAL_STATE,
} from './util';
type FloatElementProps = FloatElementItem & {
  controller: IController;
  active: boolean;
  setActiveUuid: React.Dispatch<React.SetStateAction<string>>;
};

function roundPosition(top: number, left: number, controller: IController) {
  const size = controller.getHeaderSize();
  const minTop = size.height;
  const minLeft = size.width;
  if (top < minTop) {
    top = minTop;
  }
  if (left < minLeft) {
    left = minLeft;
  }
  return {
    top,
    left,
  };
}

export const FloatElement: React.FunctionComponent<FloatElementProps> = memo(
  (props) => {
    const {
      controller,
      uuid,
      top,
      left,
      active,
      setActiveUuid,
      width,
      height,
    } = props;
    const state = useRef<State>({ ...INITIAL_STATE });
    const ref = useRef<HTMLDivElement>(null);
    const [position, setPosition] = useState<FloatElementPosition>({
      top,
      left,
      width,
      height,
      angle: 0,
    });
    const [contextMenuPosition, setContextMenuPosition] = useState({
      top: DEFAULT_POSITION,
      left: DEFAULT_POSITION,
    });

    useEffect(() => {
      setPosition({ top, left, width, height, angle: 0 });
    }, [top, left, width, height]);

    state.current.active = active;
    state.current.position = position;

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
        state.current = { ...INITIAL_STATE };
        return;
      }
      event.stopPropagation();
      event.preventDefault();
      if (
        state.current.resizePosition &&
        state.current.position.height > 0 &&
        state.current.position.width > 0
      ) {
        controller.transaction(() => {
          controller.updateFloatElement(
            uuid,
            'height',
            state.current.position.height,
          );
          controller.updateFloatElement(
            uuid,
            'width',
            state.current.position.width,
          );
        });
      }
      if (state.current.position.left >= 0 && state.current.position.top >= 0) {
        const newRange = getHitInfo(
          controller,
          state.current.position.left,
          state.current.position.top,
        );
        if (newRange) {
          controller.transaction(() => {
            controller.updateFloatElement(uuid, 'fromCol', newRange.col);
            controller.updateFloatElement(uuid, 'fromRow', newRange.row);
            controller.updateFloatElement(uuid, 'marginX', newRange.marginX);
            controller.updateFloatElement(uuid, 'marginY', newRange.marginY);
          });
        }
      }
      state.current = { ...INITIAL_STATE };
    };

    const handlePointerDown = (event: React.PointerEvent<HTMLDivElement>) => {
      event.stopPropagation();
      event.preventDefault();
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
      event.stopPropagation();
      event.preventDefault();
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
    const updateSize = (e: PointerEvent) => {
      const deltaX = Math.round(e.clientX - state.current.resizeStartX);
      const deltaY = Math.round(e.clientY - state.current.resizeStartY);
      setPosition((old) => {
        const p = state.current.resizePosition as ResizePosition;
        let { top, left, width, height } = old;
        if (
          [
            ResizePosition.topRight,
            ResizePosition.topLeft,
            ResizePosition.top,
          ].includes(p)
        ) {
          height -= deltaY;
          top += deltaY;
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
          left += deltaX;
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
          ...roundPosition(top, left, controller),
          angle: old.angle,
          width,
          height,
        };
      });
    };
    const updateRotate = (event: PointerEvent) => {
      setPosition((old) => {
        const rect = ref.current!.getBoundingClientRect();
        const currentAngle =
          Math.atan2(
            event.clientY - (rect.top + old.top),
            event.clientX - (rect.left + old.left + rect.width / 2),
          ) *
          (180 / Math.PI);
        return {
          ...old,
          angle: currentAngle - old.angle,
        };
      });
    };
    const handlePointerMove = (event: PointerEvent) => {
      if (event.buttons !== 1) {
        return;
      }
      if (!state.current.active) {
        return;
      }
      event.stopPropagation();
      event.preventDefault();
      if (state.current.resizePosition) {
        if (state.current.resizePosition === ResizePosition.rotate) {
          updateRotate(event);
        } else {
          updateSize(event);
        }
        state.current.resizeStartX = event.clientX;
        state.current.resizeStartY = event.clientY;
        return;
      }
      const deltaX = Math.round(event.clientX - state.current.moveStartX);
      const deltaY = Math.round(event.clientY - state.current.moveStartY);
      setPosition((old) => {
        const newTop = old.top + deltaY;
        const newLeft = old.left + deltaX;
        return {
          ...roundPosition(newTop, newLeft, controller),
          angle: old.angle,
          width: old.width,
          height: old.height,
        };
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
        <Chart {...props} width={position.width} height={position.height} />
      );
    }
    if (!children) {
      return null;
    }
    return (
      <React.Fragment>
        <div
          key={uuid}
          ref={ref}
          onPointerDown={handlePointerDown}
          onContextMenu={handleContextMenu}
          className={classnames(styles['float-element'], {
            [styles['active']]: active,
          })}
          style={{
            transform: `translateX(${position.left}px) translateY(${position.top}px) rotate(${position.angle}deg)`,
            width: position.width,
            height: position.height,
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
                className={classnames(
                  styles['resize-handler'],
                  styles['right'],
                )}
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
                className={classnames(
                  styles['resize-handler'],
                  styles['bottom'],
                )}
                data-position={ResizePosition.bottom}
                onPointerDown={handleResizePointerDown}
              >
                <div className={styles['scale-dot']}></div>
              </div>
              {/* <div
                className={classnames(
                  styles['resize-handler'],
                  styles['rotate'],
                )}
                data-position={ResizePosition.rotate}
                onPointerDown={handleResizePointerDown}
              >
                <div className={styles['scale-dot']}></div>
              </div> */}
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
  },
);
