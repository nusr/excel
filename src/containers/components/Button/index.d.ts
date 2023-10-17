import React, { FunctionComponent, CSSProperties } from 'react';
export interface ButtonProps {
    type?: 'normal' | 'circle';
    style?: CSSProperties;
    active?: boolean;
    disabled?: boolean;
    onClick?: React.MouseEventHandler<HTMLButtonElement>;
    className?: string;
    title?: string;
    testId?: string;
    dataType?: string;
    buttonType?: React.ButtonHTMLAttributes<string>['type'];
}
export declare const Button: FunctionComponent<React.PropsWithChildren<ButtonProps>>;
