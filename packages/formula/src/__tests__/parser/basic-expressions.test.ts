import {
  BinaryExpression,
  UnaryExpression,
  LiteralExpression,
  PostUnaryExpression,
} from '../../expression';
import { Token } from '../../token';
import { TokenType } from '@excel/shared';
import { buildTree } from './util';

describe('basic expressions', () => {
  it('1', () => {
    const tree = buildTree('1');

    expect(tree).toEqual(
      new LiteralExpression(new Token(TokenType.NUMBER, '1')),
    );
  });

  it('1E-2', () => {
    const tree = buildTree('1E-2');
    expect(tree).toEqual(
      new LiteralExpression(new Token(TokenType.NUMBER, '1E-2')),
    );
  });

  it('10%', () => {
    const tree = buildTree('10%');
    expect(tree).toEqual(
      new PostUnaryExpression(
        new Token(TokenType.PERCENT, '%'),
        new LiteralExpression(new Token(TokenType.NUMBER, '10')),
      ),
    );
  });

  it('-1', () => {
    const tree = buildTree('-1');
    expect(tree).toEqual(
      new UnaryExpression(
        new Token(TokenType.MINUS, '-'),
        new LiteralExpression(new Token(TokenType.NUMBER, '1')),
      ),
    );
  });

  it('---1', () => {
    const tree = buildTree('---1');

    expect(tree).toEqual(
      new UnaryExpression(
        new Token(TokenType.MINUS, '-'),
        new UnaryExpression(
          new Token(TokenType.MINUS, '-'),
          new UnaryExpression(
            new Token(TokenType.MINUS, '-'),
            new LiteralExpression(new Token(TokenType.NUMBER, '1')),
          ),
        ),
      ),
    );
  });

  it('"abc"', () => {
    const tree = buildTree('"abc"');

    expect(tree).toEqual(
      new LiteralExpression(new Token(TokenType.STRING, 'abc')),
    );
  });

  it('TRUE', () => {
    const tree = buildTree('TRUE');

    expect(tree).toEqual(
      new LiteralExpression(new Token(TokenType.BOOL, 'TRUE')),
    );
  });
  it('FALSE', () => {
    const tree = buildTree('FALSE');
    expect(tree).toEqual(
      new LiteralExpression(new Token(TokenType.BOOL, 'FALSE')),
    );
  });

  it('1 + 2', () => {
    const tree = buildTree('1 + 2');

    expect(tree).toEqual(
      new BinaryExpression(
        new LiteralExpression(new Token(TokenType.NUMBER, '1')),
        new Token(TokenType.PLUS, '+'),
        new LiteralExpression(new Token(TokenType.NUMBER, '2')),
      ),
    );
  });

  it('-1 + 2', () => {
    const tree = buildTree('-1 + 2');
    expect(tree).toEqual(
      new BinaryExpression(
        new UnaryExpression(
          new Token(TokenType.MINUS, '-'),
          new LiteralExpression(new Token(TokenType.NUMBER, '1')),
        ),
        new Token(TokenType.PLUS, '+'),
        new LiteralExpression(new Token(TokenType.NUMBER, '2')),
      ),
    );
  });

  it('"a" & "b"', () => {
    const tree = buildTree('"a" & "b"');

    expect(tree).toEqual(
      new BinaryExpression(
        new LiteralExpression(new Token(TokenType.STRING, 'a')),
        new Token(TokenType.CONCATENATE, '&'),
        new LiteralExpression(new Token(TokenType.STRING, 'b')),
      ),
    );
  });

  it('1 <> "b"', () => {
    const tree = buildTree('1 <> "b"');

    expect(tree).toEqual(
      new BinaryExpression(
        new LiteralExpression(new Token(TokenType.NUMBER, '1')),
        new Token(TokenType.NOT_EQUAL, '<>'),
        new LiteralExpression(new Token(TokenType.STRING, 'b')),
      ),
    );
  });
});
