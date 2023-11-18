import { buildTree } from './util';
import { CellRangeExpression, TokenExpression, LiteralExpression } from '../../expression';
import { TokenType } from '../../../types';
import { Token } from '../../token';

describe('cell ranges', () => {
  it('A1', () => {
    const tree = buildTree('A1');

    expect(tree).toEqual(new TokenExpression(new Token(TokenType.IDENTIFIER, 'A1')));
  });

  it('A$1', () => {
    const tree = buildTree('A$1');

    expect(tree).toEqual(new TokenExpression(new Token(TokenType.IDENTIFIER, 'A$1')));
  });

  it('$A1', () => {
    const tree = buildTree('$A1');

    expect(tree).toEqual(new TokenExpression(new Token(TokenType.IDENTIFIER, '$A1')));
  });

  it('$a1', () => {
    const tree = buildTree('$a1');

    expect(tree).toEqual(new TokenExpression(new Token(TokenType.IDENTIFIER, '$a1')));
  });

  it('$A$1', () => {
    const tree = buildTree('$A$1');
    expect(tree).toEqual(new TokenExpression(new Token(TokenType.IDENTIFIER, '$A$1')));
  });

  it('A1:A4', () => {
    const tree = buildTree('A1:A4');

    expect(tree).toEqual(
      new CellRangeExpression(
        new TokenExpression(new Token(TokenType.IDENTIFIER, 'A1')),
        new Token(TokenType.COLON, ':'),
        new TokenExpression(new Token(TokenType.IDENTIFIER, 'A4')),
      ),
    );
  });

  it('$A1:A$4', () => {
    const tree = buildTree('$A1:A$4');

    expect(tree).toEqual(
      new CellRangeExpression(
        new TokenExpression(new Token(TokenType.IDENTIFIER, '$A1')),
        new Token(TokenType.COLON, ':'),
        new TokenExpression(new Token(TokenType.IDENTIFIER, 'A$4')),
      ),
    );
  });

  it('$A$1:$A$4', () => {
    const tree = buildTree('$A$1:$A$4');

    expect(tree).toEqual(
      new CellRangeExpression(
        new TokenExpression(new Token(TokenType.IDENTIFIER, '$A$1')),
        new Token(TokenType.COLON, ':'),
        new TokenExpression(new Token(TokenType.IDENTIFIER, '$A$4')),
      ),
    );
  });

  it('1:4', () => {
    const tree = buildTree('1:4');
    expect(tree).toEqual(
      new CellRangeExpression(
        new LiteralExpression(new Token(TokenType.NUMBER, '1')),
        new Token(TokenType.COLON, ':'),
        new LiteralExpression(new Token(TokenType.NUMBER, '4')),
      ),
    );
  });

  it('$1:4', () => {
    const tree = buildTree('$1:4');

    expect(tree).toEqual(
      new CellRangeExpression(
        new TokenExpression(new Token(TokenType.IDENTIFIER, '$1')),
        new Token(TokenType.COLON, ':'),
        new LiteralExpression(new Token(TokenType.NUMBER, '4')),
      ),
    );
  });

  it('C:G', () => {
    const tree = buildTree('C:G');

    expect(tree).toEqual(
      new CellRangeExpression(
        new TokenExpression(new Token(TokenType.IDENTIFIER, 'C')),
        new Token(TokenType.COLON, ':'),
        new TokenExpression(new Token(TokenType.IDENTIFIER, 'G')),
      ),
    );
  });

  it('C:$G', () => {
    const tree = buildTree('C:$G');

    expect(tree).toEqual(
      new CellRangeExpression(
        new TokenExpression(new Token(TokenType.IDENTIFIER, 'C')),
        new Token(TokenType.COLON, ':'),
        new TokenExpression(new Token(TokenType.IDENTIFIER, '$G')),
      ),
    );
  });

  it('C:G5', () => {
    const tree = buildTree('C:G5');

    expect(tree).toEqual(
      new CellRangeExpression(
        new TokenExpression(new Token(TokenType.IDENTIFIER, 'C')),
        new Token(TokenType.COLON, ':'),
        new TokenExpression(new Token(TokenType.IDENTIFIER, 'G5')),
      ),
    );
  });

  it('5:D5', () => {
    const tree = buildTree('5:D5');

    expect(tree).toEqual(
      new CellRangeExpression(
        new LiteralExpression(new Token(TokenType.NUMBER, '5')),
        new Token(TokenType.COLON, ':'),
        new TokenExpression(new Token(TokenType.IDENTIFIER, 'D5')),
      ),
    );
  });
});
