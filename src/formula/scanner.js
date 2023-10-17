import { TokenType } from '@/types';
import { Token } from './token';
import { CustomError } from './formula';
const emptyData = '';
const identifierMap = new Map([
    ['TRUE', TokenType.TRUE],
    ['FALSE', TokenType.FALSE],
]);
export class Scanner {
    list;
    current = 0;
    start = 0;
    tokens = [];
    constructor(source) {
        this.list = [...source];
    }
    scan() {
        while (!this.isAtEnd()) {
            this.start = this.current;
            this.scanToken();
        }
        this.tokens.push(new Token(TokenType.EOF, ''));
        if (this.tokens.length > 0 && this.tokens[0].type === TokenType.EQUAL) {
            this.tokens.shift();
        }
        return this.tokens;
    }
    peek() {
        if (this.isAtEnd()) {
            return emptyData;
        }
        return this.list[this.current];
    }
    match(text) {
        if (this.peek() !== text) {
            return false;
        }
        this.next();
        return true;
    }
    next() {
        if (this.isAtEnd()) {
            return emptyData;
        }
        return this.list[this.current++];
    }
    isAtEnd() {
        return this.current >= this.list.length;
    }
    addToken(type) {
        const text = this.list.slice(this.start, this.current).join('');
        this.tokens.push(new Token(type, text));
    }
    string(end) {
        while (!this.isAtEnd() && this.peek() !== end) {
            this.next();
        }
        if (this.peek() !== end) {
            throw new CustomError('#VALUE!');
        }
        else {
            this.next();
        }
        const text = this.list.slice(this.start + 1, this.current - 1).join('');
        this.tokens.push(new Token(TokenType.STRING, text));
    }
    allDigit() {
        while (!this.isAtEnd() && this.isDigit(this.peek())) {
            this.next();
        }
    }
    number() {
        this.allDigit();
        if (this.match('E')) {
            if (this.match('+') || this.match('-')) {
                this.allDigit();
                this.addToken(TokenType.NUMBER);
                return;
            }
            throw new CustomError('#VALUE!');
        }
        if (this.match('.')) {
            this.allDigit();
        }
        if (this.match('E')) {
            if (this.match('+') || this.match('-')) {
                this.allDigit();
                this.addToken(TokenType.NUMBER);
                return;
            }
            throw new CustomError('#VALUE!');
        }
        this.addToken(TokenType.NUMBER);
    }
    isDigit(char) {
        return char >= '0' && char <= '9';
    }
    identifier() {
        while (!this.isAtEnd() && this.anyChar(this.peek())) {
            this.next();
        }
        let text = this.list.slice(this.start, this.current).join('');
        const temp = identifierMap.get(text.toUpperCase());
        let type = TokenType.IDENTIFIER;
        if (temp) {
            text = text.toUpperCase();
            type = temp;
        }
        this.tokens.push(new Token(type, text));
    }
    scanToken() {
        const c = this.next();
        switch (c) {
            case '(':
                this.addToken(TokenType.LEFT_BRACKET);
                break;
            case ')':
                this.addToken(TokenType.RIGHT_BRACKET);
                break;
            case ',':
                this.addToken(TokenType.COMMA);
                break;
            case ':':
                this.addToken(TokenType.COLON);
                break;
            case '=':
                this.addToken(TokenType.EQUAL);
                break;
            case '<':
                if (this.match('>')) {
                    this.addToken(TokenType.NOT_EQUAL);
                }
                else if (this.match('=')) {
                    this.addToken(TokenType.LESS_EQUAL);
                }
                else {
                    this.addToken(TokenType.LESS);
                }
                break;
            case '>':
                if (this.match('=')) {
                    this.addToken(TokenType.GREATER_EQUAL);
                }
                else {
                    this.addToken(TokenType.GREATER);
                }
                break;
            case '+':
                this.addToken(TokenType.PLUS);
                break;
            case '-':
                this.addToken(TokenType.MINUS);
                break;
            case '*':
                this.addToken(TokenType.STAR);
                break;
            case '/':
                this.addToken(TokenType.SLASH);
                break;
            case '^':
                this.addToken(TokenType.EXPONENT);
                break;
            case '&':
                this.addToken(TokenType.CONCATENATE);
                break;
            case '%':
                this.addToken(TokenType.PERCENT);
                break;
            case '"':
                this.string(c);
                break;
            case '!':
                this.addToken(TokenType.EXCLAMATION);
                break;
            case ';':
                this.addToken(TokenType.SEMICOLON);
                break;
            case '{':
                this.addToken(TokenType.lEFT_BRACE);
                break;
            case '}':
                this.addToken(TokenType.RIGHT_BRACE);
                break;
            case ' ':
                break;
            case '\r':
            case '\t':
            case '\n':
                break;
            default:
                if (this.isDigit(c)) {
                    this.number();
                }
                else if (this.anyChar(c)) {
                    this.identifier();
                }
                else {
                    throw new CustomError('#ERROR!');
                }
                break;
        }
    }
    anyChar(c) {
        const text = '(),:=<>+-*/^&%"{}!';
        return !text.includes(c) && !this.isWhiteSpace(c);
    }
    isWhiteSpace(c) {
        return c === ' ' || c === '\r' || c === '\n' || c === '\t';
    }
}
//# sourceMappingURL=scanner.js.map