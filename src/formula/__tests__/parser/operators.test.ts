import { buildTree } from './util';
import {
  BinaryExpression,
  GroupExpression,
  LiteralExpression,
  PostUnaryExpression,
} from '../../expression';
import { Token } from '../../token';
import { TokenType } from '../../../types';

describe('operators', () => {
  describe('precedence', () => {
    it('1 + 2 >= 3 - 4', () => {
      const tree = buildTree('1 + 2 >= 3 - 4');
      expect(tree).toEqual(
        new BinaryExpression(
          new BinaryExpression(
            new LiteralExpression(new Token(TokenType.INTEGER, '1')),
            new Token(TokenType.PLUS, '+'),
            new LiteralExpression(new Token(TokenType.INTEGER, '2')),
          ),
          new Token(TokenType.GREATER_EQUAL, '>='),
          new BinaryExpression(
            new LiteralExpression(new Token(TokenType.INTEGER, '3')),
            new Token(TokenType.MINUS, '-'),
            new LiteralExpression(new Token(TokenType.INTEGER, '4')),
          ),
        ),
      );
    });

    it('1 + 2 & "a"', () => {
      const tree = buildTree('1 + 2 & "a"');
      expect(tree).toEqual(
        new BinaryExpression(
          new BinaryExpression(
            new LiteralExpression(new Token(TokenType.INTEGER, '1')),
            new Token(TokenType.PLUS, '+'),
            new LiteralExpression(new Token(TokenType.INTEGER, '2')),
          ),
          new Token(TokenType.CONCATENATE, '&'),
          new LiteralExpression(new Token(TokenType.STRING, 'a')),
        ),
      );
    });

    it('1 + 2 * 3', () => {
      const tree = buildTree('1 + 2 * 3');
      expect(tree).toEqual(
        new BinaryExpression(
          new LiteralExpression(new Token(TokenType.INTEGER, '1')),
          new Token(TokenType.PLUS, '+'),
          new BinaryExpression(
            new LiteralExpression(new Token(TokenType.INTEGER, '2')),
            new Token(TokenType.STAR, '*'),
            new LiteralExpression(new Token(TokenType.INTEGER, '3')),
          ),
        ),
      );
    });

    it('1 * 2 ^ 3', () => {
      const tree = buildTree('1 * 2 ^ 3');

      expect(tree).toEqual(
        new BinaryExpression(
          new LiteralExpression(new Token(TokenType.INTEGER, '1')),
          new Token(TokenType.STAR, '*'),
          new BinaryExpression(
            new LiteralExpression(new Token(TokenType.INTEGER, '2')),
            new Token(TokenType.EXPONENT, '^'),
            new LiteralExpression(new Token(TokenType.INTEGER, '3')),
          ),
        ),
      );
    });

    it('(1 * 2) ^ 3', () => {
      const tree = buildTree('(1 * 2) ^ 3');
      expect(tree).toEqual(
        new BinaryExpression(
          new GroupExpression(
            new BinaryExpression(
              new LiteralExpression(new Token(TokenType.INTEGER, '1')),
              new Token(TokenType.STAR, '*'),
              new LiteralExpression(new Token(TokenType.INTEGER, '2')),
            ),
          ),
          new Token(TokenType.EXPONENT, '^'),
          new LiteralExpression(new Token(TokenType.INTEGER, '3')),
        ),
      );
    });
  });
  describe('associativity', () => {
    it('1 + 2 + 3', () => {
      const tree = buildTree('1 + 2 + 3');
      expect(tree).toEqual(
        new BinaryExpression(
          new BinaryExpression(
            new LiteralExpression(new Token(TokenType.INTEGER, '1')),
            new Token(TokenType.PLUS, '+'),
            new LiteralExpression(new Token(TokenType.INTEGER, '2')),
          ),
          new Token(TokenType.PLUS, '+'),
          new LiteralExpression(new Token(TokenType.INTEGER, '3')),
        ),
      );
    });

    it('1 + (2 + 3)', () => {
      const tree = buildTree('1 + (2 + 3)');
      expect(tree).toEqual(
        new BinaryExpression(
          new LiteralExpression(new Token(TokenType.INTEGER, '1')),
          new Token(TokenType.PLUS, '+'),
          new GroupExpression(
            new BinaryExpression(
              new LiteralExpression(new Token(TokenType.INTEGER, '2')),
              new Token(TokenType.PLUS, '+'),
              new LiteralExpression(new Token(TokenType.INTEGER, '3')),
            ),
          ),
        ),
      );
    });

    it('1 / 2 / 3', () => {
      const tree = buildTree('1 / 2 / 3');
      expect(tree).toEqual(
        new BinaryExpression(
          new BinaryExpression(
            new LiteralExpression(new Token(TokenType.INTEGER, '1')),
            new Token(TokenType.SLASH, '/'),
            new LiteralExpression(new Token(TokenType.INTEGER, '2')),
          ),
          new Token(TokenType.SLASH, '/'),
          new LiteralExpression(new Token(TokenType.INTEGER, '3')),
        ),
      );
    });
    it('2%', () => {
      const tree = buildTree('2%');
      expect(tree).toEqual(
        new PostUnaryExpression(
          new Token(TokenType.PERCENT, '%'),
          new LiteralExpression(new Token(TokenType.INTEGER, '2')),
        ),
      );
    });
  });
});
