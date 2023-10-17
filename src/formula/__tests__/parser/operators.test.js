import { buildTree } from './util';
import { BinaryExpression, GroupExpression, LiteralExpression, PostUnaryExpression, } from '../../expression';
import { Token } from '../../token';
import { TokenType } from '../../../types';
describe('operators', function () {
    describe('precedence', function () {
        it('1 + 2 >= 3 - 4', function () {
            const tree = buildTree('1 + 2 >= 3 - 4');
            expect(tree).toEqual(new BinaryExpression(new BinaryExpression(new LiteralExpression(new Token(TokenType.NUMBER, '1')), new Token(TokenType.PLUS, '+'), new LiteralExpression(new Token(TokenType.NUMBER, '2'))), new Token(TokenType.GREATER_EQUAL, '>='), new BinaryExpression(new LiteralExpression(new Token(TokenType.NUMBER, '3')), new Token(TokenType.MINUS, '-'), new LiteralExpression(new Token(TokenType.NUMBER, '4')))));
        });
        it('1 + 2 & "a"', function () {
            const tree = buildTree('1 + 2 & "a"');
            expect(tree).toEqual(new BinaryExpression(new BinaryExpression(new LiteralExpression(new Token(TokenType.NUMBER, '1')), new Token(TokenType.PLUS, '+'), new LiteralExpression(new Token(TokenType.NUMBER, '2'))), new Token(TokenType.CONCATENATE, '&'), new LiteralExpression(new Token(TokenType.STRING, 'a'))));
        });
        it('1 + 2 * 3', function () {
            const tree = buildTree('1 + 2 * 3');
            expect(tree).toEqual(new BinaryExpression(new LiteralExpression(new Token(TokenType.NUMBER, '1')), new Token(TokenType.PLUS, '+'), new BinaryExpression(new LiteralExpression(new Token(TokenType.NUMBER, '2')), new Token(TokenType.STAR, '*'), new LiteralExpression(new Token(TokenType.NUMBER, '3')))));
        });
        it('1 * 2 ^ 3', function () {
            const tree = buildTree('1 * 2 ^ 3');
            expect(tree).toEqual(new BinaryExpression(new LiteralExpression(new Token(TokenType.NUMBER, '1')), new Token(TokenType.STAR, '*'), new BinaryExpression(new LiteralExpression(new Token(TokenType.NUMBER, '2')), new Token(TokenType.EXPONENT, '^'), new LiteralExpression(new Token(TokenType.NUMBER, '3')))));
        });
        it('(1 * 2) ^ 3', function () {
            const tree = buildTree('(1 * 2) ^ 3');
            expect(tree).toEqual(new BinaryExpression(new GroupExpression(new BinaryExpression(new LiteralExpression(new Token(TokenType.NUMBER, '1')), new Token(TokenType.STAR, '*'), new LiteralExpression(new Token(TokenType.NUMBER, '2')))), new Token(TokenType.EXPONENT, '^'), new LiteralExpression(new Token(TokenType.NUMBER, '3'))));
        });
    });
    describe('associativity', function () {
        it('1 + 2 + 3', function () {
            const tree = buildTree('1 + 2 + 3');
            expect(tree).toEqual(new BinaryExpression(new BinaryExpression(new LiteralExpression(new Token(TokenType.NUMBER, '1')), new Token(TokenType.PLUS, '+'), new LiteralExpression(new Token(TokenType.NUMBER, '2'))), new Token(TokenType.PLUS, '+'), new LiteralExpression(new Token(TokenType.NUMBER, '3'))));
        });
        it('1 + (2 + 3)', function () {
            const tree = buildTree('1 + (2 + 3)');
            expect(tree).toEqual(new BinaryExpression(new LiteralExpression(new Token(TokenType.NUMBER, '1')), new Token(TokenType.PLUS, '+'), new GroupExpression(new BinaryExpression(new LiteralExpression(new Token(TokenType.NUMBER, '2')), new Token(TokenType.PLUS, '+'), new LiteralExpression(new Token(TokenType.NUMBER, '3'))))));
        });
        it('1 / 2 / 3', function () {
            const tree = buildTree('1 / 2 / 3');
            expect(tree).toEqual(new BinaryExpression(new BinaryExpression(new LiteralExpression(new Token(TokenType.NUMBER, '1')), new Token(TokenType.SLASH, '/'), new LiteralExpression(new Token(TokenType.NUMBER, '2'))), new Token(TokenType.SLASH, '/'), new LiteralExpression(new Token(TokenType.NUMBER, '3'))));
        });
        it('2%', () => {
            const tree = buildTree('2%');
            expect(tree).toEqual(new PostUnaryExpression(new Token(TokenType.PERCENT, '%'), new LiteralExpression(new Token(TokenType.NUMBER, '2'))));
        });
    });
});
//# sourceMappingURL=operators.test.js.map