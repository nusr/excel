import { h, FunctionComponent, CSSProperties } from '@/react';
import { classnames } from '@/util';

export interface ButtonProps {
  type?: 'normal' | 'circle';
  style?: CSSProperties;
  active?: boolean;
  disabled?: boolean;
  onClick?: (event: MouseEvent) => void;
  className?: string;
  testId?: string;
}

const defaultClick: (event: MouseEvent) => void = () => {
  console.log('add click event');
};

export const Button: FunctionComponent<ButtonProps> = (props, ...children) => {
  const {
    className = '',
    onClick = defaultClick,
    disabled = false,
    active = false,
    type = 'normal',
    style = {},
    testId = undefined,
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
      'data-testId': testId,
    },
    ...children,
  );
};
Button.displayName = 'Button';
