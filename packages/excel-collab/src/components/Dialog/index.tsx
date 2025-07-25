import React, { FunctionComponent, memo } from 'react';
import { createPortal } from 'react-dom';
import { createRoot, Root } from 'react-dom/client';
import { Button } from '../Button';
import styles from './index.module.css';
import { classnames } from '../../util';
import i18n from '../../i18n';

interface DialogProps {
  title: string;
  visible: boolean;
  className?: string;
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
    className,
    onCancel,
    onOk,
    visible,
    getContainer = () => document.body,
    testId,
  } = props;
  if (!visible) {
    return undefined;
  }
  const cancelTestId = testId ? `${testId}-cancel` : undefined;
  const confirmTestId = testId ? `${testId}-confirm` : undefined;
  return createPortal(
    <div className={styles['dialog-modal']} data-testid={testId}>
      <div className={classnames(styles['dialog-container'], className)}>
        <div className={styles['dialog-title']}>{title}</div>
        <div className={styles['dialog-content']}>{children}</div>
        <div className={styles['dialog-button']}>
          <Button onClick={onCancel} testId={cancelTestId}>
            {i18n.t('cancel')}
          </Button>
          <Button
            onClick={onOk}
            className={styles['dialog-cancel']}
            type="primary"
            testId={confirmTestId}
          >
            {i18n.t('confirm')}
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
  let root: Root | undefined = undefined;
  function close() {
    root?.unmount();
    root = undefined;
  }

  function render(modalProps: DialogProps) {
    root = root || createRoot(container);
    root.render(
      <Dialog
        visible={modalProps.visible}
        title={modalProps.title}
        className={modalProps.className}
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
