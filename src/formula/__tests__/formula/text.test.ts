import {
  T,
  LOWER,
  CHAR,
  CODE,
  LEN,
  SPLIT,
  UPPER,
  TRIM,
  CONCAT,
  TEXT,
} from '../../formula/text';
import { MAX_PARAMS_COUNT } from '../../../util';

describe('text.test.ts', () => {
  describe('T', () => {
    test('ok', () => {
      expect(T('test')).toEqual('test');
      expect(T(11)).toEqual('');
    });
    test('error', () => {
      expect(() => T('test', '11')).toThrow();
    });
  });
  describe('LOWER', () => {
    test('ok', () => {
      expect(LOWER('AB')).toEqual('ab');
      expect(LOWER('ab')).toEqual('ab');
    });
    test('error', () => {
      expect(() => LOWER(1)).toThrow();
      expect(() => LOWER('AB', 'ab')).toThrow();
      expect(() => LOWER('AB', 'ab', 'CC')).toThrow();
    });
  });

  describe('UPPER', () => {
    test('ok', () => {
      expect(UPPER('ab')).toEqual('AB');
      expect(UPPER('AB')).toEqual('AB');
    });
    test('error', () => {
      expect(() => UPPER(1)).toThrow();
      expect(() => UPPER('AB', 'ab')).toThrow();
      expect(() => UPPER('AB', 'ab', 'CC')).toThrow();
    });
  });

  describe('CHAR', () => {
    test('ok', () => {
      expect(CHAR(97)).toEqual('a');
      expect(CHAR('97')).toEqual('a');
    });
    test('error', () => {
      expect(() => CHAR('aa')).toThrow();
      expect(() => CHAR(1, 2)).toThrow();
    });
  });
  describe('CODE', () => {
    test('ok', () => {
      expect(CODE('a')).toEqual(97);
    });
    test('error', () => {
      expect(() => CODE(1)).toThrow();
      expect(() => CODE('a', 'b')).toThrow();
    });
  });

  describe('LEN', () => {
    test('ok', () => {
      expect(LEN('abc')).toEqual(3);
    });
    test('error', () => {
      expect(() => LEN(1)).toThrow();
      expect(() => LEN('a', 'b')).toThrow();
    });
  });

  describe('SPLIT', () => {
    test('ok', () => {
      expect(SPLIT('a b c', ' ')).toEqual(['a', 'b', 'c']);
    });
    test('error', () => {
      expect(() => SPLIT('a')).toThrow();
      expect(() => SPLIT(1, 2)).toThrow();
      expect(() => SPLIT('a', 'c', 'b')).toThrow();
    });
  });

  describe('TEXT', () => {
    test('ok', () => {
      expect(TEXT('=SUM(1,2)', '@')).toEqual('=SUM(1,2)');
      expect(TEXT(0.285, "0.0%")).toEqual('28.5%');
    });
    test('error', () => {
      expect(() => TEXT('a')).toThrow();
      expect(() => TEXT(1, 2)).toThrow();
      expect(() => TEXT("test", 2)).toThrow();
      expect(() => TEXT('a', 'c', 'b')).toThrow();
    });
  });

  describe('TRIM', () => {
    test('ok', () => {
      expect(TRIM(' abc ')).toEqual('abc');
    });
    test('error', () => {
      expect(() => TRIM('a', 'b')).toThrow();
      expect(() => TRIM(1)).toThrow();
    });
  });

  describe('CONCAT', () => {
    test('ok', () => {
      expect(CONCAT('ab', 1, true)).toEqual('ab1true');
      expect(CONCAT()).toEqual('');
    });
    test('error', () => {
      const list = Array.from<number>({ length: MAX_PARAMS_COUNT + 3 }).fill(3);
      expect(() => CONCAT(...list)).toThrow();
    });
  });
});
