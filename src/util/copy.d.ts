import type { ClipboardData } from '@/types';
export declare const PLAIN_FORMAT = "text/plain";
export declare const HTML_FORMAT = "text/html";
export declare function isSupported(action?: string[]): boolean;
export declare function copy(textData: ClipboardData): Promise<string>;
export declare function cut(textData: ClipboardData): Promise<string>;
export declare function paste(): Promise<ClipboardData>;
export declare function generateHTML(style: string, content: string): string;
