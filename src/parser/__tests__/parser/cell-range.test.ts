import { buildTree } from './util';
import { CellExpression, CellRangeExpression } from '../../expression';
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
        new CellExpression(
          new Token(TokenType.IDENTIFIER, '1'),
          'relative',
          null,
        ),
        new Token(TokenType.COLON, ':'),
        new CellExpression(
          new Token(TokenType.IDENTIFIER, '4'),
          'relative',
          null,
        ),
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
        new CellExpression(
          new Token(TokenType.IDENTIFIER, '4'),
          'relative',
          null,
        ),
      ),
    );
  });

  it('C:G', function () {
    const tree = buildTree('C:G');

    expect(tree).toEqual(
      new CellRangeExpression(
        new CellExpression(
          new Token(TokenType.IDENTIFIER, 'C'),
          'relative',
          null,
        ),
        new Token(TokenType.COLON, ':'),
        new CellExpression(
          new Token(TokenType.IDENTIFIER, 'G'),
          'relative',
          null,
        ),
      ),
    );
  });

  it('C:$G', function () {
    const tree = buildTree('C:$G');

    expect(tree).toEqual(
      new CellRangeExpression(
        new CellExpression(
          new Token(TokenType.IDENTIFIER, 'C'),
          'relative',
          null,
        ),
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
        new CellExpression(
          new Token(TokenType.IDENTIFIER, 'C'),
          'relative',
          null,
        ),
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
        new CellExpression(
          new Token(TokenType.IDENTIFIER, '5'),
          'relative',
          null,
        ),
        new Token(TokenType.COLON, ':'),
        new CellExpression(
          new Token(TokenType.IDENTIFIER, 'D5'),
          'relative',
          null,
        ),
      ),
    );
  });

  // it('A1:B3,C1:D3', function () {
    // const tree = buildTree('A1:B3,C1:D3');

    // expect(tree).toEqual(
      // new CellRangeExpression(
        // new CellRangeExpression(
          // new CellExpression(
            // new Token(TokenType.IDENTIFIER, 'A1'),
            // 'relative',
            // null,
          // ),
          // new Token(TokenType.COLON, ':'),
          // new CellExpression(
            // new Token(TokenType.IDENTIFIER, 'B3'),
            // 'relative',
            // null,
          // ),
        // ),
        // new Token(TokenType.COMMA, ','),
        // new CellRangeExpression(
          // new CellExpression(
            // new Token(TokenType.IDENTIFIER, 'C1'),
            // 'relative',
            // null,
          // ),
          // new Token(TokenType.COLON, ':'),
          // new CellExpression(
            // new Token(TokenType.IDENTIFIER, 'D3'),
            // 'relative',
            // null,
          // ),
        // ),
      // ),
    // );
  // });

  // it('A1:B3 B1:D3', function () {
  // const tree = buildTree('A1:B3 B1:D3');
  // expect(tree).toEqual(
  // new BinaryExpression(
  // new CellRangeExpression(
  // new CellExpression(new Token(TokenType.IDENTIFIER, 'A1')),
  // new Token(TokenType.COLON, ':'),
  // new CellExpression(new Token(TokenType.IDENTIFIER, 'B3')),
  // ),
  // new Token(TokenType.COMMA, ','),
  // new CellRangeExpression(
  // new CellExpression(new Token(TokenType.IDENTIFIER, 'C1')),
  // new Token(TokenType.COLON, ':'),
  // new CellExpression(new Token(TokenType.IDENTIFIER, 'D3')),
  // ),
  // ),
  // );
  // });
});
