import { FunctionComponent, useCallback } from 'react';
import { ProviderStatus } from '../../types';
import { Icon, Button } from '../../components';
import styles from './index.module.css';
import { useExcel, useUserInfo } from '../store';
import { $ } from '../../i18n';

export const User: FunctionComponent<{
  providerStatus: ProviderStatus;
  enableLogin: boolean;
}> = ({ providerStatus, enableLogin }) => {
  const { provider } = useExcel();
  const clientId = useUserInfo((s) => s.clientId);
  const userName = useUserInfo((s) => s.userName);
  const userId = useUserInfo((s) => s.userId);
  const handleLogin = useCallback(() => {
    provider?.login();
  }, []);
  const handleLogOut = useCallback(() => {
    provider?.logOut();
  }, []);
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
      {enableLogin &&
        (userName ? (
          <Button onClick={handleLogOut}>{$('log-out')}</Button>
        ) : (
          <Button onClick={handleLogin} className={styles.login}>
            {$('login')} &nbsp;
            <Icon name="github" />
          </Button>
        ))}

      <Icon name={providerStatus} className={styles.status} />
    </div>
  );
};

User.displayName = 'User';
