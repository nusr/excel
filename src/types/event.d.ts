export type ChangeEventType = 'content' | 'antLine' | 'sheetList' | 'currentSheetId' | 'setActiveCell' | 'setCellStyle' | 'setCellValues' | 'scroll';
export type IWindowSize = {
    width: number;
    height: number;
};
export type EventType = {
    changeSet: Set<ChangeEventType>;
};
export interface IHitInfo {
    width: number;
    height: number;
    x: number;
    y: number;
    row: number;
    col: number;
    pageX: number;
    pageY: number;
}
