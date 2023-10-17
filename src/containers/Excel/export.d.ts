import { IController, ResultType } from '@/types';
export declare function exportToCsv(fileName: string, rows: ResultType[][]): void;
export declare function exportToXLSX(fileName: string, controller: IController): Promise<void>;
