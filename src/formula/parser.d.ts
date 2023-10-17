import { Token } from './token';
import { Expression } from './expression';
export declare class Parser {
    private readonly tokens;
    private current;
    constructor(tokens: Token[]);
    parse(): Expression[];
    private expression;
    private comparison;
    private concatenate;
    private term;
    private factor;
    private expo;
    private unary;
    private postUnary;
    private cellRange;
    private call;
    private finishCall;
    private primary;
    private match;
    private previous;
    private check;
    private expect;
    private next;
    private isAtEnd;
    private peek;
}
