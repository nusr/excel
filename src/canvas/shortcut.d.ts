import { KeyboardEventItem, IController } from '@/types';
export declare function computeScrollRowAndCol(controller: IController, left: number, top: number): {
    row: number;
    col: number;
};
export declare function computeScrollPosition(controller: IController, left: number, top: number): {
    maxHeight: number;
    maxWidth: number;
    maxScrollHeight: number;
    maxScrollWidth: number;
    scrollTop: number;
    scrollLeft: number;
};
export declare function scrollBar(controller: IController, scrollX: number, scrollY: number): void;
export declare const keyboardEventList: KeyboardEventItem[];
