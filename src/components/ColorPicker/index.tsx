import { h, FunctionComponent, CSSProperties } from '@/react';
export type ColorPickerProps = {
  color: string;
  style?: CSSProperties;
  onChange: (value: string) => void;
};
export const COLOR_LIST = [
  '#4D4D4D',
  '#999999',
  '#FFFFFF',
  '#F44E3B',
  '#FE9200',
  '#FCDC00',
  '#DBDF00',
  '#A4DD00',
  '#68CCCA',
  '#73D8FF',
  '#AEA1FF',
  '#FDA1FF',
  '#333333',
  '#808080',
  '#cccccc',
  '#D33115',
  '#E27300',
  '#FCC400',
  '#B0BC00',
  '#68BC00',
  '#16A5A5',
  '#009CE0',
  '#7B64FF',
  '#FA28FF',
  '#000000',
  '#666666',
  '#B3B3B3',
  '#9F0500',
  '#C45100',
  '#FB9E00',
  '#808900',
  '#194D33',
  '#0C797D',
  '#0062B1',
  '#653294',
  '#AB149E',
];

export const ColorPicker: FunctionComponent<ColorPickerProps> = (
  props,
  ...children
) => {
  const { color, style = {}, onChange } = props;
  return h(
    'div',
    {
      className: 'relative color-picker',
      style: style,
    },
    h(
      'div',
      {
        className: 'color-picker-trigger',
        style: {
          color,
        },
      },
      ...children,
    ),

    h(
      'div',
      {
        className: 'color-picker-wrapper',
      },
      h(
        'div',
        {
          className: 'color-picker-list',
        },
        ...COLOR_LIST.map((item) =>
          h('div', {
            key: item,
            className: 'color-picker-item',
            style: {
              backgroundColor: item,
            },
            onclick: () => {
              onChange(item);
            },
          }),
        ),
      ),
    ),
  );
};
ColorPicker.displayName = 'ColorPicker';
