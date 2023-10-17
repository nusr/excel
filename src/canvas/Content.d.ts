import { ContentView, IController, EventType } from '@/types';
export declare class Content implements ContentView {
    private canvas;
    private ctx;
    private controller;
    constructor(controller: IController, canvas: HTMLCanvasElement);
    getCanvas(): HTMLCanvasElement;
    resize(): void;
    private clear;
    render({ changeSet }: EventType): void;
    private renderContent;
    private renderTriangle;
    private renderGrid;
    private fillRowText;
    private fillColText;
    private renderRowsHeader;
    private renderColsHeader;
}
