import { FunctionComponent, memo } from 'react';
import iconConfig from './icon';
import type { BaseIconName } from './icon';
import { BaseIcon } from './BaseIcon';

interface IconProps {
  name: BaseIconName;
  className?: string;
  testId?: string;
}

export const Icon: FunctionComponent<IconProps> = memo(
  ({ name, className = '', testId }) => {
    const paths = iconConfig[name].map((item) => ({ d: item }));
    return BaseIcon({ className, paths, testId });
  },
);
Icon.displayName = 'Icon';

export { FillColorIcon } from './FillColorIcon';
