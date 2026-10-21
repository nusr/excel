'use client';
import {Modal, ModalOverlay, type ModalOverlayProps, Heading} from 'react-aria-components/Modal';
import {composeRenderProps} from 'react-aria-components/composeRenderProps';
import clsx from 'clsx';
import {Dialog} from './Dialog';
import './Sheet.css';

export function Sheet(props: ModalOverlayProps) {
  return (
    <ModalOverlay
      {...props}
      className={composeRenderProps(props.className, className => clsx('sheet-overlay', className))}>
      {composeRenderProps(props.children, children => (
        <Modal className="sheet">
          <Dialog>{children}</Dialog>
        </Modal>
      ))}
    </ModalOverlay>
  );
}

export {Heading};
