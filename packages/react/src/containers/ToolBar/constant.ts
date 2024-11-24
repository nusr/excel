import { $ } from '../../i18n';
import {
  EUnderLine,
  OptionItem,
  EMergeCellType,
  getFormatCode,
} from '@excel/shared';

export const underlineOptionList: OptionItem[] = [
  {
    value: EUnderLine.NONE,
    label: $('none'),
    disabled: false,
  },
  {
    value: EUnderLine.SINGLE,
    label: $('single-underline'),
    disabled: false,
  },
  {
    value: EUnderLine.DOUBLE,
    label: $('double-underline'),
    disabled: false,
  },
];

export const mergeOptionList: OptionItem[] = [
  {
    value: EMergeCellType.MERGE_CENTER,
    label: $('merge-and-center'),
    disabled: false,
  },
  {
    value: EMergeCellType.MERGE_CELL,
    label: $('merge-cells'),
    disabled: false,
  },
  {
    value: EMergeCellType.MERGE_CONTENT,
    label: $('merge-content'),
    disabled: false,
  },
];

export const numberFormatOptionList = [
  {
    value: getFormatCode(0),
    label: $('general'),
    disabled: false,
  },
  {
    value: getFormatCode(2),
    label: $('number'),
    disabled: false,
  },
  {
    value: getFormatCode(8),
    label: $('currency'),
    disabled: false,
  },
  {
    value: getFormatCode(44),
    label: $('accounting'),
    disabled: false,
  },
  {
    value: $('short-date-format'),
    label: $('short-date'),
    disabled: false,
  },
  {
    value: $('long-date-format'),
    label: $('long-date'),
    disabled: false,
  },
  {
    value: $('time-format'),
    label: $('time'),
    disabled: false,
  },
  {
    value: getFormatCode(10),
    label: $('percentage'),
    disabled: false,
  },
  {
    value: getFormatCode(12),
    label: $('fraction'),
    disabled: false,
  },
  {
    value: getFormatCode(11),
    label: $('scientific'),
    disabled: false,
  },
  {
    value: getFormatCode(49),
    label: $('text'),
    disabled: false,
  },
  // {
  //   value: '',
  //   label: ('more-number-formats'),
  //   disabled: false,
  // },
];
