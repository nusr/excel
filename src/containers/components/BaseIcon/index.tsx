import { FunctionComponent, memo } from 'react';
import iconConfig from './icon';
import type { BaseIconName } from './icon';
import { BaseIcon, BaseIconProps } from './BaseIcon';

export interface IconProps {
  name: BaseIconName;
  className?: string;
  fill?: string;
  testId?: string;
}

export const Icon: FunctionComponent<IconProps> = memo(
  ({ name, className = '', fill, testId }) => {
    const paths = iconConfig[name].map((item) => ({ d: item }));
    return BaseIcon({ className, paths, fill, testId });
  },
);
Icon.displayName = 'Icon';

export { BaseIcon, BaseIconProps };

export { FillColorIcon } from './FillColorIcon';
