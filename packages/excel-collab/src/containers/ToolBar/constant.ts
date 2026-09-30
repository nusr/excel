import i18n from '../../i18n';
import { EUnderLine, OptionItem, EMergeCellType } from '../../types';
import { getFormatCode } from '../../util';

export const underlineOptionList: OptionItem[] = [
  {
    value: EUnderLine.NONE,
    label: i18n.t('none'),
  },
  {
    value: EUnderLine.SINGLE,
    label: i18n.t('single-underline'),
  },
  {
    value: EUnderLine.DOUBLE,
    label: i18n.t('double-underline'),
  },
];

export const mergeOptionList: OptionItem[] = [
  {
    value: EMergeCellType.MERGE_CENTER,
    label: i18n.t('merge-and-center'),
  },
  {
    value: EMergeCellType.MERGE_CELL,
    label: i18n.t('merge-cells'),
  },
  {
    value: EMergeCellType.MERGE_CONTENT,
    label: i18n.t('merge-content'),
  },
];

export const numberFormatOptionList = [
  {
    value: getFormatCode(0),
    label: i18n.t('general'),
  },
  {
    value: getFormatCode(2),
    label: i18n.t('number'),
  },
  {
    value: getFormatCode(8),
    label: i18n.t('currency'),
  },
  {
    value: getFormatCode(44),
    label: i18n.t('accounting'),
  },
  {
    value: i18n.t('short-date-format'),
    label: i18n.t('short-date'),
  },
  {
    value: i18n.t('long-date-format'),
    label: i18n.t('long-date'),
  },
  {
    value: i18n.t('time-format'),
    label: i18n.t('time'),
  },
  {
    value: getFormatCode(10),
    label: i18n.t('percentage'),
  },
  {
    value: getFormatCode(12),
    label: i18n.t('fraction'),
  },
  {
    value: getFormatCode(11),
    label: i18n.t('scientific'),
  },
  {
    value: getFormatCode(49),
    label: i18n.t('text'),
  },
  // {
  //   value: '',
  //   label: ('more-number-formats'),
  // },
];
