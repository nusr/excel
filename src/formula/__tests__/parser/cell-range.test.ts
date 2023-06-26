import { buildTree } from './util';
import {
  CellExpression,
  CellRangeExpression,
  TokenExpression,
  LiteralExpression,
} from '../../expression';
import { TokenType } from '../../../types';
import { Token } from '../../token';

describe('cell ranges', function () {
  it('A1', function () {
    const tree = buildTree('A1');

    expect(tree).toEqual(
      new CellExpression(
        new Token(TokenType.IDENTIFIER, 'A1'),
        'relative',
        null,
      ),
    );
  });

  it('A$1', function () {
    const tree = buildTree('A$1');

    expect(tree).toEqual(
      new CellExpression(new Token(TokenType.IDENTIFIER, 'A$1'), 'mixed', null),
    );
  });

  it('$A1', function () {
    const tree = buildTree('$A1');

    expect(tree).toEqual(
      new CellExpression(new Token(TokenType.IDENTIFIER, '$A1'), 'mixed', null),
    );
  });

  it('$a1', function () {
    const tree = buildTree('$a1');

    expect(tree).toEqual(
      new CellExpression(new Token(TokenType.IDENTIFIER, '$A1'), 'mixed', null),
    );
  });

  it('$A$1', function () {
    const tree = buildTree('$A$1');
    expect(tree).toEqual(
      new CellExpression(
        new Token(TokenType.IDENTIFIER, '$A$1'),
        'absolute',
        null,
      ),
    );
  });

  it('A1:A4', function () {
    const tree = buildTree('A1:A4');

    expect(tree).toEqual(
      new CellRangeExpression(
        new CellExpression(
          new Token(TokenType.IDENTIFIER, 'A1'),
          'relative',
          null,
        ),
        new Token(TokenType.COLON, ':'),
        new CellExpression(
          new Token(TokenType.IDENTIFIER, 'A4'),
          'relative',
          null,
        ),
      ),
    );
  });

  it('$A1:A$4', function () {
    const tree = buildTree('$A1:A$4');

    expect(tree).toEqual(
      new CellRangeExpression(
        new CellExpression(
          new Token(TokenType.IDENTIFIER, '$A1'),
          'mixed',
          null,
        ),
        new Token(TokenType.COLON, ':'),
        new CellExpression(
          new Token(TokenType.IDENTIFIER, 'A$4'),
          'mixed',
          null,
        ),
      ),
    );
  });

  it('$A$1:$A$4', function () {
    const tree = buildTree('$A$1:$A$4');

    expect(tree).toEqual(
      new CellRangeExpression(
        new CellExpression(
          new Token(TokenType.IDENTIFIER, '$A$1'),
          'absolute',
          null,
        ),
        new Token(TokenType.COLON, ':'),
        new CellExpression(
          new Token(TokenType.IDENTIFIER, '$A$4'),
          'absolute',
          null,
        ),
      ),
    );
  });

  it('1:4', function () {
    const tree = buildTree('1:4');
    expect(tree).toEqual(
      new CellRangeExpression(
        new LiteralExpression(new Token(TokenType.NUMBER, '1')),
        new Token(TokenType.COLON, ':'),
        new LiteralExpression(new Token(TokenType.NUMBER, '4')),
      ),
    );
  });

  it('$1:4', function () {
    const tree = buildTree('$1:4');

    expect(tree).toEqual(
      new CellRangeExpression(
        new CellExpression(
          new Token(TokenType.IDENTIFIER, '$1'),
          'absolute',
          null,
        ),
        new Token(TokenType.COLON, ':'),
        new LiteralExpression(new Token(TokenType.NUMBER, '4')),
      ),
    );
  });

  it('C:G', function () {
    const tree = buildTree('C:G');

    expect(tree).toEqual(
      new CellRangeExpression(
        new TokenExpression(new Token(TokenType.IDENTIFIER, 'C')),
        new Token(TokenType.COLON, ':'),
        new TokenExpression(new Token(TokenType.IDENTIFIER, 'G')),
      ),
    );
  });

  it('C:$G', function () {
    const tree = buildTree('C:$G');

    expect(tree).toEqual(
      new CellRangeExpression(
        new TokenExpression(new Token(TokenType.IDENTIFIER, 'C')),
        new Token(TokenType.COLON, ':'),
        new CellExpression(
          new Token(TokenType.IDENTIFIER, '$G'),
          'absolute',
          null,
        ),
      ),
    );
  });

  it('C:G5', function () {
    const tree = buildTree('C:G5');

    expect(tree).toEqual(
      new CellRangeExpression(
        new TokenExpression(new Token(TokenType.IDENTIFIER, 'C')),
        new Token(TokenType.COLON, ':'),
        new CellExpression(
          new Token(TokenType.IDENTIFIER, 'G5'),
          'relative',
          null,
        ),
      ),
    );
  });

  it('5:D5', function () {
    const tree = buildTree('5:D5');

    expect(tree).toEqual(
      new CellRangeExpression(
        new LiteralExpression(new Token(TokenType.NUMBER, '5')),
        new Token(TokenType.COLON, ':'),
        new CellExpression(
          new Token(TokenType.IDENTIFIER, 'D5'),
          'relative',
          null,
        ),
      ),
    );
  });

});
