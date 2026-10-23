import styles from './index.module.css';
import type { ModalProps } from '../../../types';
import { FilterModal } from './Filter';
import { useLayoutEffect, useRef } from 'react';

const Modal = (props: ModalProps) => {
  const ref = useRef<HTMLDivElement>(null);
  useLayoutEffect(() => {
    const element = ref.current;
    if (!element) return;
    const position = () => {
      const { width, height } = element.getBoundingClientRect();
      element.style.left = `${Math.max(12, Math.min(props.x, window.innerWidth - width - 12))}px`;
      element.style.top = `${Math.max(12, Math.min(props.y, window.innerHeight - height - 12))}px`;
    };
    position();
    const observer = new ResizeObserver(position);
    observer.observe(element);
    window.addEventListener('resize', position);
    return () => {
      observer.disconnect();
      window.removeEventListener('resize', position);
    };
  }, [props.x, props.y]);
  let children = null;
  if (props.type === 'filter') {
    children = <FilterModal {...props} />;
  } else {
    throw new Error(`can't handle the modal type: ${props.type}`);
  }

  return (
    <div ref={ref} style={{ top: props.y, left: props.x }} className={styles['modalContainer']}>
      {children}
    </div>
  );
};

export type { ModalProps };

export default Modal;
