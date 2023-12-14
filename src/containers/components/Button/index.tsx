import React, { FunctionComponent, CSSProperties } from 'react';
import { classnames } from '@/util';
import styles from './index.module.css';

export interface ButtonProps {
  type?: 'normal' | 'circle' | 'plain';
  style?: CSSProperties;
  active?: boolean;
  disabled?: boolean;
  onClick?: React.MouseEventHandler<HTMLButtonElement>;
  className?: string;
  title?: string;
  testId?: string;
  dataType?: string;
  buttonType?: React.ButtonHTMLAttributes<string>['type'];
}

export const Button: FunctionComponent<React.PropsWithChildren<ButtonProps>> = (props) => {
  const {
    className = '',
    onClick = () => {},
    disabled = false,
    active = false,
    type = 'normal',
    style = {},
    testId = undefined,
    title,
    dataType,
    buttonType,
    children,
  } = props;
  const cls = classnames(styles.buttonWrapper, className, {
    [styles['disabled']]: disabled,
    [styles['active']]: active,
    [styles['circle']]: type === 'circle',
    [styles['plain']]: type === 'plain',
  });
  return (
    <button
      onClick={onClick}
      style={style}
      title={title}
      className={cls}
      data-testid={testId}
      data-type={dataType}
      type={buttonType}
    >
      {children}
    </button>
  );
};
Button.displayName = 'Button';
