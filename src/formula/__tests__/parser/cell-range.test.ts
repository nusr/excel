import { buildTree } from './util';
import {
  CellRangeExpression,
  CellExpression,
  TokenExpression,
} from '../../expression';
import { TokenType } from '../../../types';
import { Token } from '../../token';

describe('cell ranges', () => {
  it('A1', () => {
    const tree = buildTree('A1');

    expect(tree).toEqual(
      new TokenExpression(new Token(TokenType.IDENTIFIER, 'A1')),
    );
  });

  it('A$1', () => {
    const tree = buildTree('A$1');

    expect(tree).toEqual(
      new CellExpression(
        new Token(TokenType.MIXED_CELL, 'A$1'),
        'mixed',
        undefined,
      ),
    );
  });

  it('$A1', () => {
    const tree = buildTree('$A1');

    expect(tree).toEqual(
      new CellExpression(
        new Token(TokenType.MIXED_CELL, '$A1'),
        'mixed',
        undefined,
      ),
    );
  });

  it('$a1', () => {
    const tree = buildTree('$a1');

    expect(tree).toEqual(
      new CellExpression(
        new Token(TokenType.MIXED_CELL, '$a1'),
        'mixed',
        undefined,
      ),
    );
  });

  it('$A$1', () => {
    const tree = buildTree('$A$1');
    expect(tree).toEqual(
      new CellExpression(
        new Token(TokenType.ABSOLUTE_CELL, '$A$1'),
        'absolute',
        undefined,
      ),
    );
  });

  it('A1:A4', () => {
    const tree = buildTree('A1:A4');

    expect(tree).toEqual(
      new CellRangeExpression(
        new CellExpression(
          new Token(TokenType.IDENTIFIER, 'A1'),
          'relative',
          undefined,
        ),
        new Token(TokenType.COLON, ':'),
        new CellExpression(
          new Token(TokenType.IDENTIFIER, 'A4'),
          'relative',
          undefined,
        ),
      ),
    );
  });

  it('$A1:A$4', () => {
    const tree = buildTree('$A1:A$4');

    expect(tree).toEqual(
      new CellRangeExpression(
        new CellExpression(
          new Token(TokenType.MIXED_CELL, '$A1'),
          'mixed',
          undefined,
        ),
        new Token(TokenType.COLON, ':'),
        new CellExpression(
          new Token(TokenType.MIXED_CELL, 'A$4'),
          'mixed',
          undefined,
        ),
      ),
    );
  });

  it('$A$1:$A$4', () => {
    const tree = buildTree('$A$1:$A$4');

    expect(tree).toEqual(
      new CellRangeExpression(
        new CellExpression(
          new Token(TokenType.ABSOLUTE_CELL, '$A$1'),
          'absolute',
          undefined,
        ),
        new Token(TokenType.COLON, ':'),
        new CellExpression(
          new Token(TokenType.ABSOLUTE_CELL, '$A$4'),
          'absolute',
          undefined,
        ),
      ),
    );
  });

  it('1:4', () => {
    const tree = buildTree('1:4');
    expect(tree).toEqual(
      new CellRangeExpression(
        new CellExpression(
          new Token(TokenType.INTEGER, '1'),
          'relative',
          undefined,
        ),
        new Token(TokenType.COLON, ':'),
        new CellExpression(
          new Token(TokenType.INTEGER, '4'),
          'relative',
          undefined,
        ),
      ),
    );
  });

  it('$1:4', () => {
    const tree = buildTree('$1:4');

    expect(tree).toEqual(
      new CellRangeExpression(
        new CellExpression(
          new Token(TokenType.ABSOLUTE_CELL, '$1'),
          'absolute',
          undefined,
        ),
        new Token(TokenType.COLON, ':'),
        new CellExpression(
          new Token(TokenType.INTEGER, '4'),
          'relative',
          undefined,
        ),
      ),
    );
  });

  it('C:G', () => {
    const tree = buildTree('C:G');

    expect(tree).toEqual(
      new CellRangeExpression(
        new CellExpression(
          new Token(TokenType.IDENTIFIER, 'C'),
          'relative',
          undefined,
        ),
        new Token(TokenType.COLON, ':'),
        new CellExpression(
          new Token(TokenType.IDENTIFIER, 'G'),
          'relative',
          undefined,
        ),
      ),
    );
  });

  it('C:$G', () => {
    const tree = buildTree('C:$G');

    expect(tree).toEqual(
      new CellRangeExpression(
        new CellExpression(
          new Token(TokenType.IDENTIFIER, 'C'),
          'relative',
          undefined,
        ),
        new Token(TokenType.COLON, ':'),
        new CellExpression(
          new Token(TokenType.ABSOLUTE_CELL, '$G'),
          'absolute',
          undefined,
        ),
      ),
    );
  });

  it('C:G5', () => {
    const tree = buildTree('C:G5');

    expect(tree).toEqual(
      new CellRangeExpression(
        new CellExpression(
          new Token(TokenType.IDENTIFIER, 'C'),
          'relative',
          undefined,
        ),
        new Token(TokenType.COLON, ':'),
        new CellExpression(
          new Token(TokenType.IDENTIFIER, 'G5'),
          'relative',
          undefined,
        ),
      ),
    );
  });

  it('5:D5', () => {
    const tree = buildTree('5:D5');

    expect(tree).toEqual(
      new CellRangeExpression(
        new CellExpression(
          new Token(TokenType.INTEGER, '5'),
          'relative',
          undefined,
        ),
        new Token(TokenType.COLON, ':'),
        new CellExpression(
          new Token(TokenType.IDENTIFIER, 'D5'),
          'relative',
          undefined,
        ),
      ),
    );
  });
});
