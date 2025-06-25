import React, {
  Fragment,
  memo,
  useState,
  useEffect,
  useRef,
  useMemo,
  useCallback,
} from 'react';
import { IWindowSize } from '../../types';
import {
  useCoreStore,
  FloatElementItem,
  useExcel,
} from '../../containers/store';
import { FloatElement } from './FloatElement';
import styles from './FloatElement.module.css';
import { getHitInfo, classnames } from '../../util';
import {
  State,
  ResizePosition,
  FloatElementPosition,
  INITIAL_STATE,
  roundPosition,
} from './util';

interface Props {
  floatElementList: FloatElementItem[];
  activeUuid: string;
}
const FloatElementContainer: React.FunctionComponent<Props> = memo(
  ({ floatElementList, activeUuid }) => {
    const { controller } = useExcel();
    const setActiveUuid = useCoreStore((state) => state.setActiveUuid);
    const state = useRef<State>({
      ...INITIAL_STATE,
      position: { ...INITIAL_STATE.position },
    });

    const [position, setPosition] = useState<FloatElementPosition>({
      width: -1,
      height: -1,
      imageAngle: 0,
      top: -1,
      left: -1,
    });
    state.current.activeUuid = activeUuid;
    state.current.position = { ...position };

    const [toggleEvents] = useMemo(() => {
      const updateSize = (e: PointerEvent) => {
        const deltaX = Math.round(e.clientX - state.current.moveStartX);
        const deltaY = Math.round(e.clientY - state.current.moveStartY);
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

          const newData = {
            ...roundPosition(top, left, controller),
            imageAngle: old.imageAngle,
            width,
            height,
          };
          return newData;
        });
      };
      const handlePointerUp = (event: PointerEvent) => {
        event.stopPropagation();
        event.preventDefault();

        const uuid = state.current.activeUuid;
        if (!uuid || !state.current.resizePosition) {
          state.current = {
            ...INITIAL_STATE,
            position: { ...INITIAL_STATE.position },
          };
          return;
        }
        const pos = state.current.position;
        if (state.current.resizePosition === ResizePosition.rotate) {
          controller.updateDrawing(uuid, {
            imageAngle: pos.imageAngle,
          });
        } else if (state.current.resizePosition === ResizePosition.active) {
          const rect = controller.getCanvasSize();
          const { left, top } = pos;
          if (left >= 0 && top >= 0 && left < rect.width && top < rect.height) {
            const newRange = getHitInfo(controller, left, top);
            if (newRange) {
              controller.updateDrawing(uuid, {
                fromCol: newRange.col,
                fromRow: newRange.row,
                marginX: newRange.marginX,
                marginY: newRange.marginY,
              });
            }
          }
        } else {
          if (pos.height > 0 && pos.width > 0) {
            controller.updateDrawing(uuid, {
              height: pos.height,
              width: pos.width,
            });
          }
        }
        state.current = {
          ...INITIAL_STATE,
          position: { ...INITIAL_STATE.position },
        };
      };
      const handlePointerMove = (event: PointerEvent) => {
        if (!state.current.resizePosition || event.buttons <= 0) {
          return;
        }
        event.stopPropagation();
        event.preventDefault();
        if (state.current.resizePosition === ResizePosition.rotate) {
          const deltaX = event.clientX - state.current.moveStartX;
          const deltaY = event.clientY - state.current.moveStartY;
          const imageAngle = (Math.atan2(deltaY, deltaX) * 180) / Math.PI;
          setPosition((old) => {
            const newData = {
              ...old,
              imageAngle,
            };
            return newData;
          });
          return;
        } else if (state.current.resizePosition === ResizePosition.active) {
          const deltaX = Math.round(event.clientX - state.current.moveStartX);
          const deltaY = Math.round(event.clientY - state.current.moveStartY);
          setPosition((old) => {
            const newTop = old.top + deltaY;
            const newLeft = old.left + deltaX;
            const newData = {
              ...roundPosition(newTop, newLeft, controller),
              imageAngle: old.imageAngle,
              width: old.width,
              height: old.height,
            };
            return newData;
          });
          state.current.moveStartX = event.clientX;
          state.current.moveStartY = event.clientY;
        } else {
          updateSize(event);
          state.current.moveStartX = event.clientX;
          state.current.moveStartY = event.clientY;
          return;
        }
      };
      function toggleEvents(state?: boolean) {
        const toggleEvent = state
          ? document.addEventListener
          : document.removeEventListener;
        toggleEvent('pointerup', handlePointerUp);
        toggleEvent('pointermove', handlePointerMove);
      }
      return [toggleEvents];
    }, []);

    useEffect(() => toggleEvents, [toggleEvents]);

    const handleResizePointerDown = useCallback(
      (event: React.PointerEvent<HTMLDivElement>) => {
        event.stopPropagation();
        event.preventDefault();
        if (event.buttons <= 0) {
          return;
        }

        const p = event.currentTarget.dataset.position || '';
        if (!p) {
          return;
        }
        state.current.resizePosition = p;
        state.current.moveStartX = event.clientX;
        state.current.moveStartY = event.clientY;
      },
      [],
    );
    const resetResize = useCallback((size: IWindowSize) => {
      setPosition((old) => ({ ...old, ...size }));
    }, []);
    const handleMaskPointerDown = useCallback(() => {
      state.current = {
        ...INITIAL_STATE,
        position: { ...INITIAL_STATE.position },
      };
      setActiveUuid('');
      controller.setFloatElementUuid('');
      toggleEvents(false);
    }, [toggleEvents]);
    return (
      <Fragment>
        <div
          className={classnames(styles['float-element-mask'], {
            [styles['active']]: !!activeUuid,
          })}
          data-testid="float-element-mask"
          onPointerDown={handleMaskPointerDown}
        />
        {floatElementList.map((v) => {
          const isActive = v.uuid === activeUuid;
          const props = {
            ...v,
            ...(isActive ? position : {}),
          };
          return (
            <FloatElement
              key={v.uuid}
              {...props}
              active={isActive}
              resetResize={resetResize}
              pointerDown={(event) => {
                event.stopPropagation();
                event.preventDefault();
                if (event.buttons <= 0) {
                  return;
                }
                state.current.resizePosition = ResizePosition.active;
                state.current.moveStartX = event.clientX;
                state.current.moveStartY = event.clientY;
                state.current.activeUuid = v.uuid;
                controller.setFloatElementUuid(v.uuid);
                setActiveUuid(v.uuid);
                setPosition({
                  top: v.top,
                  left: v.left,
                  width: v.width,
                  height: v.height,
                  imageAngle: v.imageAngle || 0,
                });
                toggleEvents(true);
              }}
              resizeDown={handleResizePointerDown}
            />
          );
        })}
      </Fragment>
    );
  },
);
FloatElementContainer.displayName = 'FloatElementContainer';

export default FloatElementContainer;
