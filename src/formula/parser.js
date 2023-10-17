import { TokenType } from '@/types';
import { Token } from './token';
import { TokenExpression, GroupExpression, PostUnaryExpression, } from './expression';
import { BinaryExpression, UnaryExpression, CallExpression, LiteralExpression, CellRangeExpression, } from './expression';
import { CustomError } from './formula';
const errorSet = new Set([
    '#ERROR!',
    '#DIV/0!',
    '#NULL!',
    '#NUM!',
    '#REF!',
    '#VALUE!',
    '#N/A',
    '#NAME?',
]);
export class Parser {
    tokens;
    current = 0;
    constructor(tokens) {
        this.tokens = tokens;
    }
    parse() {
        const result = [];
        while (!this.isAtEnd()) {
            result.push(this.expression());
        }
        return result;
    }
    expression() {
        return this.comparison();
    }
    comparison() {
        let expr = this.concatenate();
        while (this.match(TokenType.EQUAL, TokenType.NOT_EQUAL, TokenType.GREATER, TokenType.GREATER_EQUAL, TokenType.LESS, TokenType.LESS_EQUAL)) {
            const operator = this.previous();
            const right = this.concatenate();
            expr = new BinaryExpression(expr, operator, right);
        }
        return expr;
    }
    concatenate() {
        let expr = this.term();
        while (this.match(TokenType.CONCATENATE)) {
            const operator = this.previous();
            const right = this.term();
            expr = new BinaryExpression(expr, operator, right);
        }
        return expr;
    }
    term() {
        let expr = this.factor();
        while (this.match(TokenType.PLUS, TokenType.MINUS)) {
            const operator = this.previous();
            const right = this.factor();
            expr = new BinaryExpression(expr, operator, right);
        }
        return expr;
    }
    factor() {
        let expr = this.expo();
        while (this.match(TokenType.SLASH, TokenType.STAR)) {
            const operator = this.previous();
            const right = this.expo();
            expr = new BinaryExpression(expr, operator, right);
        }
        return expr;
    }
    expo() {
        let expr = this.unary();
        while (this.match(TokenType.EXPONENT)) {
            const operator = this.previous();
            const right = this.unary();
            expr = new BinaryExpression(expr, operator, right);
        }
        return expr;
    }
    unary() {
        if (this.match(TokenType.PLUS, TokenType.MINUS)) {
            const operator = this.previous();
            const right = this.unary();
            return new UnaryExpression(operator, right);
        }
        return this.postUnary();
    }
    postUnary() {
        let expr = this.cellRange();
        if (this.match(TokenType.PERCENT)) {
            const operator = this.previous();
            expr = new PostUnaryExpression(operator, expr);
        }
        return expr;
    }
    cellRange() {
        let expr = this.call();
        while (this.match(TokenType.COLON, TokenType.EXCLAMATION)) {
            const operator = this.previous();
            const right = this.call();
            expr = new CellRangeExpression(expr, operator, right);
        }
        return expr;
    }
    call() {
        let expr = this.primary();
        while (true) {
            if (this.match(TokenType.LEFT_BRACKET)) {
                expr = this.finishCall(expr);
            }
            else {
                break;
            }
        }
        return expr;
    }
    finishCall(name) {
        const params = [];
        if (!this.check(TokenType.RIGHT_BRACKET)) {
            do {
                if (this.peek().type == TokenType.RIGHT_BRACKET) {
                    break;
                }
                params.push(this.expression());
            } while (this.match(TokenType.COMMA));
        }
        this.expect(TokenType.RIGHT_BRACKET);
        return new CallExpression(name, params);
    }
    primary() {
        if (this.match(TokenType.LEFT_BRACKET)) {
            const value = this.expression();
            this.expect(TokenType.RIGHT_BRACKET);
            return new GroupExpression(value);
        }
        if (this.match(TokenType.NUMBER, TokenType.STRING, TokenType.TRUE, TokenType.FALSE)) {
            return new LiteralExpression(this.previous());
        }
        if (this.match(TokenType.IDENTIFIER)) {
            const name = this.previous();
            const realValue = name.value.toUpperCase();
            if (errorSet.has(realValue)) {
                throw new CustomError(realValue);
            }
            return new TokenExpression(name);
        }
        throw new CustomError('#ERROR!');
    }
    match(...types) {
        const type = this.peek().type;
        if (types.includes(type)) {
            this.next();
            return true;
        }
        return false;
    }
    previous() {
        return this.tokens[this.current - 1];
    }
    check(type) {
        return this.peek().type === type;
    }
    expect(type) {
        if (this.check(type)) {
            this.next();
            return this.previous();
        }
        else {
            throw new CustomError('#ERROR!');
        }
    }
    next() {
        this.current++;
    }
    isAtEnd() {
        return this.peek().type === TokenType.EOF;
    }
    peek() {
        if (this.current < this.tokens.length) {
            return this.tokens[this.current];
        }
        return new Token(TokenType.EOF, '');
    }
}
//# sourceMappingURL=parser.js.map