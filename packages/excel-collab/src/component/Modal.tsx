'use client';
import {
  Modal as RACModal,
  ModalOverlay,
  type ModalOverlayProps,
} from 'react-aria-components/Modal';
import './Modal.css';

export function Modal(props: ModalOverlayProps) {
  const { children, ...overlayProps } = props;
  return (
    <ModalOverlay {...overlayProps}>
      <RACModal>{children}</RACModal>
    </ModalOverlay>
  );
}
