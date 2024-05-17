import type { ChartType } from 'chart.js';
import { $ } from '@/i18n';

export const CHART_TYPE_LIST: Array<{
  value: ChartType;
  label: string;
}> = [
  {
    value: 'line',
    label: $('line-chart'),
  },
  {
    value: 'bar',
    label: $('bar-chart'),
  },
  {
    value: 'pie',
    label: $('pie-chart'),
  },
  {
    value: 'scatter',
    label: $('scatter-chart'),
  },
  {
    value: 'radar',
    label: $('radar-chart'),
  },
  {
    value: 'polarArea',
    label: $('polar-area-chart'),
  },
];

export const DEFAULT_FORMAT_CODE = 'General';
export const DEFAULT_TEXT_FORMAT_CODE = '@';
export const NUMBER_FORMAT_LIST: Array<{
  formatCode: string;
  id: number;
}> = [
  { formatCode: DEFAULT_FORMAT_CODE, id: 0 },
  { formatCode: '0', id: 1 },
  { formatCode: '0.00', id: 2 },
  { formatCode: '#,##0', id: 3 },
  { formatCode: '#,##0.00', id: 4 },
  { formatCode: '"$"#,##0.00_);[Red]("$"#,##0.00)', id: 8 },
  { formatCode: '0%', id: 9 },
  { formatCode: '0.00%', id: 10 },
  { formatCode: '0.00E+00', id: 11 },
  { formatCode: '# ?/?', id: 12 },
  { formatCode: '# ??/??', id: 13 },
  { formatCode: 'mm-dd-yy', id: 14 },
  { formatCode: 'd-mmm-yy', id: 15 },
  { formatCode: 'd-mmm', id: 16 },
  { formatCode: 'mmm-yy', id: 17 },
  { formatCode: 'h:mm AM/PM', id: 18 },
  { formatCode: 'h:mm:ss AM/PM', id: 19 },
  { formatCode: 'h:mm', id: 20 },
  { formatCode: 'h:mm:ss', id: 21 },
  { formatCode: 'm/d/yy h:mm', id: 22 },
  {
    formatCode: 'yyyy"年"m"月"',
    id: 27,
  },
  { formatCode: '#,##0 ;(#,##0)', id: 37 },
  { formatCode: '#,##0 ;[Red](#,##0)', id: 38 },
  { formatCode: '#,##0.00 ;(#,##0.00)', id: 39 },
  { formatCode: '#,##0.00 ;[Red](#,##0.00)', id: 40 },
  {
    formatCode: '_("$"* #,##0.00_);_("$"* (#,##0.00);_("$"* "-"??_);_(@_)',
    id: 44,
  },
  { formatCode: 'mm:ss', id: 45 },
  { formatCode: '[h]:mm:ss', id: 46 },
  { formatCode: 'mmss.0', id: 47 },
  { formatCode: '##0.0E+0', id: 48 },
  { formatCode: DEFAULT_TEXT_FORMAT_CODE, id: 49 },
  {
    formatCode: '上午/下午 h"时"mm"分"ss"秒"',
    id: 56,
  },
];

export const getFormatCode = (id: number): string =>
  NUMBER_FORMAT_LIST.find((v) => v.id === id)!.formatCode;
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
  //   label: $('more-number-formats'),
  //   disabled: false,
  // },
];
