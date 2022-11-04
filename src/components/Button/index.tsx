import { Component, h, PropsType } from '@/react';
import { classnames } from '@/util';
import { noop } from '@/lodash';
import type { BaseIconName } from '@/types';
import { BaseIcon, BaseIconProps } from '../BaseIcon';

export interface ButtonProps extends PropsType {
  type?: 'normal' | 'circle';
  icon?: BaseIconName;
  active?: boolean;
  disabled?: boolean;
  onClick?: (event: React.MouseEvent<HTMLDivElement, MouseEvent>) => void;
};

export const Button: Component<ButtonProps> = (props) => {
  const {
    children = [],
    className = '',
    onClick = noop,
    disabled = false,
    active = false,
    type = 'normal',
    style,
    icon,
  } = props;
  if (icon) {
    children.push(h<BaseIconProps>(BaseIcon, { name: icon }));
  }
  return h(
    'div',
    {
      onClick,
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
