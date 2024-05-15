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
  testId: string;
};

export const Toast: React.FunctionComponent<Omit<Props, 'duration'>> = ({
  message,
  type,
  testId,
}) => {
  return (
    <div
      className={classnames(styles['toast'], styles[type])}
      data-testid={testId}
    >
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
  let container: HTMLDivElement | undefined = document.createElement('div');
  container.className = styles['container'];
  document.body.appendChild(container);
  const root = createRoot(container);
  root.render(<Toast {...rest} />);

  function close() {
    if (!container) {
      return;
    }
    root.unmount();
    document.body.removeChild(container!);
    container = undefined;
  }

  setTimeout(close, duration * 1000);
  return close;
}

toast.error = function (message: string, testId = 'error-toast') {
  return toast({ message, type: 'error', testId });
};

toast.info = function (message: string, testId = 'info-toast') {
  return toast({ message, type: 'info', testId });
};

toast.warning = function (message: string, testId = 'warning-toast') {
  return toast({ message, type: 'warning', testId });
};
toast.success = function (message: string, testId = 'success-toast') {
  return toast({ message, type: 'success', testId });
};
