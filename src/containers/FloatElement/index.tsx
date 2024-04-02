import React, {
  useSyncExternalStore,
  Fragment,
  memo,
  useState,
  useEffect,
  useRef,
} from 'react';
import { IController, IWindowSize } from '@/types';
import { floatElementStore, coreStore } from '@/containers/store';
import { FloatElement } from './FloatElement';
import styles from './FloatElement.module.css';
import { getHitInfo, classnames } from '@/util';
import {
  State,
  ResizePosition,
  FloatElementPosition,
  INITIAL_STATE,
  roundPosition,
} from './util';

interface Props {
  controller: IController;
}
export const FloatElementContainer: React.FunctionComponent<Props> = memo(
  ({ controller }) => {
    const floatElementList = useSyncExternalStore(
      floatElementStore.subscribe,
      floatElementStore.getSnapshot,
    );
    const { activeUuid } = useSyncExternalStore(
      coreStore.subscribe,
      coreStore.getSnapshot,
    );
    const state = useRef<State>({ ...INITIAL_STATE });
    const [position, setPosition] = useState<FloatElementPosition>({
      width: -1,
      height: -1,
      imageAngle: 0,
      top: -1,
      left: -1,
    });

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
      state.current.moveStartX = event.clientX;
      state.current.moveStartY = event.clientY;
    };

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
    const updateRotate = (event: PointerEvent) => {
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
    };

    useEffect(() => {
      const handlePointerUp = (event: PointerEvent) => {
        event.stopPropagation();
        event.preventDefault();
        if (!activeUuid) {
          state.current = { ...INITIAL_STATE };
          return;
        }
        if (state.current.resizePosition) {
          if (state.current.resizePosition === ResizePosition.rotate) {
            controller.updateDrawing(activeUuid, {
              imageAngle: position.imageAngle,
            });
          } else if (position.height > 0 && position.width > 0) {
            controller.updateDrawing(activeUuid, {
              height: position.height,
              width: position.width,
            });
          }
        }
        const rect = controller.getDomRect();
        const { left, top } = position;
        if (left >= 0 && top >= 0 && left < rect.width && top < rect.height) {
          const newRange = getHitInfo(controller, left, top);
          if (newRange) {
            controller.updateDrawing(activeUuid, {
              fromCol: newRange.col,
              fromRow: newRange.row,
              marginX: newRange.marginX,
              marginY: newRange.marginY,
            });
          }
        }
        state.current = { ...INITIAL_STATE };
      };
      const handlePointerMove = (event: PointerEvent) => {
        if (!activeUuid) {
          return;
        }
        if (event.buttons !== 1) {
          return;
        }

        event.stopPropagation();
        event.preventDefault();
        if (state.current.resizePosition) {
          if (state.current.resizePosition === ResizePosition.rotate) {
            updateRotate(event);
          } else {
            updateSize(event);
            state.current.moveStartX = event.clientX;
            state.current.moveStartY = event.clientY;
          }

          return;
        }
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
      };
      document.addEventListener('pointerup', handlePointerUp);
      document.addEventListener('pointermove', handlePointerMove);
      return () => {
        document.removeEventListener('pointerup', handlePointerUp);
        document.removeEventListener('pointermove', handlePointerMove);
      };
    }, [activeUuid, position]);
    return (
      <Fragment>
        <div
          className={classnames(styles['float-element-mask'], {
            [styles['active']]: !!activeUuid,
          })}
          onPointerDown={() => {
            state.current = { ...INITIAL_STATE };
            coreStore.mergeState({ activeUuid: '' });
            controller.setFloatElementUuid('');
          }}
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
              controller={controller}
              resetResize={(size: IWindowSize) =>
                setPosition((old) => ({ ...old, ...size }))
              }
              pointerDown={(event) => {
                event.stopPropagation();
                event.preventDefault();
                if (event.buttons !== 1) {
                  return;
                }
                state.current.moveStartX = event.clientX;
                state.current.moveStartY = event.clientY;
                controller.setFloatElementUuid(v.uuid);
                coreStore.mergeState({ activeUuid: v.uuid });
                setPosition({
                  top: v.top,
                  left: v.left,
                  width: v.width,
                  height: v.height,
                  imageAngle: v.imageAngle || 0,
                });
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

export { InsertFloatingPicture, InsertChart } from './Toolbar';
