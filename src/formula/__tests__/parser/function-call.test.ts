import { buildTree } from './util';
import {
  BinaryExpression,
  CallExpression,
  LiteralExpression,
  TokenExpression,
  UnaryExpression,
  CellExpression,
} from '../../expression';
import { Token } from '../../token';
import { TokenType } from '../../../types';

describe('function calls', () => {
  it('SUM()', () => {
    const tree = buildTree('SUM()');

    expect(tree).toEqual(
      new CallExpression(
        new TokenExpression(new Token(TokenType.IDENTIFIER, 'SUM')),
        [],
      ),
    );
  });

  it('sum()', () => {
    const tree = buildTree('sum()');

    expect(tree).toEqual(
      new CallExpression(
        new TokenExpression(new Token(TokenType.IDENTIFIER, 'sum')),
        [],
      ),
    );
  });

  it('-SUM()', () => {
    const tree = buildTree('-SUM()');

    expect(tree).toEqual(
      new UnaryExpression(
        new Token(TokenType.MINUS, '-'),
        new CallExpression(
          new TokenExpression(new Token(TokenType.IDENTIFIER, 'SUM')),
          [],
        ),
      ),
    );
  });

  it('SUM(1)', () => {
    const tree = buildTree('SUM(1)');
    expect(tree).toEqual(
      new CallExpression(
        new TokenExpression(new Token(TokenType.IDENTIFIER, 'SUM')),
        [new LiteralExpression(new Token(TokenType.INTEGER, '1'))],
      ),
    );
  });

  it('SUM(1, 2)', () => {
    const tree = buildTree('SUM(1, 2)');
    expect(tree).toEqual(
      new CallExpression(
        new TokenExpression(new Token(TokenType.IDENTIFIER, 'SUM')),
        [
          new LiteralExpression(new Token(TokenType.INTEGER, '1')),
          new LiteralExpression(new Token(TokenType.INTEGER, '2')),
        ],
      ),
    );
  });

  it('SUM(1, SUM(2, 3))', () => {
    const tree = buildTree('SUM(1, SUM(2, 3))');

    expect(tree).toEqual(
      new CallExpression(
        new TokenExpression(new Token(TokenType.IDENTIFIER, 'SUM')),
        [
          new LiteralExpression(new Token(TokenType.INTEGER, '1')),
          new CallExpression(
            new TokenExpression(new Token(TokenType.IDENTIFIER, 'SUM')),
            [
              new LiteralExpression(new Token(TokenType.INTEGER, '2')),
              new LiteralExpression(new Token(TokenType.INTEGER, '3')),
            ],
          ),
        ],
      ),
    );
  });

  it('SUM(10 / 4, SUM(2, 3))', () => {
    const tree = buildTree('SUM(10 / 4, SUM(2, 3))');
    expect(tree).toEqual(
      new CallExpression(
        new TokenExpression(new Token(TokenType.IDENTIFIER, 'SUM')),
        [
          new BinaryExpression(
            new LiteralExpression(new Token(TokenType.INTEGER, '10')),
            new Token(TokenType.SLASH, '/'),
            new LiteralExpression(new Token(TokenType.INTEGER, '4')),
          ),
          new CallExpression(
            new TokenExpression(new Token(TokenType.IDENTIFIER, 'SUM')),
            [
              new LiteralExpression(new Token(TokenType.INTEGER, '2')),
              new LiteralExpression(new Token(TokenType.INTEGER, '3')),
            ],
          ),
        ],
      ),
    );
  });

  it('2 + SUM(1)', () => {
    const tree = buildTree('2 + SUM(1)');

    expect(tree).toEqual(
      new BinaryExpression(
        new LiteralExpression(new Token(TokenType.INTEGER, '2')),
        new Token(TokenType.PLUS, '+'),
        new CallExpression(
          new TokenExpression(new Token(TokenType.IDENTIFIER, 'SUM')),
          [new LiteralExpression(new Token(TokenType.INTEGER, '1'))],
        ),
      ),
    );
  });

  it('2 + SUM(1, 2, 3, 4)', () => {
    const tree = buildTree('2 + SUM(1, 2, 3, 4)');
    expect(tree).toEqual(
      new BinaryExpression(
        new LiteralExpression(new Token(TokenType.INTEGER, '2')),
        new Token(TokenType.PLUS, '+'),
        new CallExpression(
          new TokenExpression(new Token(TokenType.IDENTIFIER, 'SUM')),
          [
            new LiteralExpression(new Token(TokenType.INTEGER, '1')),
            new LiteralExpression(new Token(TokenType.INTEGER, '2')),
            new LiteralExpression(new Token(TokenType.INTEGER, '3')),
            new LiteralExpression(new Token(TokenType.INTEGER, '4')),
          ],
        ),
      ),
    );
  });

  it('SUM(2) + SUM(1)', () => {
    const tree = buildTree('SUM(2) + SUM(1)');

    expect(tree).toEqual(
      new BinaryExpression(
        new CallExpression(
          new TokenExpression(new Token(TokenType.IDENTIFIER, 'SUM')),
          [new LiteralExpression(new Token(TokenType.INTEGER, '2'))],
        ),
        new Token(TokenType.PLUS, '+'),
        new CallExpression(
          new TokenExpression(new Token(TokenType.IDENTIFIER, 'SUM')),
          [new LiteralExpression(new Token(TokenType.INTEGER, '1'))],
        ),
      ),
    );
  });

  it('SUM(SUM(1), 2 + 3)', () => {
    const tree = buildTree('SUM(SUM(1), 2 + 3)');
    expect(tree).toEqual(
      new CallExpression(
        new TokenExpression(new Token(TokenType.IDENTIFIER, 'SUM')),
        [
          new CallExpression(
            new TokenExpression(new Token(TokenType.IDENTIFIER, 'SUM')),
            [new LiteralExpression(new Token(TokenType.INTEGER, '1'))],
          ),
          new BinaryExpression(
            new LiteralExpression(new Token(TokenType.INTEGER, '2')),
            new Token(TokenType.PLUS, '+'),
            new LiteralExpression(new Token(TokenType.INTEGER, '3')),
          ),
        ],
      ),
    );
  });
  it('SUM(Sheet1!A1,$B$1)', () => {
    const tree = buildTree('SUM(Sheet1!A1,$B$1)');

    expect(tree).toEqual(
      new CallExpression(
        new TokenExpression(new Token(TokenType.IDENTIFIER, 'SUM')),
        [
          new CellExpression(
            new Token(TokenType.IDENTIFIER, 'A1'),
            'relative',
            new Token(TokenType.IDENTIFIER, 'Sheet1'),
          ),
          new CellExpression(
            new Token(TokenType.ABSOLUTE_CELL, '$B$1'),
            'absolute',
            undefined,
          ),
        ],
      ),
    );
  });
});
