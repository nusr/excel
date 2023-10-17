import React from 'react';
import { IController, OptionItem } from '@/types';
type Props = {
    controller: IController;
    position: number;
    sheetList: OptionItem[];
    hideMenu: () => void;
    editSheetName: () => void;
};
export declare const SheetBarContextMenu: React.FunctionComponent<Props>;
export {};
