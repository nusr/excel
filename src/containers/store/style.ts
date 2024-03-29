import {
  StyleType,
  EVerticalAlign,
  EHorizontalAlign,
  EUnderLine,
} from '@/types';
import { NUMBER_FORMAT_LIST } from '@/util';
import { BaseStore } from './base';

export type StyleData = StyleType & { isMergeCell: boolean };

const cellData: StyleData = {
  fontColor: '',
  fillColor: '',
  fontSize: 0,
  fontFamily: '',
  verticalAlign: EVerticalAlign.TOP,
  horizontalAlign: EHorizontalAlign.LEFT,
  isWrapText: false,
  underline: EUnderLine.NONE,
  isItalic: false,
  isBold: false,
  isStrike: false,
  numberFormat: NUMBER_FORMAT_LIST[0].id,
  isMergeCell: false,
};

export const styleStore = new BaseStore<StyleData>(cellData);
