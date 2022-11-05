import { Component, h } from '@/react';
import { classnames } from '@/util';
import type { BaseIconName } from '@/types';

export type BaseIconProps = {
  name: BaseIconName;
  className?: string;
};
export const BaseIcon: Component<BaseIconProps> = (props) => {
  const { className = '', name } = props;
  return h('BaseIcon', {
    dangerouslySetInnerHTML: `<svg class="${classnames(
      'icon-wrapper',
      className,
    )}" aria-hidden="true"><use xlink:href="#icon-${name}"></use></svg>`,
  });
};
BaseIcon.displayName = 'BaseIcon'