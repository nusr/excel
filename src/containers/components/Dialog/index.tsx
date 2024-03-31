import React, { FunctionComponent, CSSProperties, memo } from 'react';
import { createPortal } from 'react-dom';
import { createRoot, Root } from 'react-dom/client';
import { Button } from '../Button';
import styles from './index.module.css';
import { classnames } from '@/util';
import { $ } from '@/i18n';

interface DialogProps {
  title: string;
  dialogStyle?: CSSProperties;
  visible: boolean;
  children?: React.ReactNode;
  testId?: string;
  getContainer?: () => HTMLElement;
  onOk?: React.MouseEventHandler<HTMLButtonElement>;
  onCancel?: React.MouseEventHandler<HTMLButtonElement>;
}

export const Dialog: FunctionComponent<DialogProps> = memo((props) => {
  const {
    children,
    title,
    dialogStyle,
    onCancel,
    onOk,
    visible,
    getContainer = () => document.body,
    testId,
  } = props;
  if (!visible) {
    return null;
  }
  return createPortal(
    <div className={classnames(styles['dialog-modal'])} data-testid={testId}>
      <div className={styles['dialog-container']} style={dialogStyle}>
        <div className={styles['dialog-title']}>{title}</div>
        <div className={styles['dialog-content']}>{children}</div>
        <div className={styles['dialog-button']}>
          <Button onClick={onCancel} data-testid="dialog-cancel-button">
            {$('cancel')}
          </Button>
          <Button
            onClick={onOk}
            className={styles['dialog-cancel']}
            type="primary"
            data-testid="dialog-confirm-button"
          >
            {$('confirm')}
          </Button>
        </div>
      </div>
    </div>,
    getContainer(),
  );
});
Dialog.displayName = 'Dialog';

export function info(props: DialogProps) {
  const container = document.createDocumentFragment();
  let root: Root | null = null;
  function close() {
    root?.unmount();
    root = null;
  }

  function render(modalProps: DialogProps) {
    root = root || createRoot(container);
    root.render(
      <Dialog
        visible={modalProps.visible}
        title={modalProps.title}
        dialogStyle={modalProps.dialogStyle}
        onCancel={(event) => {
          event.stopPropagation();
          if (modalProps.onCancel) {
            modalProps.onCancel(event);
          }
          close();
        }}
        onOk={(event) => {
          event.stopPropagation();
          if (modalProps.onOk) {
            modalProps.onOk(event);
          }
          close();
        }}
        testId={modalProps.testId}
      >
        {modalProps.children}
      </Dialog>,
    );
  }
  function update(modalProps: DialogProps) {
    render(modalProps);
  }

  render(props);

  return {
    close,
    update,
  };
}
