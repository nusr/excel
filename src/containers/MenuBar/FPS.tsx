import React from 'react';
import styles from './index.module.css';
import { useFPS } from '../hooks';

export const FPS: React.FunctionComponent = () => {
  const [fps] = useFPS();
  return <div data-testid="menubar-fps" className={styles.fps}>FPS: {fps}</div>;
};
