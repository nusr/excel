import { get } from '..';

describe('get.test.ts', () => {
  describe('get', () => {
    test('null', () => {
      expect(get(null, 'test')).toBeUndefined();
      expect(get(null, 'test', '')).toEqual('');
    });
    it('should get { c: 1 }', () => {
      expect(get({ a: { b: { c: 1 } } }, 'a.b')).toEqual({ c: 1 });
    });
    it('should get 1', () => {
      expect(get({ a: { b: { c: 1 } } }, 'a.b.c')).toEqual(1);
    });

    it('should get 0', () => {
      expect(get({ a: { b: { c: 1 } } }, 'a.b.c.d', 0)).toEqual(0);
    });

    it("should get '1'", () => {
      expect(
        get(
          { worksheets: { 1: { 2: { value: '1' } } } },
          'worksheets.1.2.value',
        ),
      ).toEqual('1');
    });
  });
});
