import { CSSProperties, FunctionComponent } from 'react';
import { OptionItem } from '@/types';
export type SelectProps = {
    value?: string | number;
    style?: CSSProperties;
    data: Array<string | number | OptionItem>;
    getItemStyle?: (value: string | number) => CSSProperties;
    onChange: (value: string | number) => void;
    title?: string;
};
export declare const Select: FunctionComponent<SelectProps>;
