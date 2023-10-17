import React, { FunctionComponent, CSSProperties } from 'react';
export type ColorPickerProps = {
    color: string;
    style?: CSSProperties;
    onChange: (value: string) => void;
};
export declare const ColorPicker: FunctionComponent<React.PropsWithChildren<ColorPickerProps>>;
