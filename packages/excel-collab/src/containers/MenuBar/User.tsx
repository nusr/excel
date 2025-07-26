import { ProviderStatus } from '../../types';
import { Icon } from '../../components';
import styles from './index.module.css';
import { useUserInfo } from '../store';
import i18n from '../../i18n';

export const User = () => {
  const clientId = useUserInfo((s) => s.clientId);

  const name = navigator.onLine ? ProviderStatus.ONLINE : ProviderStatus.LOCAL;
  return (
    <div className={styles.user}>
      <div className={styles.userName}>{`${i18n.t('user-name')} ${clientId}`}</div>
      <Icon name={name} className={styles.status} />
    </div>
  );
};

User.displayName = 'User';
