import { FunctionComponent } from 'react';
import type { BaseIconName } from './icon';
import { BaseIcon, BaseIconProps } from './BaseIcon';
export interface IconProps {
    name: BaseIconName;
    className?: string;
}
export declare const Icon: FunctionComponent<IconProps>;
export { BaseIcon, BaseIconProps };
export { FillColorIcon } from './FillColorIcon';
