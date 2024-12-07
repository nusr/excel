import React, { memo } from 'react';
import styles from './index.module.css';
import { useFPS } from '../hooks';

export const FPS: React.FunctionComponent = memo(() => {
  const fps = useFPS();
  return (
    <div data-testid="menubar-fps" className={styles.fps}>
      <span>FPS:</span>
      <span data-testid="menubar-fps-num">{fps < 10 ? '0' + fps : fps}</span>
    </div>
  );
});

FPS.displayName = 'FPS';
