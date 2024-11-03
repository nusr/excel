import styles from './index.module.css';
import type { ModalProps } from '@/types';
import React from 'react';
import { FilterModal } from './Filter';

const Modal = (props: ModalProps) => {
  let children = null;
  if (props.type === 'filter') {
    children = <FilterModal {...props} />;
  } else {
    throw new Error(`can't handle the modal type: ${props.type}`);
  }

  return (
    <div
      style={{ top: props.y, left: props.x }}
      className={styles['modalContainer']}
    >
      {children}
    </div>
  );
};

export default Modal;
