import React, { FunctionComponent, CSSProperties, useRef } from 'react';
import { assert } from '@/util';
import { Button } from '../Button';
import styles from './index.module.css';

export interface DialogProps {
  dialogContent: React.ReactElement;
  testId?: string;
  title: string;
  dialogStyle?: CSSProperties;
  onOk?: () => void;
  onCancel?: () => void;
}

export const Dialog: FunctionComponent<React.PropsWithChildren<DialogProps>> = (
  props,
) => {
  const { dialogContent, title, dialogStyle, onCancel, onOk, children } = props;
  const ref = useRef<HTMLDialogElement>(null);
  return (
    <div className={styles['dialog-container']}>
      <dialog
        className={styles['dialog-element']}
        style={dialogStyle}
        ref={ref}
      >
        <form method="dialog">
          <div className={styles['dialog-title']}>{title}</div>
          <div className={styles['dialog-content']}>{dialogContent}</div>
          <div className={styles['dialog-button']}>
            <Button onClick={onCancel} buttonType="submit">
              Cancel
            </Button>
            <Button
              onClick={onOk}
              buttonType="submit"
              className={styles['dialog-cancel']}
            >
              Confirm
            </Button>
          </div>
        </form>
      </dialog>
      <div
        onClick={() => {
          assert(
            typeof ref.current!.showModal === 'function',
            'Sorry, the <dialog> API is not supported by this browser.',
          );
          ref.current!.showModal();
        }}
      >
        {children}
      </div>
    </div>
  );
};
Dialog.displayName = 'Dialog';
