import { h, FunctionComponent, CSSProperties, VNodePropsData } from '@/react';
import { classnames } from '@/util';

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
    title = '',
    dataType,
  } = props;
  const realProps: VNodePropsData = {
    className: classnames('button-wrapper', className, {
      disabled,
      active,
      circle: type === 'circle',
    }),
    style,
    title,
    'data-testId': testId,
    'data-type': dataType,
  };
  if (onClick) {
    realProps.onclick = onClick;
  }
  return h('div', realProps, ...children);
};
Button.displayName = 'Button';
