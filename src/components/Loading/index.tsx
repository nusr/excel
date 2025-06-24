import { FunctionComponent, memo } from 'react';
import styles from './index.module.css';

export const Loading: FunctionComponent = memo(() => {
  return (
    <div className={styles['container']}>
      <div className={styles['loading']} data-test="loading" />
    </div>
  );
});
Loading.displayName = 'Loading';
