import i18n from '../../i18n';
import { EUnderLine, OptionItem, EMergeCellType } from '../../types';
import { getFormatCode } from '../../util';

export const underlineOptionList: OptionItem[] = [
  {
    value: EUnderLine.NONE,
    label: i18n.t('none'),
    disabled: false,
  },
  {
    value: EUnderLine.SINGLE,
    label: i18n.t('single-underline'),
    disabled: false,
  },
  {
    value: EUnderLine.DOUBLE,
    label: i18n.t('double-underline'),
    disabled: false,
  },
];

export const mergeOptionList: OptionItem[] = [
  {
    value: EMergeCellType.MERGE_CENTER,
    label: i18n.t('merge-and-center'),
    disabled: false,
  },
  {
    value: EMergeCellType.MERGE_CELL,
    label: i18n.t('merge-cells'),
    disabled: false,
  },
  {
    value: EMergeCellType.MERGE_CONTENT,
    label: i18n.t('merge-content'),
    disabled: false,
  },
];

export const numberFormatOptionList = [
  {
    value: getFormatCode(0),
    label: i18n.t('general'),
    disabled: false,
  },
  {
    value: getFormatCode(2),
    label: i18n.t('number'),
    disabled: false,
  },
  {
    value: getFormatCode(8),
    label: i18n.t('currency'),
    disabled: false,
  },
  {
    value: getFormatCode(44),
    label: i18n.t('accounting'),
    disabled: false,
  },
  {
    value: i18n.t('short-date-format'),
    label: i18n.t('short-date'),
    disabled: false,
  },
  {
    value: i18n.t('long-date-format'),
    label: i18n.t('long-date'),
    disabled: false,
  },
  {
    value: i18n.t('time-format'),
    label: i18n.t('time'),
    disabled: false,
  },
  {
    value: getFormatCode(10),
    label: i18n.t('percentage'),
    disabled: false,
  },
  {
    value: getFormatCode(12),
    label: i18n.t('fraction'),
    disabled: false,
  },
  {
    value: getFormatCode(11),
    label: i18n.t('scientific'),
    disabled: false,
  },
  {
    value: getFormatCode(49),
    label: i18n.t('text'),
    disabled: false,
  },
  // {
  //   value: '',
  //   label: ('more-number-formats'),
  //   disabled: false,
  // },
];
