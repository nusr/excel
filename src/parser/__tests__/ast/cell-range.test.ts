import { buildTree } from './helper';
import { CellExpression, CellRangeExpression } from '../../expression';
import { TokenType } from '../../../types';
import { Token } from '../../token';

describe('cell ranges', function () {
  it('A1', function () {
    const tree = buildTree('A1');

    expect(tree).toEqual(
      new CellExpression(new Token(TokenType.RELATIVE_CELL, 'A1')),
    );
  });

  it('A$1', function () {
    const tree = buildTree('A$1');

    expect(tree).toEqual(
      new CellExpression(new Token(TokenType.MIXED_CELL, 'A$1')),
    );
  });

  it('$A1', function () {
    const tree = buildTree('$A1');

    expect(tree).toEqual(
      new CellExpression(new Token(TokenType.MIXED_CELL, '$A1')),
    );
  });

  it('$A$1', function () {
    const tree = buildTree('$A$1');
    expect(tree).toEqual(
      new CellExpression(new Token(TokenType.ABSOLUTE_CELL, '$A$1')),
    );
  });

  it('A1:A4', function () {
    const tree = buildTree('A1:A4');

    expect(tree).toEqual(
      new CellRangeExpression(
        new CellExpression(new Token(TokenType.RELATIVE_CELL, 'A1')),
        new Token(TokenType.COLON, ':'),
        new CellExpression(new Token(TokenType.RELATIVE_CELL, 'A4')),
      ),
    );
  });

  it('$A1:A$4', function () {
    const tree = buildTree('$A1:A$4');

    expect(tree).toEqual(
      new CellRangeExpression(
        new CellExpression(new Token(TokenType.MIXED_CELL, '$A1')),
        new Token(TokenType.COLON, ':'),
        new CellExpression(new Token(TokenType.MIXED_CELL, 'A$4')),
      ),
    );
  });

  it('$A$1:$A$4', function () {
    const tree = buildTree('$A$1:$A$4');

    expect(tree).toEqual(
      new CellRangeExpression(
        new CellExpression(new Token(TokenType.ABSOLUTE_CELL, '$A$1')),
        new Token(TokenType.COLON, ':'),
        new CellExpression(new Token(TokenType.ABSOLUTE_CELL, '$A$4')),
      ),
    );
  });

  it('1:4', function () {
    const tree = buildTree('1:4');
    expect(tree).toEqual(
      new CellRangeExpression(
        new CellExpression(new Token(TokenType.RELATIVE_CELL, '1')),
        new Token(TokenType.COLON, ':'),
        new CellExpression(new Token(TokenType.RELATIVE_CELL, '4')),
      ),
    );
  });

  it('$1:4', function () {
    const tree = buildTree('$1:4');

    expect(tree).toEqual(
      new CellRangeExpression(
        new CellExpression(new Token(TokenType.ABSOLUTE_CELL, '$1')),
        new Token(TokenType.COLON, ':'),
        new CellExpression(new Token(TokenType.RELATIVE_CELL, '4')),
      ),
    );
  });

  it('C:G', function () {
    const tree = buildTree('C:G');

    expect(tree).toEqual(
      new CellRangeExpression(
        new CellExpression(new Token(TokenType.RELATIVE_CELL, 'C')),
        new Token(TokenType.COLON, ':'),
        new CellExpression(new Token(TokenType.RELATIVE_CELL, 'G')),
      ),
    );
  });

  it('C:$G', function () {
    const tree = buildTree('C:$G');

    expect(tree).toEqual(
      new CellRangeExpression(
        new CellExpression(new Token(TokenType.RELATIVE_CELL, 'C')),
        new Token(TokenType.COLON, ':'),
        new CellExpression(new Token(TokenType.ABSOLUTE_CELL, '$G')),
      ),
    );
  });

  it('C:G5', function () {
    const tree = buildTree('C:G5');

    expect(tree).toEqual(
      new CellRangeExpression(
        new CellExpression(new Token(TokenType.RELATIVE_CELL, 'C')),
        new Token(TokenType.COLON, ':'),
        new CellExpression(new Token(TokenType.RELATIVE_CELL, 'G5')),
      ),
    );
  });

  it('5:D5', function () {
    const tree = buildTree('5:D5');

    expect(tree).toEqual(
      new CellRangeExpression(
        new CellExpression(new Token(TokenType.RELATIVE_CELL, '5')),
        new Token(TokenType.COLON, ':'),
        new CellExpression(new Token(TokenType.RELATIVE_CELL, 'D5')),
      ),
    );
  });

  // it('A1:B3,C1:D3', function () {
  // const tree = buildTree('A1:B3,C1:D3');

  // expect(tree).toEqual(
  // new BinaryExpression(
  // new CellRangeExpression(
  // new CellExpression(new Token(TokenType.RELATIVE_CELL, 'A1')),
  // new Token(TokenType.COLON, ':'),
  // new CellExpression(new Token(TokenType.RELATIVE_CELL, 'B3')),
  // ),
  // new Token(TokenType.COMMA, ','),
  // new CellRangeExpression(
  // new CellExpression(new Token(TokenType.RELATIVE_CELL, 'C1')),
  // new Token(TokenType.COLON, ':'),
  // new CellExpression(new Token(TokenType.RELATIVE_CELL, 'D3')),
  // ),
  // ),
  // );
  // });

  // it('A1:B3 B1:D3', function () {
  // const tree = buildTree('A1:B3 B1:D3');
  // expect(tree).toEqual(
  // new BinaryExpression(
  // new CellRangeExpression(
  // new CellExpression(new Token(TokenType.RELATIVE_CELL, 'A1')),
  // new Token(TokenType.COLON, ':'),
  // new CellExpression(new Token(TokenType.RELATIVE_CELL, 'B3')),
  // ),
  // new Token(TokenType.COMMA, ','),
  // new CellRangeExpression(
  // new CellExpression(new Token(TokenType.RELATIVE_CELL, 'C1')),
  // new Token(TokenType.COLON, ':'),
  // new CellExpression(new Token(TokenType.RELATIVE_CELL, 'D3')),
  // ),
  // ),
  // );
  // });
});
