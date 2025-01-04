import { FunctionComponent } from 'react';
import { ProviderStatus } from '../../types';
import { Icon } from '../../components';
import styles from './index.module.css';
import { useUserInfo } from '../store';
import { $ } from '../../i18n';

export const User: FunctionComponent<{
  providerStatus: ProviderStatus;
}> = ({ providerStatus }) => {
  const clientId = useUserInfo((s) => s.clientId);
  return (
    <div className={styles.user}>
      <div className={styles.userName}>{`${$('user-name')} ${clientId}`}</div>

      <Icon name={providerStatus} className={styles.status} />
    </div>
  );
};

User.displayName = 'User';
