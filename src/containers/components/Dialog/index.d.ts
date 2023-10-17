import React, { FunctionComponent, CSSProperties } from 'react';
export interface DialogProps {
    testId?: string;
    title: string;
    dialogStyle?: CSSProperties;
    visible: boolean;
    onOk?: () => void;
    onCancel?: () => void;
}
export declare const Dialog: FunctionComponent<React.PropsWithChildren<DialogProps>>;
