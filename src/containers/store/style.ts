import {
  StyleType,
  EUnderLine,
  EHorizontalAlign,
  EVerticalAlign,
} from '@/types';
import { DEFAULT_FONT_SIZE, getThemeColor, DEFAULT_FORMAT_CODE } from '@/util';
import { BaseStore } from './base';

export type StyleStoreType = StyleType & {
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

export const styleStore = new BaseStore<StyleStoreType>(cellData);
