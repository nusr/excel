import { expectResult } from './util';
import { XLSX_MAX_COL_COUNT, XLSX_MAX_ROW_COUNT } from '@/util';

describe('error.test.ts', () => {
  describe('R1C1', () => {
    it('row overflow', () => {
      expectResult(`=R${XLSX_MAX_ROW_COUNT + 10}C`, '#NAME?');
    });
    it('col overflow', () => {
      expectResult(`=RC${XLSX_MAX_COL_COUNT + 10}`, '#NAME?');
    });
    it('all overflow', () => {
      expectResult(
        `=R${XLSX_MAX_ROW_COUNT + 10}C${XLSX_MAX_COL_COUNT + 10}`,
        '#NAME?',
      );
    });
  });
  describe('A1', () => {
    it('col overflow', () => {
      expectResult(`=XFF1`, '#NAME?');
    });
    it('row overflow', () => {
      expectResult(`=A${XLSX_MAX_ROW_COUNT + 10}`, '#NAME?');
    });
    it('all overflow', () => {
      expectResult(`=XFF${XLSX_MAX_ROW_COUNT + 10}`, '#NAME?');
    });
  });
});
