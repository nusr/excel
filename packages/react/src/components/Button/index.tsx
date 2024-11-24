import React, { FunctionComponent, CSSProperties, memo } from 'react';
import { classnames, noop } from '@excel/shared';
import styles from './index.module.css';

export interface ButtonProps {
  type?: 'normal' | 'circle' | 'plain' | 'primary';
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

export const Button: FunctionComponent<React.PropsWithChildren<ButtonProps>> =
  memo((props) => {
    const {
      className = '',
      onClick = noop,
      disabled = false,
      active = false,
      type = 'normal',
      style,
      testId,
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
      [styles['primary']]: type === 'primary',
    });
    return (
      <button
        onClick={onClick}
        style={style}
        title={title}
        disabled={disabled}
        className={cls}
        data-testid={testId}
        data-type={dataType}
        type={buttonType}
      >
        {children}
      </button>
    );
  });
Button.displayName = 'Button';
