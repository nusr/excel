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
  const userName = useUserInfo((s) => s.userName);
  const userId = useUserInfo((s) => s.userId);
  return (
    <div className={styles.user}>
      <div className={styles.userName}>
        {userName || `${$('user-name')} ${clientId}`}
      </div>
      {userId && (
        <img
          className={styles.avatar}
          src={`https://avatars.githubusercontent.com/u/${userId}`}
          alt={userName}
        />
      )}

      <Icon name={providerStatus} className={styles.status} />
    </div>
  );
};

User.displayName = 'User';
