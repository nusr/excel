import { FunctionComponent } from 'react';
import { ProviderStatus } from '../../types';
import styles from './index.module.css';

export const User: FunctionComponent<{ providerStatus: ProviderStatus }> = ({
  providerStatus,
}) => {
  return (
    <div className={styles.user}>
      <div>{providerStatus}</div>
    </div>
  );
};

User.displayName = 'User';
