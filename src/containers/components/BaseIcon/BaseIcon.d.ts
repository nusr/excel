import { FunctionComponent } from 'react';
type PathItem = {
    d: string;
    'fill-opacity'?: string;
};
export interface BaseIconProps {
    className?: string;
    paths: PathItem[];
}
export declare const BaseIcon: FunctionComponent<BaseIconProps>;
export {};
