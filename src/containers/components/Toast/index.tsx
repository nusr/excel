import React from 'react';
import { createRoot } from 'react-dom/client';
import styles from './index.module.css';
import { classnames } from '@/util';
import { Icon } from '../BaseIcon';

type MessageType = 'success' | 'error' | 'info' | 'warning';
type Props = {
  message: string;
  type: MessageType;
  duration?: number; // second
};

const Toast: React.FunctionComponent<Pick<Props, 'message' | 'type'>> = ({
  message,
  type,
}) => {
  return (
    <div className={classnames(styles['toast'], styles[type])}>
      <Icon
        name={type}
        className={classnames(styles[`${type}_icon`], styles['icon'])}
      />
      <div className={styles['content']}>{message}</div>
    </div>
  );
};

export function toast(props: Props) {
  const { duration = 3, ...rest } = props;
  const container = document.createElement('div');
  container.className = styles['container'];
  document.body.appendChild(container);
  const root = createRoot(container);
  root.render(<Toast {...rest} />);
  setTimeout(() => {
    root.unmount();
    document.body.removeChild(container);
  }, duration * 1000);
}