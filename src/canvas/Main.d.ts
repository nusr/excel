import { EventType, ContentView, IController } from '@/types';
export declare class MainCanvas {
    private ctx;
    private content;
    private canvas;
    private controller;
    constructor(controller: IController, content: ContentView);
    resize(): void;
    private clear;
    render: (params: EventType) => void;
    private renderAntLine;
    private renderSelection;
    private renderActiveCell;
    private renderSelectRange;
    private renderSelectAll;
    private renderSelectCol;
    private renderSelectRow;
}
