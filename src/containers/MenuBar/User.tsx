import { FunctionComponent, useSyncExternalStore } from 'react';
import { ProviderStatus } from '../../types';
import { Icon } from '../../components';
import styles from './index.module.css';
import { fileStore } from '../store';
import { $ } from '../../i18n';

export const User: FunctionComponent<{
  providerStatus: ProviderStatus;
}> = ({ providerStatus }) => {
  const { clientId } = useSyncExternalStore(
    fileStore.subscribe,
    fileStore.getSnapshot,
  );
  return (
    <div className={styles.user}>
      <div>{`${$('user-name')} ${clientId}`}</div>
      <Icon name={providerStatus} className={styles.status} />
    </div>
  );
};

User.displayName = 'User';
