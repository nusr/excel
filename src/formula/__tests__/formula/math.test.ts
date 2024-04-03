import { ABS, ACOS, SUM, SIN } from '../../formula/math';

describe('math.test.ts', () => {
  test('ABS', () => {
    expect(ABS(-1)).toEqual(1);
  });
  test('ACOS', () => {
    expect(ACOS(1)).toEqual(0);
  });
  test('SUM', () => {
    expect(SUM(1, 2, 'a')).toEqual(3);
  });
  test('SIN', () => {
    expect(SIN(Math.PI / 2)).toEqual(1);
  });
});
