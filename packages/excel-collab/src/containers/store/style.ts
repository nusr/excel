import {
  StyleType,
  EUnderLine,
  EHorizontalAlign,
  EVerticalAlign,
} from '../../types';
import { DEFAULT_FONT_SIZE, DEFAULT_FORMAT_CODE } from '../../util';
import { getThemeColor } from '../../theme';
import { create } from 'zustand';

export type StyleStoreType = Omit<StyleType, 'border'> & {
  isMergeCell: boolean;
  mergeType: string;
};

const cellData: StyleStoreType = {
  isBold: false,
  isItalic: false,
  isStrike: false,
  fontColor: getThemeColor('contentColor'),
  fontSize: DEFAULT_FONT_SIZE,
  fontFamily: '',
  fillColor: '',
  isWrapText: false,
  underline: EUnderLine.NONE,
  verticalAlign: EVerticalAlign.TOP,
  horizontalAlign: EHorizontalAlign.LEFT,
  numberFormat: DEFAULT_FORMAT_CODE,
  isMergeCell: false,
  mergeType: '',
};

export const useStyleStore = create<StyleStoreType>(() => ({
  ...cellData,
}));
