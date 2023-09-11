import { h, FunctionComponent, CSSProperties, VNodePropsData } from '@/react';
import { classnames } from '@/util';
import styles from './index.module.css';

export interface ButtonProps {
  type?: 'normal' | 'circle';
  style?: CSSProperties;
  active?: boolean;
  disabled?: boolean;
  onClick?: (event: MouseEvent) => void;
  className?: string;
  title?: string;
  testId?: string;
  dataType?: string;
  buttonType?: string;
}

export const Button: FunctionComponent<ButtonProps> = (props, ...children) => {
  const {
    className = '',
    onClick,
    disabled = false,
    active = false,
    type = 'normal',
    style = {},
    testId = undefined,
    title,
    dataType,
    buttonType,
  } = props;
  const realProps: VNodePropsData = {
    className: classnames(styles.buttonWrapper, className, {
      [styles['disabled']]: disabled,
      [styles['active']]: active,
      [styles['circle']]: type === 'circle',
    }),
    style,
    title,
    'data-testId': testId,
    'data-type': dataType,
    type: buttonType,
  };
  if (onClick) {
    realProps.onclick = onClick;
  }
  return h('button', realProps, ...children);
};
Button.displayName = 'Button';
