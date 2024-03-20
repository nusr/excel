import React, { FunctionComponent } from 'react';
import styles from './index.module.css';

export const Loading: FunctionComponent = () => {
  return (
    <div className={styles['container']}>
      <div className={styles['loading']}></div>
    </div>
  );
};
Loading.displayName = 'Loading';
