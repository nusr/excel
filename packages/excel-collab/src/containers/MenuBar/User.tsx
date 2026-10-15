import styles from './index.module.css';
import { useUserInfo } from '../store';
import i18n from '../../i18n';
import { Wifi, WifiOff } from 'lucide-react';

export const User = () => {
  const clientId = useUserInfo((s) => s.clientId);

  return (
    <div className={styles.user}>
      <div>{`${i18n.t('user-name')} ${clientId}`}</div>
      {navigator.onLine ? <Wifi /> : <WifiOff />}
    </div>
  );
};

User.displayName = 'User';
