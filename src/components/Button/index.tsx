import { Component, h } from '@/react';
import { classnames, TEST_ID_KEY } from '@/util';
import { noop } from '@/lodash';
import type { BaseIconName } from '@/types';
import { BaseIcon, BaseIconProps } from '../BaseIcon';

export interface ButtonProps {
  type?: 'normal' | 'circle';
  icon?: BaseIconName;
  style?: string;
  active?: boolean;
  disabled?: boolean;
  onClick?: (event: MouseEvent) => void;
  className?: string;
  testId?: string;
}

export const Button: Component<ButtonProps> = (props, children = []) => {
  const {
    className = '',
    onClick = noop,
    disabled = false,
    active = false,
    type = 'normal',
    style,
    icon,
    testId,
  } = props;
  if (icon && children.length === 0) {
    children.push(h<BaseIconProps>(BaseIcon, { name: icon }));
  }
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
      [TEST_ID_KEY]: testId,
    },
    ...children,
  );
};
Button.displayName = 'Button';
