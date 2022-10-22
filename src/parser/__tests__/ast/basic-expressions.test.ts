import {
  BinaryExpression,
  UnaryExpression,
  LiteralExpression,
} from '../../expression';
import { Token } from '../../token';
import { TokenType } from '../../../types';
import { buildTree } from './helper';

describe('basic expressions', function () {
  it('1', function () {
    const tree = buildTree('1');

    expect(tree).toEqual(
      new LiteralExpression(new Token(TokenType.NUMBER, '1')),
    );
  });

  // it('1E-2', function () {
  // const tree = buildTree(tokenizer('1E-2'));
  // expect(tree).toEqual(builder.numberLiteral(0.01));
  // });

  // it('10%', function () {
  // const tree = buildTree(tokenizer('10%'));
  // expect(tree).toEqual(builder.numberLiteral(0.1));
  // });

  it('-1', function () {
    const tree = buildTree('-1');
    expect(tree).toEqual(
      new UnaryExpression(
        new Token(TokenType.MINUS, '-'),
        new LiteralExpression(new Token(TokenType.NUMBER, '1')),
      ),
    );
  });

  it('---1', function () {
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

  it('"abc"', function () {
    const tree = buildTree('"abc"');

    expect(tree).toEqual(new LiteralExpression(new Token(TokenType.STRING, 'abc')));
  });

  it('TRUE', function () {
    const tree = buildTree('TRUE');

    expect(tree).toEqual(new LiteralExpression(new Token(TokenType.TRUE, 'TRUE')));
  });
  it('FALSE', function () {
    const tree = buildTree('FALSE');
    expect(tree).toEqual(new LiteralExpression(new Token(TokenType.FALSE, 'FALSE')));
  });

  it('1 + 2', function () {
    const tree = buildTree('1 + 2');

    expect(tree).toEqual(
      new BinaryExpression(
        new LiteralExpression(new Token(TokenType.NUMBER, '1')),
        new Token(TokenType.PLUS, '+'),
        new LiteralExpression(new Token(TokenType.NUMBER, '2')),
      ),
    );
  });

  it('-1 + 2', function () {
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

  it('"a" & "b"', function () {
    const tree = buildTree('"a" & "b"');

    expect(tree).toEqual(
      new BinaryExpression(
        new LiteralExpression(new Token(TokenType.STRING, 'a')),
        new Token(TokenType.CONCATENATE, '&'),
         new LiteralExpression(new Token(TokenType.STRING, 'b')),
      ),
    );
  });

  it('1 <> "b"', function () {
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
