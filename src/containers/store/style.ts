import {
  StyleType,
  EUnderLine,
  EHorizontalAlign,
  EVerticalAlign,
} from '@/types';
import { NUMBER_FORMAT_LIST, DEFAULT_FONT_SIZE, getThemeColor } from '@/util';
import { BaseStore } from './base';

export type StyleStoreType = StyleType & { isMergeCell: boolean };

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
  numberFormat: NUMBER_FORMAT_LIST[0].id,
  isMergeCell: false,
};

export const styleStore = new BaseStore<StyleStoreType>(cellData);