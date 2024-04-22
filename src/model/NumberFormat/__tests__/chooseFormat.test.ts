import { chooseFormat } from '../chooseFormat';

describe('chooseFormat.test.ts', () => {
  describe('chooseFormat', () => {
    test('ok', () => {
      expect(chooseFormat('m/d/yy', 'test')).toEqual([4, '@'])
    })
  })
})