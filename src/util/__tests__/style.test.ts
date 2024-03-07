import { makeFont, convertToCssString } from '../style';
import { EUnderLine } from '@/types';

describe('style.test.ts', () => {
  describe('makeFont', () => {
    it('should get normal normal 12px sans-serif', () => {
      expect(makeFont()).toEqual('normal normal 12px sans-serif');
    });
    it('should get normal normal 12px simsun,sans-serif', () => {
      expect(makeFont('italic', 'bold', 14, 'simsun')).toEqual(
        'italic bold 14px simsun,sans-serif',
      );
    });
  });
  describe('convertToCssString', () => {
    it('normal', () => {
      const result: string[] = [
        'color:red',
        'background-color:white',
        'font-size:20pt',
        'font-family:serif',
        'font-style:italic',
        'font-weight:700',
        'white-space:normal',
        'text-decoration-line:underline line-through',
        'text-decoration-style: double',
      ];
      expect(
        convertToCssString({
          fontColor: 'red',
          fillColor: 'white',
          fontFamily: 'serif',
          fontSize: 20,
          isItalic: true,
          isWrapText: true,
          isBold: true,
          underline: EUnderLine.DOUBLE,
          isStrike: true,
          numberFormat: 1,
        }),
      ).toEqual(result.join(';') + ';');
    });
  });
});
