import { buildTree } from './util';
import { Parser } from '../../parser';
import { Token } from '../../token';
import { TokenType } from '@/types';

describe('invalid expressions', () => {
  describe('error', () => {
    test('error type', () => {
      expect(() => {
        new Parser([new Token(TokenType.IDENTIFIER, '#VALUE!')]).parse();
      }).toThrow();
    });
    test('cell range', () => {
      expect(() => {
        new Parser([
          new Token(TokenType.STRING, 'test'),
          new Token(TokenType.COLON, ':'),
          new Token(TokenType.STRING, 'aa'),
        ]).parse();
      }).toThrow();
    });
  });
  it('#VALUE!', () => {
    expect(() => {
      buildTree('#VALUE!');
    }).toThrow();
  });

  it('SUM(', () => {
    expect(() => {
      buildTree('SUM(');
    }).toThrow();
  });
  it('+', () => {
    expect(() => {
      buildTree('+');
    }).toThrow();
  });
  it('SUM(,,', () => {
    expect(() => {
      buildTree('SUM(,,');
    }).toThrow();
  });
  it('>', () => {
    expect(() => {
      buildTree('>');
    }).toThrow();
  });
  it('a >', () => {
    expect(() => {
      buildTree('a >');
    }).toThrow();
  });
  it('> b', () => {
    expect(() => {
      buildTree('> b');
    }).toThrow();
  });
  test('(1}', () => {
    expect(() => {
      new Parser([
        new Token(TokenType.LEFT_BRACKET, '('),
        new Token(TokenType.INTEGER, '1'),
        new Token(TokenType.RIGHT_BRACE, '}'),
      ]).parse();
    }).toThrow();
  });
});
