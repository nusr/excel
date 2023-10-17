import React from 'react';
import { IController } from '@/types';
type Props = {
    controller: IController;
    top: number;
    left: number;
    hideContextMenu: () => void;
};
export declare const ContextMenu: React.FunctionComponent<Props>;
export {};
