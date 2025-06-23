import { buildTree } from './util';
import {
  CellRangeExpression,
  CellExpression,
} from '../../expression';
import { TokenType } from '../../../types';
import { Token } from '../../token';

describe('cell ranges', () => {
  it('A1', () => {
    const tree = buildTree('A1');

    expect(tree).toEqual(
      new CellExpression(new Token(TokenType.CELL, 'A1'), undefined),
    );
  });

  it('A$1', () => {
    const tree = buildTree('A$1');

    expect(tree).toEqual(
      new CellExpression(new Token(TokenType.CELL, 'A$1'), undefined),
    );
  });

  it('$A1', () => {
    const tree = buildTree('$A1');

    expect(tree).toEqual(
      new CellExpression(new Token(TokenType.CELL, '$A1'), undefined),
    );
  });

  it('$a1', () => {
    const tree = buildTree('$a1');

    expect(tree).toEqual(
      new CellExpression(new Token(TokenType.CELL, '$a1'), undefined),
    );
  });

  it('$A$1', () => {
    const tree = buildTree('$A$1');
    expect(tree).toEqual(
      new CellExpression(new Token(TokenType.CELL, '$A$1'), undefined),
    );
  });

  it('A1:A4', () => {
    const tree = buildTree('A1:A4');

    expect(tree).toEqual(
      new CellRangeExpression(
        new CellExpression(new Token(TokenType.CELL, 'A1'), undefined),
        new Token(TokenType.COLON, ':'),
        new CellExpression(new Token(TokenType.CELL, 'A4'), undefined),
      ),
    );
  });

  it('$A1:A$4', () => {
    const tree = buildTree('$A1:A$4');

    expect(tree).toEqual(
      new CellRangeExpression(
        new CellExpression(new Token(TokenType.CELL, '$A1'), undefined),
        new Token(TokenType.COLON, ':'),
        new CellExpression(new Token(TokenType.CELL, 'A$4'), undefined),
      ),
    );
  });

  it('$A$1:$A$4', () => {
    const tree = buildTree('$A$1:$A$4');

    expect(tree).toEqual(
      new CellRangeExpression(
        new CellExpression(new Token(TokenType.CELL, '$A$1'), undefined),
        new Token(TokenType.COLON, ':'),
        new CellExpression(new Token(TokenType.CELL, '$A$4'), undefined),
      ),
    );
  });

  it('1:4', () => {
    const tree = buildTree('1:4');
    expect(tree).toEqual(
      new CellRangeExpression(
        new CellExpression(new Token(TokenType.NUMBER, '1'), undefined),
        new Token(TokenType.COLON, ':'),
        new CellExpression(new Token(TokenType.NUMBER, '4'), undefined),
      ),
    );
  });

  it('$1:4', () => {
    const tree = buildTree('$1:4');

    expect(tree).toEqual(
      new CellRangeExpression(
        new CellExpression(new Token(TokenType.ROW, '$1'), undefined),
        new Token(TokenType.COLON, ':'),
        new CellExpression(new Token(TokenType.NUMBER, '4'), undefined),
      ),
    );
  });

  it('C:G', () => {
    const tree = buildTree('C:G');

    expect(tree).toEqual(
      new CellRangeExpression(
        new CellExpression(new Token(TokenType.COLUMN, 'C'), undefined),
        new Token(TokenType.COLON, ':'),
        new CellExpression(new Token(TokenType.COLUMN, 'G'), undefined),
      ),
    );
  });

  it('C:$G', () => {
    const tree = buildTree('C:$G');

    expect(tree).toEqual(
      new CellRangeExpression(
        new CellExpression(new Token(TokenType.COLUMN, 'C'), undefined),
        new Token(TokenType.COLON, ':'),
        new CellExpression(new Token(TokenType.COLUMN, '$G'), undefined),
      ),
    );
  });

  it('C:G5', () => {
    const tree = buildTree('C:G5');

    expect(tree).toEqual(
      new CellRangeExpression(
        new CellExpression(new Token(TokenType.COLUMN, 'C'), undefined),
        new Token(TokenType.COLON, ':'),
        new CellExpression(new Token(TokenType.CELL, 'G5'), undefined),
      ),
    );
  });

  it('5:D5', () => {
    const tree = buildTree('5:D5');

    expect(tree).toEqual(
      new CellRangeExpression(
        new CellExpression(new Token(TokenType.NUMBER, '5'), undefined),
        new Token(TokenType.COLON, ':'),
        new CellExpression(new Token(TokenType.CELL, 'D5'), undefined),
      ),
    );
  });
});
