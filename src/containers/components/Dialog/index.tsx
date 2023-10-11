import React, { FunctionComponent, CSSProperties } from 'react';
import { createPortal } from 'react-dom';
import { Button } from '../Button';
import styles from './index.module.css';
import { classnames } from '@/util';

export interface DialogProps {
  content: React.ReactElement;
  testId?: string;
  title: string;
  dialogStyle?: CSSProperties;
  visible: boolean;
  onOk?: () => void;
  onCancel?: () => void;
}

export const Dialog: FunctionComponent<DialogProps> = (props) => {
  const { content, title, dialogStyle, onCancel, onOk, visible } = props;
  if (!visible) {
    return null;
  }
  const dialog = (
    <div className={classnames(styles['dialog-modal'])}>
      <div className={styles['dialog-container']} style={dialogStyle}>
        <div className={styles['dialog-title']}>{title}</div>
        <div className={styles['dialog-content']}>{content}</div>
        <div className={styles['dialog-button']}>
          <Button onClick={onCancel}>Cancel</Button>
          <Button onClick={onOk} className={styles['dialog-cancel']}>
            Confirm
          </Button>
        </div>
      </div>
    </div>
  );
  return createPortal(dialog, document.body);
};
Dialog.displayName = 'Dialog';
