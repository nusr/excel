import { FunctionComponent } from 'react';
import iconConfig from './icon';
import type { BaseIconName } from './icon';
import { BaseIcon, BaseIconProps } from './BaseIcon';

export interface IconProps {
  name: BaseIconName;
  className?: string;
}

export const Icon: FunctionComponent<IconProps> = ({
  name,
  className = '',
}) => {
  const paths = iconConfig[name].map((item) => ({ d: item }));
  return BaseIcon({ className, paths });
};
Icon.displayName = 'Icon';

export { BaseIcon, BaseIconProps };

export { FillColorIcon } from './FillColorIcon';
