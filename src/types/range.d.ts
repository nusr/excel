export interface IRange {
    row: number;
    col: number;
    rowCount: number;
    colCount: number;
    sheetId: string;
}
export type NumberFormatItem = {
    formatCode: string;
    label: string;
    id: number;
};
