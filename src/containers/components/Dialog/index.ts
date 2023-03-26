import { h, FunctionComponent, Children, CSSProperties } from '@/react';
import { assert } from '@/util';
import { Button } from '../Button';

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
    { className: 'dialog-container' },
    h(
      'dialog',
      {
        className: 'dialog-element',
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
            className: 'dialog-title',
          },
          title,
        ),
        h(
          'div',
          {
            className: 'dialog-content',
          },
          dialogContent,
        ),
        h(
          'div',
          {
            className: 'dialog-button',
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
              className: 'ml16',
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
