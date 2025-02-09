import { getEditorStyle } from '../FormulaBar/FormulaEditor';
import type { CSSProperties } from 'react';
import {
  EditorStatus,
  EUnderLine,
  EHorizontalAlign,
  EVerticalAlign,
} from '../../types';
describe('getEditorStyle', () => {
  test('EditorStatus NONE', () => {
    expect(
      getEditorStyle(
        {
          value: '',
          displayValue: '',
          row: 0,
          col: 0,
          left: 0,
          top: 0,
          width: 0,
          height: 0,
          defineName: '',
          rowCount: 1,
          colCount: 1,
        },
        EditorStatus.NONE,
        {
          isBold: false,
          isItalic: false,
          isStrike: false,
          fontColor: '',
          fontSize: 12,
          fontFamily: '',
          fillColor: '',
          isWrapText: false,
          underline: EUnderLine.NONE,
          verticalAlign: EVerticalAlign.TOP,
          horizontalAlign: EHorizontalAlign.LEFT,
          numberFormat: '',
          isMergeCell: false,
          mergeType: '',
        },
      ),
    ).toBeUndefined();
  });
  test('EDIT_FORMULA_BAR', () => {
    const result: CSSProperties = {
      fontStyle: 'italic',
      fontWeight: 'bold',
      fontFamily: 'serif',
      // fontSize: 12,
      // backgroundColor: 'red',
      // color: 'green',
      textDecorationLine: 'line-through',
    };
    expect(
      getEditorStyle(
        {
          value: '',
          displayValue: '',
          row: 0,
          col: 0,
          left: 0,
          top: 0,
          width: 0,
          height: 0,
          defineName: '',
          rowCount: 1,
          colCount: 1,
        },
        EditorStatus.EDIT_FORMULA_BAR,
        {
          isBold: true,
          isItalic: true,
          isStrike: true,
          fontColor: 'green',
          fontSize: 12,
          fontFamily: 'serif',
          fillColor: 'red',
          isWrapText: false,
          underline: EUnderLine.NONE,
          verticalAlign: EVerticalAlign.TOP,
          horizontalAlign: EHorizontalAlign.LEFT,
          numberFormat: '',
          isMergeCell: false,
          mergeType: '',
        },
      ),
    ).toEqual(result);
  });
  test('EDIT_CELL', () => {
    const result: CSSProperties = {
      fontStyle: 'italic',
      fontWeight: 'bold',
      fontFamily: 'serif',
      fontSize: 12,
      backgroundColor: 'red',
      color: 'green',
      textDecorationLine: 'line-through',
      left: 0,
      top: 0,
      width: 100,
      height: 100,
      borderRadius: 0,
    };
    expect(
      getEditorStyle(
        {
          value: '',
          displayValue: '',
          row: 0,
          col: 0,
          left: 0,
          top: 0,
          width: 100,
          height: 100,
          defineName: '',
          rowCount: 1,
          colCount: 1,
        },
        EditorStatus.EDIT_CELL,
        {
          isBold: true,
          isItalic: true,
          isStrike: true,
          fontColor: 'green',
          fontSize: 12,
          fontFamily: 'serif',
          fillColor: 'red',
          isWrapText: false,

          underline: EUnderLine.NONE,
          verticalAlign: EVerticalAlign.TOP,
          horizontalAlign: EHorizontalAlign.LEFT,
          numberFormat: '',
          isMergeCell: false,
          mergeType: '',
        },
      ),
    ).toEqual(result);
  });
});
