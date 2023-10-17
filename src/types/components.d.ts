import { ModelCellValue } from './model';
export type OptionItem = {
    value: string | number;
    label: string;
    disabled?: boolean;
};
export type CanvasOverlayPosition = {
    top: number;
    left: number;
    width: number;
    height: number;
};
export type ScrollValue = {
    left: number;
    top: number;
    row: number;
    col: number;
    scrollLeft: number;
    scrollTop: number;
};
export type ActiveCellType = ModelCellValue & CanvasOverlayPosition;
export type Point = [x: number, y: number];
export declare enum ScrollStatus {
    NONE = 0,
    VERTICAL = 1,
    HORIZONTAL = 2
}
