import React, {
  useRef,
  useEffect,
  Fragment,
  useState,
  memo,
  useSyncExternalStore,
} from 'react';
import type { IController, EventData, ModalValue } from '../../types';
import { getHitInfo, DEFAULT_POSITION, canvasSizeSet } from '../../util';
import styles from './index.module.css';
import { coreStore, floatElementStore, useExcel } from '../../containers/store';
import { ScrollBar } from './ScrollBar';
import { ContextMenu } from './ContextMenu';
import { initCanvas } from './util';
import { BottomBar } from './BottomBar';
import FloatElementContainer from '../FloatElement';
import handlerList from './event';
import Modal from './modal';

function getEventData(
  event: React.PointerEvent<HTMLCanvasElement>,
  controller: IController,
): EventData {
  const rect = canvasSizeSet.get();
  const { clientX = 0, clientY = 0 } = event;
  const x = clientX - rect.left;
  const y = clientY - rect.top;

  const position = getHitInfo(controller, x, y);
  const result: EventData = {
    position,
    x,
    y,
    controller,
  };

  return result;
}

export const CanvasContainer = memo(() => {
  const { controller } = useExcel();
  const [modalState, setModalState] = useState<ModalValue | null>(null);
  const floatElementList = useSyncExternalStore(
    floatElementStore.subscribe,
    floatElementStore.getSnapshot,
  );
  const { activeUuid } = useSyncExternalStore(
    coreStore.subscribe,
    coreStore.getSnapshot,
  );
  const [menuPosition, setMenuPosition] = useState({
    top: DEFAULT_POSITION,
    left: DEFAULT_POSITION,
  });

  const ref = useRef<HTMLCanvasElement>(null);
  useEffect(() => {
    if (!ref.current) {
      return;
    }
    return initCanvas(controller, ref.current);
  }, []);
  const handleContextMenu = (event: React.MouseEvent<HTMLCanvasElement>) => {
    event.preventDefault();
    setMenuPosition({
      top: event.clientY,
      left: event.clientX,
    });
  };
  const hideContextMenu = () => {
    setMenuPosition({
      top: DEFAULT_POSITION,
      left: DEFAULT_POSITION,
    });
  };
  const handlePointerMove = (event: React.PointerEvent<HTMLCanvasElement>) => {
    /* jscpd:ignore-start */
    if (event.buttons <= 0) {
      return;
    }
    const data = getEventData(event, controller);
    for (const handler of handlerList) {
      const r = handler.pointerMove(data, event);
      if (r) {
        if (typeof r !== 'boolean') {
          setModalState(r);
        }
        break;
      }
    }
    /* jscpd:ignore-end */
  };
  const handlePointerDown = async (
    event: React.PointerEvent<HTMLCanvasElement>,
  ) => {
    if (event.buttons <= 0) {
      return;
    }
    setModalState(null);
    const data = getEventData(event, controller);
    for (const handler of handlerList) {
      const r = handler.pointerDown(data, event);
      if (r) {
        if (typeof r !== 'boolean') {
          setModalState(r);
        }
        break;
      }
    }
  };
  return (
    <Fragment>
      <div
        className={styles['canvas-container']}
        data-testid="canvas-container"
      >
        <canvas
          className={styles['canvas-content']}
          onContextMenu={handleContextMenu}
          onPointerMove={handlePointerMove}
          onPointerDown={handlePointerDown}
          ref={ref}
          data-testid="canvas-main"
        />
        <ScrollBar />
        <BottomBar />
        {floatElementList.length > 0 && (
          <FloatElementContainer
            floatElementList={floatElementList}
            activeUuid={activeUuid}
          />
        )}
      </div>
      {menuPosition.top >= 0 && menuPosition.left >= 0 && (
        <ContextMenu {...menuPosition} hideContextMenu={hideContextMenu} />
      )}
      {modalState && <Modal {...modalState} hide={() => setModalState(null)} />}
    </Fragment>
  );
});
CanvasContainer.displayName = 'CanvasContainer';

export default CanvasContainer;
