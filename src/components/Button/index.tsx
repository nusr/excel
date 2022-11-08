import {  h } from '@/react';
import { classnames } from '@/util';
import type { Component } from '@/types'

export interface ButtonProps {
  type?: 'normal' | 'circle';
  style?: string;
  active?: boolean;
  disabled?: boolean;
  onClick?: (event: MouseEvent) => void;
  className?: string;
}

const defaultClick: (event: MouseEvent) => void = () => {
  console.log('add click event');
};

export const Button: Component<ButtonProps> = (props, ...children) => {
  const {
    className = '',
    onClick = defaultClick,
    disabled = false,
    active = false,
    type = 'normal',
    style,
  } = props;
  return h(
    'div',
    {
      onclick: onClick,
      className: classnames('button-wrapper', className, {
        disabled,
        active,
        circle: type === 'circle',
      }),
      style,
    },
    ...children,
  );
};
Button.displayName = 'Button';
