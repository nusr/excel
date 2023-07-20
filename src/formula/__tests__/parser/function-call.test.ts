import { buildTree } from './util';
import {
  BinaryExpression,
  CallExpression,
  LiteralExpression,
  TokenExpression,
  UnaryExpression,
} from '../../expression';
import { Token } from '../../token';
import { TokenType } from '../../../types';
describe('function calls', function () {
  it('SUM()', function () {
    const tree = buildTree('SUM()');

    expect(tree).toEqual(
      new CallExpression(new TokenExpression(new Token(TokenType.IDENTIFIER, 'SUM')), []),
    );
  });

  it('sum()', function () {
    const tree = buildTree('sum()');

    expect(tree).toEqual(
      new CallExpression(new TokenExpression(new Token(TokenType.IDENTIFIER, 'sum')), []),
    );
  });

  it('-SUM()', function () {
    const tree = buildTree('-SUM()');

    expect(tree).toEqual(
      new UnaryExpression(
        new Token(TokenType.MINUS, '-'),
        new CallExpression(new TokenExpression(new Token(TokenType.IDENTIFIER, 'SUM')), []),
      ),
    );
  });

  it('SUM(1)', function () {
    const tree = buildTree('SUM(1)');
    expect(tree).toEqual(
      new CallExpression(new TokenExpression(new Token(TokenType.IDENTIFIER, 'SUM')), [
        new LiteralExpression(new Token(TokenType.NUMBER, '1')),
      ]),
    );
  });

  it('SUM(1, 2)', function () {
    const tree = buildTree('SUM(1, 2)');
    expect(tree).toEqual(
      new CallExpression(new TokenExpression(new Token(TokenType.IDENTIFIER, 'SUM')), [
        new LiteralExpression(new Token(TokenType.NUMBER, '1')),
        new LiteralExpression(new Token(TokenType.NUMBER, '2')),
      ]),
    );
  });

  it('SUM(1, SUM(2, 3))', function () {
    const tree = buildTree('SUM(1, SUM(2, 3))');

    expect(tree).toEqual(
      new CallExpression(new TokenExpression(new Token(TokenType.IDENTIFIER, 'SUM')), [
        new LiteralExpression(new Token(TokenType.NUMBER, '1')),
        new CallExpression(new TokenExpression(new Token(TokenType.IDENTIFIER, 'SUM')), [
          new LiteralExpression(new Token(TokenType.NUMBER, '2')),
          new LiteralExpression(new Token(TokenType.NUMBER, '3')),
        ]),
      ]),
    );
  });

  it('SUM(10 / 4, SUM(2, 3))', function () {
    const tree = buildTree('SUM(10 / 4, SUM(2, 3))');
    expect(tree).toEqual(
      new CallExpression(new TokenExpression(new Token(TokenType.IDENTIFIER, 'SUM')), [
        new BinaryExpression(
          new LiteralExpression(new Token(TokenType.NUMBER, '10')),
          new Token(TokenType.SLASH, '/'),
          new LiteralExpression(new Token(TokenType.NUMBER, '4')),
        ),
        new CallExpression(new TokenExpression(new Token(TokenType.IDENTIFIER, 'SUM')), [
          new LiteralExpression(new Token(TokenType.NUMBER, '2')),
          new LiteralExpression(new Token(TokenType.NUMBER, '3')),
        ]),
      ]),
    );
  });

  it('2 + SUM(1)', function () {
    const tree = buildTree('2 + SUM(1)');

    expect(tree).toEqual(
      new BinaryExpression(
        new LiteralExpression(new Token(TokenType.NUMBER, '2')),
        new Token(TokenType.PLUS, '+'),
        new CallExpression(new TokenExpression(new Token(TokenType.IDENTIFIER, 'SUM')), [
          new LiteralExpression(new Token(TokenType.NUMBER, '1')),
        ]),
      ),
    );
  });

  it('2 + SUM(1, 2, 3, 4)', function () {
    const tree = buildTree('2 + SUM(1, 2, 3, 4)');
    expect(tree).toEqual(
      new BinaryExpression(
        new LiteralExpression(new Token(TokenType.NUMBER, '2')),
        new Token(TokenType.PLUS, '+'),
        new CallExpression(new TokenExpression(new Token(TokenType.IDENTIFIER, 'SUM')), [
          new LiteralExpression(new Token(TokenType.NUMBER, '1')),
          new LiteralExpression(new Token(TokenType.NUMBER, '2')),
          new LiteralExpression(new Token(TokenType.NUMBER, '3')),
          new LiteralExpression(new Token(TokenType.NUMBER, '4')),
        ]),
      ),
    );
  });

  it('SUM(2) + SUM(1)', function () {
    const tree = buildTree('SUM(2) + SUM(1)');

    expect(tree).toEqual(
      new BinaryExpression(
        new CallExpression(new TokenExpression(new Token(TokenType.IDENTIFIER, 'SUM')), [
          new LiteralExpression(new Token(TokenType.NUMBER, '2')),
        ]),
        new Token(TokenType.PLUS, '+'),
        new CallExpression(new TokenExpression(new Token(TokenType.IDENTIFIER, 'SUM')), [
          new LiteralExpression(new Token(TokenType.NUMBER, '1')),
        ]),
      ),
    );
  });

  it('SUM(SUM(1), 2 + 3)', function () {
    const tree = buildTree('SUM(SUM(1), 2 + 3)');
    expect(tree).toEqual(
      new CallExpression(new TokenExpression(new Token(TokenType.IDENTIFIER, 'SUM')), [
        new CallExpression(new TokenExpression(new Token(TokenType.IDENTIFIER, 'SUM')), [
          new LiteralExpression(new Token(TokenType.NUMBER, '1')),
        ]),
        new BinaryExpression(
          new LiteralExpression(new Token(TokenType.NUMBER, '2')),
          new Token(TokenType.PLUS, '+'),
          new LiteralExpression(new Token(TokenType.NUMBER, '3')),
        ),
      ]),
    );
  });
});
