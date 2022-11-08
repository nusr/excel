import { h } from '@/react';
import { classnames } from '@/util';
import type { Component } from '@/types'
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
      xmlns: 'http://www.w3.org/2000/svg',
      class: classnames('base-icon', className),
      viewBox: '0 0 1137 1024',
      'aria-hidden': true,
    },
    ...paths.map((item) => h('path', item)),
  );
};
BaseIcon.displayName = 'BaseIcon';
