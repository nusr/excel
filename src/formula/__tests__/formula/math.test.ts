import {
  ABS,
  ACOS,
  ACOSH,
  ACOT,
  ACOTH,
  ASIN,
  AVERAGE,
  SUM,
  SIN,
  PI,
  EXP,
  DEGREES,
  DECIMAL,
  COS,
  COT,
  CSC,
  INT,
  LN10,
  LN2,
  LOG10E,
  LOG2E,
  LOG,
  LOG10,
  ASINH,
  ATAN,
  ATAN2,
  ATANH,
} from '../../formula/math';
import { MAX_PARAMS_COUNT } from '@/util';
import { roundNumber } from '../../formula/float';

function equal(result: number, expected: number) {
  expect(roundNumber(result)).toEqual(expected);
}

describe('math.test.ts', () => {
  describe('ABS', () => {
    test('ok', () => {
      expect(ABS(-1)).toEqual(1);
      expect(ABS(1)).toEqual(1);
    });
    test('error', () => {
      expect(() => ABS('test')).toThrow();
      expect(() => ABS(1, 2)).toThrow();
    });
  });
  describe('ACOS', () => {
    test('ok', () => {
      expect(ACOS(1)).toEqual(0);
    });
    test('error', () => {
      expect(() => ACOS('test')).toThrow();
      expect(() => ACOS(1, 2)).toThrow();
    });
  });
  describe('ACOSH', () => {
    test('ok', () => {
      expect(ACOSH(1)).toEqual(0);
    });
    test('error', () => {
      expect(() => ACOSH('test')).toThrow();
      expect(() => ACOSH(1, 2)).toThrow();
    });
  });
  describe('ACOT', () => {
    test('ok', () => {
      expect(ACOT(Infinity)).toEqual(0);
    });
    test('error', () => {
      expect(() => ACOT('test')).toThrow();
      expect(() => ACOT(1, 2)).toThrow();
    });
  });
  describe('ACOTH', () => {
    test('ok', () => {
      expect(ACOTH((Math.E + 1) / (Math.E - 1))).toEqual(0.5);
    });
    test('error', () => {
      expect(() => ACOTH('test')).toThrow();
      expect(() => ACOTH(1, 2)).toThrow();
    });
  });
  describe('ASIN', () => {
    test('ok', () => {
      expect(ASIN(0)).toEqual(0);
    });
    test('error', () => {
      expect(() => ASIN('test')).toThrow();
      expect(() => ASIN(1, 2)).toThrow();
    });
  });
  describe('ASINH', () => {
    test('ok', () => {
      expect(ASINH(0)).toEqual(0);
    });
    test('error', () => {
      expect(() => ASINH('test')).toThrow();
      expect(() => ASINH(1, 2)).toThrow();
    });
  });
  describe('ATAN', () => {
    test('ok', () => {
      expect(ATAN(0)).toEqual(0);
    });
    test('error', () => {
      expect(() => ATAN('test')).toThrow();
      expect(() => ATAN(1, 2)).toThrow();
    });
  });
  describe('ATAN2', () => {
    test('ok', () => {
      expect(ATAN2(0, 1)).toEqual(0);
    });
    test('error', () => {
      expect(() => ATAN2('test')).toThrow();
      expect(() => ATAN2('test', '2')).toThrow();
      expect(() => ATAN2(1, 2, 2)).toThrow();
    });
  });
  describe('ATANH', () => {
    test('ok', () => {
      expect(ATANH(0)).toEqual(0);
    });
    test('error', () => {
      expect(() => ATANH('test')).toThrow();
      expect(() => ATANH(1, 2)).toThrow();
    });
  });
  describe('AVERAGE', () => {
    test('ok', () => {
      expect(AVERAGE(1, 'a', '11')).toEqual(6);
    });
    test('error', () => {
      const list = Array.from<number>({ length: MAX_PARAMS_COUNT + 3 }).fill(3);
      expect(() => AVERAGE(...list)).toThrow();
    });
  });
  describe('COS', () => {
    test('ok', () => {
      expect(COS(0)).toEqual(1);
    });
    test('error', () => {
      expect(() => COS(1, 2)).toThrow();
      expect(() => COS('test', 'te')).toThrow();
      expect(() => COS('test')).toThrow();
    });
  });
  describe('COT', () => {
    test('ok', () => {
      equal(COT(Math.PI / 4), 1);
    });
    test('error', () => {
      expect(() => COT(1, 2)).toThrow();
      expect(() => COT('test', 'te')).toThrow();
      expect(() => COT('test')).toThrow();
    });
  });
  describe('CSC', () => {
    test('ok', () => {
      expect(CSC(Math.PI / 2)).toEqual(1);
    });
    test('error', () => {
      expect(() => CSC(1, 2)).toThrow();
      expect(() => CSC('test', 'te')).toThrow();
      expect(() => CSC('test')).toThrow();
    });
  });
  describe('DECIMAL', () => {
    test('normal', () => {
      expect(DECIMAL('11', 10)).toEqual(11);
    });
    test('error', () => {
      expect(() => DECIMAL(1, 2)).toThrow();
      expect(() => DECIMAL(1)).toThrow();
      expect(() => DECIMAL('test')).toThrow();
    });
  });
  describe('DEGREES', () => {
    test('normal', () => {
      expect(DEGREES(Math.PI)).toEqual(180);
    });
    test('error', () => {
      expect(() => DEGREES(1, 2)).toThrow();
      expect(() => DEGREES('test')).toThrow();
    });
  });
  describe('EXP', () => {
    test('normal', () => {
      expect(EXP(0)).toEqual(1);
    });
    test('error', () => {
      expect(() => EXP(1, 2)).toThrow();
      expect(() => EXP('test')).toThrow();
    });
  });
  describe('INT', () => {
    test('normal', () => {
      expect(INT(1.2)).toEqual(1);
    });
    test('error', () => {
      expect(() => INT(1, 2)).toThrow();
      expect(() => INT('test')).toThrow();
    });
  });

  describe('LN10', () => {
    test('normal', () => {
      expect(LN10()).toEqual(Math.log(10));
    });
    test('error', () => {
      expect(() => LN10(1)).toThrow();
      expect(() => LN10('test')).toThrow();
    });
  });
  describe('LN2', () => {
    test('normal', () => {
      expect(LN2()).toEqual(Math.log(2));
    });
    test('error', () => {
      expect(() => LN2(1)).toThrow();
      expect(() => LN2('test')).toThrow();
    });
  });

  describe('LOG2E', () => {
    test('normal', () => {
      expect(LOG2E()).toEqual(Math.LOG2E);
    });
    test('error', () => {
      expect(() => LOG2E(1)).toThrow();
      expect(() => LOG2E('test')).toThrow();
    });
  });

  describe('LOG10E', () => {
    test('normal', () => {
      expect(LOG10E()).toEqual(Math.LOG10E);
    });
    test('error', () => {
      expect(() => LOG10E(1)).toThrow();
      expect(() => LOG10E('test')).toThrow();
    });
  });

  describe('LOG', () => {
    test('normal', () => {
      expect(LOG(10, 10)).toEqual(1);
      expect(LOG(10)).toEqual(1);
    });
    test('error', () => {
      expect(() => LOG('test', 'test')).toThrow();
      expect(() => LOG('test', 1)).toThrow();
      expect(() => LOG(1, 2, 3)).toThrow();
    });
  });

  describe('LOG10', () => {
    test('normal', () => {
      expect(LOG10(10)).toEqual(1);
    });
    test('error', () => {
      expect(() => LOG10('test', 'test')).toThrow();
      expect(() => LOG10('test', 1)).toThrow();
      expect(() => LOG10(1, 2)).toThrow();
    });
  });

  describe('SUM', () => {
    test('ok', () => {
      expect(SUM(1, 'a', '11', true)).toEqual(13);
    });
    test('special', () => {
      equal(SUM(0.1, 0.2), 0.3);
    });
    test('error', () => {
      const list = Array.from<number>({ length: MAX_PARAMS_COUNT + 3 }).fill(3);
      expect(() => SUM(...list)).toThrow();
    });
  });
  describe('SIN', () => {
    test('ok', () => {
      expect(SIN(Math.PI / 2)).toEqual(1);
    });
    test('error', () => {
      expect(() => SIN(1, 2)).toThrow();
      expect(() => SIN('test')).toThrow();
    });
  });
  describe('PI', () => {
    test('normal', () => {
      expect(PI()).toEqual(Math.PI);
    });
    test('error', () => {
      expect(() => PI(1, 2)).toThrow();
      expect(() => PI(1)).toThrow();
    });
  });
  describe('roundNumber', () => {
    test('normal', () => {
      expect(roundNumber(1)).toEqual(1);
      expect(roundNumber(0.111111111)).toEqual(0.111111111);
      expect(roundNumber(100.111111111)).toEqual(100.111111111);
    });
    test('round', () => {
      expect(roundNumber(1.000000000000001)).toEqual(1);
      expect(roundNumber(0.1111111111)).toEqual(0.111111111);
      expect(roundNumber(100.1111111111)).toEqual(100.111111111);
    });
  });
});
