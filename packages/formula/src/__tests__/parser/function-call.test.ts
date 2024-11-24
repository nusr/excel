import { buildTree } from './util';
import {
  BinaryExpression,
  CallExpression,
  LiteralExpression,
  UnaryExpression,
  CellExpression,
} from '../../expression';
import { Token } from '../../token';
import { TokenType } from '@excel/shared';

const getFunc = (name: string) => new Token(TokenType.EXCEL_FUNCTION, name);

describe('function calls', () => {
  it('SUM()', () => {
    const tree = buildTree('SUM()');

    expect(tree).toEqual(new CallExpression(getFunc('SUM'), []));
  });

  it('sum()', () => {
    const tree = buildTree('sum()');

    expect(tree).toEqual(new CallExpression(getFunc('SUM'), []));
  });

  it('-SUM()', () => {
    const tree = buildTree('-SUM()');

    expect(tree).toEqual(
      new UnaryExpression(
        new Token(TokenType.MINUS, '-'),
        new CallExpression(getFunc('SUM'), []),
      ),
    );
  });

  it('SUM(1)', () => {
    const tree = buildTree('SUM(1)');
    expect(tree).toEqual(
      new CallExpression(getFunc('SUM'), [
        new LiteralExpression(new Token(TokenType.NUMBER, '1')),
      ]),
    );
  });

  it('SUM(1, 2)', () => {
    const tree = buildTree('SUM(1, 2)');
    expect(tree).toEqual(
      new CallExpression(getFunc('SUM'), [
        new LiteralExpression(new Token(TokenType.NUMBER, '1')),
        new LiteralExpression(new Token(TokenType.NUMBER, '2')),
      ]),
    );
  });

  it('SUM(1, SUM(2, 3))', () => {
    const tree = buildTree('SUM(1, SUM(2, 3))');

    expect(tree).toEqual(
      new CallExpression(getFunc('SUM'), [
        new LiteralExpression(new Token(TokenType.NUMBER, '1')),
        new CallExpression(getFunc('SUM'), [
          new LiteralExpression(new Token(TokenType.NUMBER, '2')),
          new LiteralExpression(new Token(TokenType.NUMBER, '3')),
        ]),
      ]),
    );
  });

  it('SUM(10 / 4, SUM(2, 3))', () => {
    const tree = buildTree('SUM(10 / 4, SUM(2, 3))');
    expect(tree).toEqual(
      new CallExpression(getFunc('SUM'), [
        new BinaryExpression(
          new LiteralExpression(new Token(TokenType.NUMBER, '10')),
          new Token(TokenType.SLASH, '/'),
          new LiteralExpression(new Token(TokenType.NUMBER, '4')),
        ),
        new CallExpression(getFunc('SUM'), [
          new LiteralExpression(new Token(TokenType.NUMBER, '2')),
          new LiteralExpression(new Token(TokenType.NUMBER, '3')),
        ]),
      ]),
    );
  });

  it('2 + SUM(1)', () => {
    const tree = buildTree('2 + SUM(1)');

    expect(tree).toEqual(
      new BinaryExpression(
        new LiteralExpression(new Token(TokenType.NUMBER, '2')),
        new Token(TokenType.PLUS, '+'),
        new CallExpression(getFunc('SUM'), [
          new LiteralExpression(new Token(TokenType.NUMBER, '1')),
        ]),
      ),
    );
  });

  it('2 + SUM(1, 2, 3, 4)', () => {
    const tree = buildTree('2 + SUM(1, 2, 3, 4)');
    expect(tree).toEqual(
      new BinaryExpression(
        new LiteralExpression(new Token(TokenType.NUMBER, '2')),
        new Token(TokenType.PLUS, '+'),
        new CallExpression(getFunc('SUM'), [
          new LiteralExpression(new Token(TokenType.NUMBER, '1')),
          new LiteralExpression(new Token(TokenType.NUMBER, '2')),
          new LiteralExpression(new Token(TokenType.NUMBER, '3')),
          new LiteralExpression(new Token(TokenType.NUMBER, '4')),
        ]),
      ),
    );
  });

  it('SUM(2) + SUM(1)', () => {
    const tree = buildTree('SUM(2) + SUM(1)');

    expect(tree).toEqual(
      new BinaryExpression(
        new CallExpression(getFunc('SUM'), [
          new LiteralExpression(new Token(TokenType.NUMBER, '2')),
        ]),
        new Token(TokenType.PLUS, '+'),
        new CallExpression(getFunc('SUM'), [
          new LiteralExpression(new Token(TokenType.NUMBER, '1')),
        ]),
      ),
    );
  });

  it('SUM(SUM(1), 2 + 3)', () => {
    const tree = buildTree('SUM(SUM(1), 2 + 3)');
    expect(tree).toEqual(
      new CallExpression(getFunc('SUM'), [
        new CallExpression(getFunc('SUM'), [
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
  it('SUM(Sheet1!A1,$B$1)', () => {
    const tree = buildTree('SUM(Sheet1!A1,$B$1)');

    expect(tree).toEqual(
      new CallExpression(getFunc('SUM'), [
        new CellExpression(
          new Token(TokenType.CELL, 'A1'),
          new Token(TokenType.SHEET_NAME, 'Sheet1'),
        ),
        new CellExpression(
          new Token(TokenType.CELL, '$B$1'),
          undefined,
        ),
      ]),
    );
  });
});
