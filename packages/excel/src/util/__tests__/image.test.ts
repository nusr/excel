import { extractImageType } from '..';

describe('image.test.ts', () => {
  describe('extractImageType', () => {
    test('ok', () => {
      expect(extractImageType('data:image/jpeg;base64,/9j/4AAQSk')).toEqual({
        ext: '.jpeg',
        base64: '/9j/4AAQSk',
        type: 'image/jpeg',
      });
    });
    test('src empty', () => {
      expect(extractImageType('')).toEqual({
        ext: '',
        base64: '',
        type: '',
      });
    });
    test('not found', () => {
      expect(extractImageType('data:image/test;base64,/9j/4AAQSk')).toEqual({
        ext: '',
        base64: '',
        type: '',
      });
    });
  });
});
