import React, { FunctionComponent, memo } from 'react';
import i18n from '../../i18n';
import { Modal } from '../../component/Modal';
import { Dialog as AriaDialog, Heading } from '../../component/Dialog';
import { Button } from '../../component/Button';

interface DialogProps {
  title: string;
  isOpen?: boolean;
  children: React.ReactNode;
  onOk?: () => boolean | undefined;
  onOpenChange?: (isOpen: boolean) => void;
  onCancel?: () => void;
  isDismissable?: boolean;
}

export const Dialog: FunctionComponent<DialogProps> = memo((props) => {
  const {
    children,
    title,
    onOk,
    onCancel,
    isDismissable = true,
    isOpen,
    onOpenChange,
  } = props;
  return (
    <Modal isDismissable={isDismissable} isOpen={isOpen}>
      <AriaDialog>
        <Heading slot="title">{title}</Heading>
        {children}
        <div style={{ display: 'flex', gap: 8, alignSelf: 'end' }}>
          <Button
            slot="close"
            variant="secondary"
            onPress={onCancel}
            data-testid="dialog-cancel-button"
            aria-label="Cancel"
          >
            {i18n.t('cancel')}
          </Button>
          <Button
            onPress={() => {
              if (onOk && !onOk()) {
                return;
              }
              onOpenChange?.(false);
            }}
            data-testid="dialog-confirm-button"
            aria-label="Confirm"
          >
            {i18n.t('confirm')}
          </Button>
        </div>
      </AriaDialog>
    </Modal>
  );
});
