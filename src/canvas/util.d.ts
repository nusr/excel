import { ModelCellType, CanvasOverlayPosition, Point, EUnderLine, IWindowSize } from '@/types';
export declare function measureText(ctx: CanvasRenderingContext2D, char: string): IWindowSize;
export declare function fillRect(ctx: CanvasRenderingContext2D, x: number, y: number, width: number, height: number): void;
export declare function strokeRect(ctx: CanvasRenderingContext2D, x: number, y: number, width: number, height: number): void;
export declare function clearRect(ctx: CanvasRenderingContext2D, x: number, y: number, width: number, height: number): void;
export declare function fillText(ctx: CanvasRenderingContext2D, text: string, x: number, y: number): void;
interface IRenderCellResult {
    wrapHeight?: number;
    fontSizeHeight?: number;
}
export declare function renderCell(ctx: CanvasRenderingContext2D, cellInfo: ModelCellType & CanvasOverlayPosition): IRenderCellResult;
export declare function drawLines(ctx: CanvasRenderingContext2D, pointList: Array<Point>): void;
export declare function drawTriangle(ctx: CanvasRenderingContext2D, point1: Point, point2: Point, point3: Point): void;
export declare function drawAntLine(ctx: CanvasRenderingContext2D, x: number, y: number, width: number, height: number): void;
export declare function drawUnderline(ctx: CanvasRenderingContext2D, pointList: Array<Point>, underline: EUnderLine): void;
export declare function resizeCanvas(canvas: HTMLCanvasElement, width: number, height: number): void;
export {};
