import { isGeneral,trimZero } from '..';

describe('util.test.ts', () => {
  describe('isGeneral', () => {
    test('ok', () => {
      expect(isGeneral('test')).toEqual(false)
      expect(isGeneral('General')).toEqual(true)
      expect(isGeneral('General11')).toEqual(true)
      expect(isGeneral('22General11', 2)).toEqual(true)
    })
  })
  describe('trimZero', ()=> {
    test('decimal', ()=> {
      expect(trimZero('0.100')).toEqual('0.1')
    })
    test('exponent', ()=> {
      expect(trimZero('0.100E+1')).toEqual('0.1E+01')
      expect(trimZero('0.1E+001')).toEqual('0.1E+01')
      expect(trimZero('0.1E-001')).toEqual('0.1E-01')
    })
    test('decimal + exponent', ()=> {
      expect(trimZero('1.100E-001')).toEqual('1.1E-01')
    })
  })
})