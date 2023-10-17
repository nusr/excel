import React, { CSSProperties } from 'react';
import { ActiveCellType, IController } from '@/types';
type Props = {
    controller: IController;
    initValue: string;
    style: CSSProperties | undefined;
};
export declare function getEditorStyle(data: ActiveCellType): CSSProperties | undefined;
export declare const FormulaEditor: React.FunctionComponent<Props>;
export {};
