import { isGeneral } from '..';

describe('util.test.ts', () => {
  describe('isGeneral', () => {
    test('ok', () => {
      expect(isGeneral('test')).toEqual(false)
      expect(isGeneral('General')).toEqual(true)
      expect(isGeneral('General11')).toEqual(true)
      expect(isGeneral('22General11', 2)).toEqual(true)
    })
  })
})