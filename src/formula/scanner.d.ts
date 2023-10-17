import { Token } from './token';
export declare class Scanner {
    private readonly list;
    private current;
    private start;
    private readonly tokens;
    constructor(source: string);
    scan(): Token[];
    private peek;
    private match;
    private next;
    private isAtEnd;
    private addToken;
    private string;
    private allDigit;
    private number;
    private isDigit;
    private identifier;
    private scanToken;
    private anyChar;
    private isWhiteSpace;
}
