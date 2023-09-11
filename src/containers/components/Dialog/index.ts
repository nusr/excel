import { h, FunctionComponent, Children, CSSProperties } from '@/react';
import { assert } from '@/util';
import { Button } from '../Button';
import styles from './index.module.css';

export interface DialogProps {
  dialogContent: Children;
  testId?: string;
  title: string;
  dialogStyle?: CSSProperties;
  onOk?: () => void;
  onCancel?: () => void;
}

export const Dialog: FunctionComponent<DialogProps> = (props, ...children) => {
  const { dialogContent, title, dialogStyle, onCancel, onOk } = props;
  let ref: HTMLDialogElement;
  return h(
    'div',
    { className: styles['dialog-container'] },
    h(
      'dialog',
      {
        className: styles['dialog-element'],
        style: dialogStyle,
        hook: {
          ref(dom) {
            ref = dom as HTMLDialogElement;
          },
        },
      },
      h(
        'form',
        {
          method: 'dialog',
        },
        h(
          'div',
          {
            className: styles['dialog-title'],
          },
          title,
        ),
        h(
          'div',
          {
            className: styles['dialog-content'],
          },
          dialogContent,
        ),
        h(
          'div',
          {
            className: styles['dialog-button'],
          },
          Button(
            {
              onClick() {
                onCancel && onCancel();
              },
              buttonType: 'submit',
            },
            'Cancel',
          ),
          Button(
            {
              onClick() {
                onOk && onOk();
              },
              buttonType: 'submit',
              className: styles['dialog-cancel'],
            },
            'Confirm',
          ),
        ),
      ),
    ),
    h(
      'div',
      {
        onclick() {
          assert(
            typeof ref.showModal === 'function',
            'Sorry, the <dialog> API is not supported by this browser.',
          );
          ref.showModal();
        },
      },
      ...children,
    ),
  );
};
Dialog.displayName = 'Dialog';
