import { h, Component } from '@/react';
import { classnames } from '@/util';

type PathItem = {
  d: string;
  'fill-opacity'?: string;
};

export interface BaseIconProps {
  className?: string;
  paths: PathItem[];
}

export const BaseIcon: Component<BaseIconProps> = ({
  className = '',
  paths = [],
}) => {
  return h(
    'svg',
    {
      className: classnames('base-icon', className),
      viewBox: '0 0 1137 1024',
      'aria-hidden': true,
    },
    ...paths.map((item) => h('path', item)),
  );
};
BaseIcon.displayName = 'BaseIcon';
