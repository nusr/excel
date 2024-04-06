import React, { useRef, useMemo, useEffect } from 'react';

import { useEventCallback } from '../../hooks';
import { clamp } from './clamp';
import styles from './panel.module.css';

export interface Interaction {
  left: number;
  top: number;
}

const defaultHeight = 200;
const defaultWidth = 234;

const getRelativePosition = (
  node: HTMLDivElement,
  clientX: number = 0,
  clientY: number = 0,
): Interaction => {
  const rect = node.getBoundingClientRect();
  return {
    left: clamp((clientX - rect.left) / (rect.width || defaultWidth)),
    top: clamp((clientY - rect.top) / (rect.height || defaultHeight)),
  };
};

interface Props {
  onMove: (interaction: Interaction) => void;
  children: React.ReactNode;
  testId?: string;
}

const InteractiveBase = ({ onMove, testId, ...rest }: Props) => {
  const container = useRef<HTMLDivElement>(null);
  const onMoveCallback = useEventCallback<Interaction>(onMove);

  const [handleMoveStart, toggleDocumentEvents] = useMemo(() => {
    const handleMoveStart = (event: React.MouseEvent) => {
      if (!container.current) return;
      event.preventDefault();
      container.current.focus();
      onMoveCallback(
        getRelativePosition(
          container.current,
          event.clientX || event.pageX,
          event.clientY || event.pageY,
        ),
      );
      toggleDocumentEvents(true);
    };

    const handleMove = (event: MouseEvent) => {
      if (event.buttons > 0 && container.current) {
        event.preventDefault();
        onMoveCallback(
          getRelativePosition(
            container.current,
            event.clientX || event.pageX,
            event.clientY || event.pageY,
          ),
        );
      }
    };

    const handleMoveEnd = () => toggleDocumentEvents(false);

    function toggleDocumentEvents(state?: boolean) {
      // Add or remove additional pointer event listeners
      const toggleEvent = state
        ? document.body.addEventListener
        : document.body.removeEventListener;
      toggleEvent('pointermove', handleMove);
      toggleEvent('pointerup', handleMoveEnd);
    }

    return [handleMoveStart, toggleDocumentEvents];
  }, [onMoveCallback]);

  // Remove window event listeners before unmounting
  useEffect(() => toggleDocumentEvents, [toggleDocumentEvents]);

  return (
    <div
      {...rest}
      onPointerDown={handleMoveStart}
      className={styles['color-picker-panel__interactive']}
      ref={container}
      tabIndex={0}
      role="slider"
      data-testid={testId}
    />
  );
};

export const Interactive = React.memo(InteractiveBase);
